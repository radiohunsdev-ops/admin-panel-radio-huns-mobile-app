import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { generateToken } from "@/lib/jwt";
import bcrypt from "bcryptjs";
import User from "@/models/User";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { fullName, email, password } = await request.json();
    if (!fullName || !email || !password) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Email already registered" },
        { status: 409 }
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      role: "user", 
    });
    const token = generateToken({ id: user._id.toString(), role: user.role });
    const response = NextResponse.json({
      success: true,
      message: "Registration successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;
  } catch (error: unknown) {
    console.error("Register Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}