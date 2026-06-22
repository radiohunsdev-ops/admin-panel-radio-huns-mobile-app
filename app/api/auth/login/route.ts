import { login } from "@/service/auth.service";
import { NextResponse } from "next/server";


export async function POST(
  request: Request
) {
  try {
    const {
      email,
      password,
    } = await request.json();

    const {
      token,
      user,
    } = await login(
      email,
      password
    );

    const response =
      NextResponse.json({
        success: true,
        message:
          "Login successful",
        token,
        user: {
          id: user._id,
          fullName:
            user.fullName,
          email: user.email,
          role: user.role,
        },
      });

    response.cookies.set(
      "token",
      token,
      {
        httpOnly: true,
        secure:
          process.env.NODE_ENV ===
          "production",
        sameSite: "lax",
        path: "/",
        maxAge:
          60 * 60 * 24 * 7,
      }
    );

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong",
      },
      { status: 401 }
    );
  }
}