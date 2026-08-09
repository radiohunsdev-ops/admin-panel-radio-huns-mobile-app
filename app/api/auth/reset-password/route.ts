import { resetPassword } from "@/service/auth.service";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, otp, newPassword } = await request.json();
    if (!email || !otp || !newPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Email, OTP, and new password are required",
        },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const result = await resetPassword(email, otp, newPassword);

    return NextResponse.json({ success: true, message: result.message });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Something went wrong",
      },
      { status: 400 }
    );
  }
}