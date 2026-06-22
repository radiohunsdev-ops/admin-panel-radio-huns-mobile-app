import { deleteUser, getUserById, updateUser } from "@/service/user.service";
import { NextResponse } from "next/server";



export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  const { id } =
    await params;

  const user =
    await getUserById(id);

  return NextResponse.json({
    success: true,
    data: user,
  });
}

export async function PUT(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  const { id } =
    await params;

  const body =
    await request.json();

  const user =
    await updateUser(
      id,
      body
    );

  return NextResponse.json({
    success: true,
    data: user,
  });
}

export async function DELETE(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  const { id } =
    await params;

  await deleteUser(id);

  return NextResponse.json({
    success: true,
  });
}