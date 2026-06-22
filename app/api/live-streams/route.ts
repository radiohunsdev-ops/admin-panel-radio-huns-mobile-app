import { NextResponse } from "next/server";
import LiveStream from "@/models/LiveStream";
import { connectDB } from "@/lib/db";

export async function GET() {
  try {
    await connectDB();

    const streams =
      await LiveStream.find().sort({
        createdAt: -1,
      });

    return NextResponse.json({
      success: true,
      count: streams.length,
      data: streams,
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

export async function POST(
  request: Request
) {
  try {
    await connectDB();

    const body =
      await request.json();

    const stream =
      await LiveStream.create(body);

    return NextResponse.json(
      {
        success: true,
        message:
          "Stream created successfully",
        data: stream,
      },
      { status: 201 }
    );
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