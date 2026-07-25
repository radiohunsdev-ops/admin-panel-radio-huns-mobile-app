import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "@/models/User";
import { connectDB } from "@/lib/db";
import { generateToken } from "@/lib/jwt";

const JWT_SECRET = process.env.JWT_SECRET!;

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

  if (!user) {
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