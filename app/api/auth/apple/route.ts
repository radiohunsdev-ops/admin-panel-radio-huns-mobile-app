import { NextRequest, NextResponse } from "next/server";
import {
  createRemoteJWKSet,
  jwtVerify,
} from "jose";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "@/models/User";

const APPLE_CLIENT_ID = "com.radiohuns.admin";
const EXPO_CLIENT_ID = "host.exp.Exponent";

const JWT_SECRET = process.env.JWT_SECRET!;

const appleKeys = createRemoteJWKSet(
  new URL("https://appleid.apple.com/auth/keys"),
  {
    timeoutDuration: 10000,
    cooldownDuration: 30000,
    cacheMaxAge: 600000,
  }
);

async function connectDB() {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  await mongoose.connect(process.env.MONGODB_URI!);
}

export async function POST(req: NextRequest) {
  try {
    const {
      identityToken,
      email,
      fullName,
    } = await req.json();

    if (!identityToken) {
      return NextResponse.json(
        {
          message: "Apple identityToken is required",
        },
        { status: 400 }
      );
    }

    console.log("Verifying Apple token...");

    const { payload } = await jwtVerify(
      identityToken,
      appleKeys,
      {
        issuer: "https://appleid.apple.com",

        // Expo Go:
        // host.exp.Exponent
        //
        // Production EAS app:
        // com.radiohuns.admin
        audience: [
          APPLE_CLIENT_ID,
          EXPO_CLIENT_ID,
        ],
      }
    );

    console.log(
      "Apple token verified:",
      payload.sub
    );

    console.log(
      "Apple token audience:",
      payload.aud
    );

    if (!payload.sub) {
      return NextResponse.json(
        {
          message: "Invalid Apple token: missing user ID",
        },
        { status: 401 }
      );
    }

    await connectDB();

    const appleUserId = payload.sub;

    const appleEmail =
      typeof payload.email === "string"
        ? payload.email
        : email;

    const normalizedEmail = appleEmail
      ? appleEmail.toLowerCase().trim()
      : "";

    let user = await User.findOne({
      appleUserId,
    });

    /*
     * If this Apple account has never been linked,
     * try matching the existing account by email.
     */
    if (!user && normalizedEmail) {
      user = await User.findOne({
        email: normalizedEmail,
      });

      if (user) {
        user.appleUserId = appleUserId;
        user.provider = "apple";
        user.emailVerified = true;

        await user.save();
      }
    }

    /*
     * Create a new account.
     */
    if (!user) {
      const firstName =
        fullName?.givenName || "";

      const lastName =
        fullName?.familyName || "";

      const generatedName =
        `${firstName} ${lastName}`.trim();

      user = await User.create({
        fullName:
          generatedName || "Apple User",

        email: normalizedEmail,

        profileImage: "",

        provider: "apple",

        appleUserId,

        emailVerified: true,
      });
    }

    /*
     * Create your application JWT.
     */
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
        id: user._id.toString(),
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage || "",
      },
    });
  } catch (error: unknown) {
  console.error("Apple authentication error:", error);

  if (
    error instanceof Error &&
    "code" in error &&
    error.code === "ERR_JWKS_TIMEOUT"
  ) {
    return NextResponse.json(
      {
        message:
          "Unable to connect to Apple's authentication servers. Please try again.",
      },
      { status: 503 }
    );
  }

  if (
    error instanceof Error &&
    "code" in error &&
    error.code === "ERR_JWT_CLAIM_VALIDATION_FAILED"
  ) {
    return NextResponse.json(
      {
        message: `Invalid Apple token: ${
          "claim" in error
            ? String(error.claim)
            : "claim"
        } validation failed`,
      },
      { status: 401 }
    );
  }

  return NextResponse.json(
    {
      message:
        error instanceof Error
          ? error.message
          : "Apple authentication failed",
    },
    { status: 500 }
  );
}}