import { NextResponse } from "next/server";

import { verifyToken } from "@/service/auth.service";
import { changePassword } from "@/service/user.service";

export async function PUT(request: Request) {
  try {
    const token = request.headers
      .get("authorization")
      ?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Authorization token missing",
        },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);

    if (!payload) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid token",
        },
        { status: 401 }
      );
    }

    const { currentPassword, newPassword } =
      await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Current password and new password are required",
        },
        { status: 400 }
      );
    }

    await changePassword(
      payload.id,
      currentPassword,
      newPassword
    );

    return NextResponse.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong",
      },
      { status: 400 }
    );
  }
}