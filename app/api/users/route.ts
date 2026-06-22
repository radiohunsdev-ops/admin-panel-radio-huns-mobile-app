import { createUser, getUsers } from "@/service/user.service";
import { NextResponse } from "next/server";



export async function GET() {
  const users =
    await getUsers();

  return NextResponse.json({
    success: true,
    data: users,
  });
}

export async function POST(
  request: Request
) {
  try {
    const body =
      await request.json();

    const user =
      await createUser(body);

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Error",
      },
      { status: 400 }
    );
  }
}