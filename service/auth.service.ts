import bcrypt from "bcryptjs";

import User from "@/models/User";
import { connectDB } from "@/lib/db";
import { generateToken } from "@/lib/jwt";

export async function login(
  email: string,
  password: string
) {
  await connectDB();

  const user = await User.findOne({
    email,
  }).select("+password");

  if (!user) {
    throw new Error(
      "Invalid credentials"
    );
  }

  const isMatch =
    await bcrypt.compare(
      password,
      user.password
    );

  if (!isMatch) {
    throw new Error(
      "Invalid credentials"
    );
  }

  const token =
    await generateToken({
      id: user._id.toString(),
      role: user.role,
    });

  return {
    token,
    user,
  };
}