import bcrypt from "bcryptjs";
import "@/models/show";
import User from "@/models/User";
import { connectDB } from "@/lib/db";

export async function createUser(data: {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
}) {
  await connectDB();

  const existingUser = await User.findOne({
    email: data.email,
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  return await User.create({
    ...data,
    password: hashedPassword,
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

export async function getUserById(id: string) {
  await connectDB();

  return await User.findById(id).populate("subscribedShows").lean();
}

export async function updateUser(id: string, data: Record<string, unknown>) {
  await connectDB();

  return await User.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
}

export async function deleteUser(id: string) {
  await connectDB();

  return await User.findByIdAndDelete(id);
}

export async function getProfile(userId: string) {
  await connectDB();

  return await User.findById(userId)
    .select("-password")
    .populate("subscribedShows", "name coverImage")
    .lean();
}

export async function updateProfile(
  userId: string,
  data: {
    fullName?: string;
    phone?: string;
    preferredLanguage?: string;
    city?: string;
    region?: string;
    profileImage?: string;
  },
) {
  await connectDB();

  const updateData: Record<string, unknown> = {};

  if (data.fullName?.trim()) {
    updateData.fullName = data.fullName.trim();
  }

  if (data.phone?.trim()) {
    updateData.phone = data.phone.trim();
  }

  if (data.preferredLanguage?.trim()) {
    updateData.preferredLanguage = data.preferredLanguage;
  }

  if (data.city?.trim()) {
    updateData.city = data.city.trim();
  }

  if (data.region?.trim()) {
    updateData.region = data.region.trim();
  }

  if (data.profileImage?.trim()) {
    updateData.profileImage = data.profileImage;
  }

  return await User.findByIdAndUpdate(
    userId,
    {
      $set: updateData,
    },
    {
      returnDocument: "after",
      runValidators: true,
    },
  ).select("-password");
}

export async function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string,
) {
  await connectDB();

  const user = await User.findById(userId).select("+password");

  if (!user) {
    throw new Error("User not found");
  }
  if (!user || !user.password) {
    throw new Error("Invalid credentials");
  }
  const isMatch = await bcrypt.compare(currentPassword, user.password);

  if (!isMatch) {
    throw new Error("Current password is incorrect");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  user.password = hashedPassword;

  await user.save();

  return true;
}

export async function deleteProfile(userId: string) {
  await connectDB();

  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  await User.findByIdAndDelete(userId);

  return true;
}
