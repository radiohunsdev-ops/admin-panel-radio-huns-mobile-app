import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET
);

async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(
      token,
      secret
    );

    return payload;
  } catch {
    return null;
  }
}

export async function proxy(
  request: NextRequest
) {
  const token =
    request.cookies.get("token")?.value;

  const pathname =
    request.nextUrl.pathname;

  // Public Routes
  const publicRoutes = [
    "/login",
    "/forgot-password",
  ];

  // User is not logged in
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

  // Verify JWT
  const payload =
    await verifyToken(token);

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

  // Logged in user should not access login page
  if (
    publicRoutes.includes(pathname)
  ) {
    return NextResponse.redirect(
      new URL("/", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Exclude:
     * - api
     * - _next
     * - images
     * - favicon
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};