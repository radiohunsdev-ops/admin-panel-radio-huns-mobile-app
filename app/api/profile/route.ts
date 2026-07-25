import { verifyToken } from "@/service/auth.service";
import { NextResponse } from "next/server";
import {
  deleteProfile,
  getProfile,
  updateProfile,
} from "@/service/user.service";

 function getAuthenticatedUser(request: Request) {
  const token = request.headers
    .get("authorization")
    ?.replace("Bearer ", "");

  if (!token) {
    throw new Error("Authorization token missing");
  }

  const payload = verifyToken(token);

  if (!payload) {
    throw new Error("Invalid token");
  }

  return payload;
}



function handleError(error: unknown) {
  const message =
    error instanceof Error
      ? error.message
      : "Something went wrong";

  const status =
    message === "Authorization token missing" ||
    message === "Invalid token"
      ? 401
      : message === "User not found"
      ? 404
      : 500;

  return NextResponse.json(
    {
      success: false,
      message,
    },
    { status }
  );
}

export async function GET(request: Request) {
  try {
    const { id } = getAuthenticatedUser(request);

    const user = await getProfile(id);

    if (!user) {
      throw new Error("User not found");
    }

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error(error);
    return handleError(error);
  }
}

export async function PUT(request: Request) {
  try {
    const { id } = getAuthenticatedUser(request);

    const body = await request.json();

    const updatedUser = await updateProfile(id, body);

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error(error);
    return handleError(error);
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = getAuthenticatedUser(request);

    await deleteProfile(id);

    return NextResponse.json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return handleError(error);
  }
}