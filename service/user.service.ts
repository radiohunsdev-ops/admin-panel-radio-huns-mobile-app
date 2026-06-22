import bcrypt from "bcryptjs";

import User from "@/models/User";
import { connectDB } from "@/lib/db";

export async function createUser(
  data: {
    fullName: string;
    email: string;
    password: string;
    phone?: string;
  }
) {
  await connectDB();

  const existingUser =
    await User.findOne({
      email: data.email,
    });

  if (existingUser) {
    throw new Error(
      "User already exists"
    );
  }

  const hashedPassword =
    await bcrypt.hash(
      data.password,
      10
    );

  return await User.create({
    ...data,
    password:
      hashedPassword,
  });
}

export async function getUsers() {
  await connectDB();

  return await User.find()
    .sort({
      createdAt: -1,
    })
    .lean();
}

export async function getUserById(
  id: string
) {
  await connectDB();

  return await User.findById(id)
    .populate(
      "favouriteShows"
    )
    .populate(
      "subscribedShows"
    )
    .lean();
}

export async function updateUser(
  id: string,
  data: Record<
    string,
    unknown
  >
) {
  await connectDB();

  return await User.findByIdAndUpdate(
    id,
    data,
    {
      new: true,
      runValidators: true,
    }
  );
}

export async function deleteUser(
  id: string
) {
  await connectDB();

  return await User.findByIdAndDelete(
    id
  );
}