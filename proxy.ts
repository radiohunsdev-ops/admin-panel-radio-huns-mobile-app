import { verifyToken } from "@/lib/jwt";
import {
  NextRequest,
  NextResponse,
} from "next/server";



const publicRoutes = [
  "/login",
  "/forgot-password",
];

export function proxy(
  request: NextRequest
) {
  const pathname =
    request.nextUrl.pathname;

  const token =
    request.cookies.get("token")
      ?.value;

  console.log(
    "PATH:",
    pathname
  );
  console.log(
    "TOKEN:",
    token
  );

  // User not logged in
  if (!token) {
    if (
      publicRoutes.includes(pathname)
    ) {
      return NextResponse.next();
    }

    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }

  const payload =
    verifyToken(token);

  console.log(
    "PAYLOAD:",
    payload
  );

  // Invalid token
  if (!payload) {
    const response =
      NextResponse.redirect(
        new URL("/login", request.url)
      );

    response.cookies.delete(
      "token"
    );

    return response;
  }

  // Logged in user trying to access login page
  if (
    pathname === "/login" ||
    pathname.startsWith(
      "/forgot-password"
    )
  ) {
    return NextResponse.redirect(
      new URL("/", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};