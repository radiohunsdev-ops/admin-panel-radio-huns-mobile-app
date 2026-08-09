import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "@/models/User";
import { connectDB } from "@/lib/db";
import { generateToken } from "@/lib/jwt";
import crypto from "crypto";
import { sendEmail } from "@/lib/email";
const JWT_SECRET = process.env.JWT_SECRET!;
const OTP_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes
export interface JwtPayload {
  id: string;
  role: string;
}

export function verifyToken(
  token: string
): JwtPayload | null {
  try {
    return jwt.verify(
      token,
      JWT_SECRET
    ) as JwtPayload;
  } catch {
    return null;
  }
}

export async function login(
  email: string,
  password: string
) {
  await connectDB();

  const user = await User.findOne({
    email,
  }).select("+password");

  if (!user || !user.password) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(
    password,
    user.password
  );

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = generateToken({
    id: user._id.toString(),
    role: user.role,
  });

  return {
    token,
    user,
  };
}

export async function forgotPassword(email: string) {
  await connectDB();

  const user = await User.findOne({ email }).select(
    "+resetPasswordOtp +resetPasswordExpires"
  );

  // Don't reveal whether the email exists
  if (!user) {
    return { message: " An OTP has been sent to the email" };
  }

  const otp = crypto.randomInt(100000, 999999).toString();
  const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

  user.resetPasswordOtp = hashedOtp;
  user.resetPasswordExpires = new Date(Date.now() + OTP_EXPIRY_MS);
  await user.save();

  await sendEmail({
    to: user.email,
    subject: "Your password reset code",
    text: `Your OTP is ${otp}. It expires in 10 minutes.`,
  });

  return { message: " An OTP has been sent to the email" };
}

export async function resetPassword(
  email: string,
  otp: string,
  newPassword: string
) {
  await connectDB();

  const user = await User.findOne({ email }).select(
    "+password +resetPasswordOtp +resetPasswordExpires"
  );

  if (!user || !user.resetPasswordOtp || !user.resetPasswordExpires) {
    throw new Error("Invalid or expired OTP");
  }

  if (user.resetPasswordExpires.getTime() < Date.now()) {
    throw new Error("OTP has expired");
  }

  const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

  if (hashedOtp !== user.resetPasswordOtp) {
    throw new Error("Invalid or expired OTP");
  }

  user.password = await bcrypt.hash(newPassword, 10);
  user.resetPasswordOtp = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  return { message: "Password reset successful" };
}