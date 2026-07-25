// app/api/auth/admin-login/route.ts

import { login } from "@/service/auth.service";
import { NextResponse } from "next/server";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    const { token, user } = await login(email, password);

    // Admin-only gate. This endpoint is used exclusively by the
    // web admin panel — mobile app continues to use /api/auth/login
    // and is unaffected by this check.
    if (user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Access restricted to admin accounts" },
        { status: 403 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
      },
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: COOKIE_MAX_AGE,
    });

    return response;
  } catch (error) {
    console.error("Admin login error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Something went wrong",
      },
      { status: 401 }
    );
  }
}