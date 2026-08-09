import { NextRequest, NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "@/models/User";

const GOOGLE_WEB_CLIENT_ID =
  "56211071589-j9dreampam70sge377qpqd5nvjp5g0mr.apps.googleusercontent.com";

const JWT_SECRET = process.env.JWT_SECRET!;

const client = new OAuth2Client(GOOGLE_WEB_CLIENT_ID);

async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;

  await mongoose.connect(process.env.MONGODB_URI!);
}

export async function POST(req: NextRequest) {
  try {
    const { idToken } = await req.json();

    if (!idToken) {
      return NextResponse.json(
        { message: "idToken is required" },
        { status: 400 }
      );
    }

    // Verify Google ID token
    const ticket = await client.verifyIdToken({
      idToken,
      audience: GOOGLE_WEB_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email) {
      return NextResponse.json(
        { message: "Invalid Google token" },
        { status: 401 }
      );
    }

    await connectDB();

    const {
      email,
      name,
      picture,
      email_verified,
    } = payload;

    const normalizedEmail = email.toLowerCase();

    let user = await User.findOne({
      email: normalizedEmail,
    });

    // Create new Google user
    if (!user) {
      user = await User.create({
        fullName: name || "Google User",
        email: normalizedEmail,
        profileImage: picture || "",
        provider: "google",
        emailVerified: !!email_verified,
      });
    } else {
      // Existing user
      if (!user.profileImage && picture) {
        user.profileImage = picture;
        await user.save();
      }
    }

    // Create your application JWT
    const token = jwt.sign(
      {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      {
        expiresIn: "30d",
      }
    );

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
      },
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Google auth error:", error);

    return NextResponse.json(
      {
        message:
          error?.message || "Google authentication failed",
      },
      { status: 500 }
    );
  }
}