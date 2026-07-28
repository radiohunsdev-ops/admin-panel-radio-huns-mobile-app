import { NextRequest, NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";

import { connectDB } from "@/lib/db";
import User from "@/models/User";

const client = new OAuth2Client(
  process.env.GOOGLE_WEB_CLIENT_ID
);

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { idToken } = await req.json();

    if (!idToken) {
      return NextResponse.json(
        { message: "ID Token is required" },
        { status: 400 }
      );
    }

    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_WEB_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      return NextResponse.json(
        { message: "Invalid Google token" },
        { status: 401 }
      );
    }

    const {
      email,
      name,
      picture,
      email_verified,
    } = payload;

    if (!email) {
      return NextResponse.json(
        { message: "Email not found" },
        { status: 400 }
      );
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        fullName: name,
        email,
        profileImage: picture || "",
        provider: "google",
        emailVerified: email_verified ?? true,
        password: "",
        role: "user",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "7d",
      }
    );

    return NextResponse.json({
      success: true,
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profileImage: user.profileImage,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Google login failed",
      },
      {
        status: 500,
      }
    );
  }
}