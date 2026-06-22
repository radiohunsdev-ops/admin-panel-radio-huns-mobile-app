import { NextResponse } from "next/server";

import LiveStream from "@/models/LiveStream";
import { connectDB } from "@/lib/db";

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
  try {
    await connectDB();

    const { id } =
      await params;

    const stream =
      await LiveStream.findById(id);

    if (!stream) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Stream not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: stream,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong",
      },
      { status: 500 }
    );
  }
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
  try {
    await connectDB();

    const { id } =
      await params;

    const body =
      await request.json();

    const stream =
      await LiveStream.findByIdAndUpdate(
        id,
        body,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!stream) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Stream not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Stream updated successfully",
      data: stream,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong",
      },
      { status: 400 }
    );
  }
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
  try {
    await connectDB();

    const { id } =
      await params;

    const stream =
      await LiveStream.findByIdAndDelete(
        id
      );

    if (!stream) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Stream not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Stream deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong",
      },
      { status: 500 }
    );
  }
}