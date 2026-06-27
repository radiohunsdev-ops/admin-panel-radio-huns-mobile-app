import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Schedule from "@/models/schedules";
import "@/models/show";
import "@/models/host";
type RouteProps = {
  params: Promise<{
    id: string;
  }>;
};

/**
 * GET SINGLE SCHEDULE
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();

    const { id } = await params;

    const schedule = await Schedule.findById(id).populate({
      path: "show",
      select: "showName shortTitle  description coverImage station language",
      populate: {
        path: "host",
        select: "fullName coverImage, profileImage",
      },
    });

    if (!schedule) {
      return NextResponse.json(
        {
          success: false,
          message: "Schedule not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: schedule,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Something went wrong",
      },
      { status: 500 },
    );
  }
}

/**
 * UPDATE SCHEDULE
 */
export async function PUT(request: Request, { params }: RouteProps) {
  try {
    await connectDB();

    const { id } = await params;
    const body = await request.json();

    const schedule = await Schedule.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    }).populate({
      path: "show",
      select: "showName host station language",
    });

    if (!schedule) {
      return NextResponse.json(
        {
          success: false,
          message: "Schedule not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Schedule updated successfully",
      data: schedule,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Something went wrong",
      },
      { status: 400 },
    );
  }
}

/**
 * DELETE SCHEDULE
 */
export async function DELETE(request: Request, { params }: RouteProps) {
  try {
    await connectDB();

    const { id } = await params;

    const schedule = await Schedule.findByIdAndDelete(id);

    if (!schedule) {
      return NextResponse.json(
        {
          success: false,
          message: "Schedule not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Schedule deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Something went wrong",
      },
      { status: 500 },
    );
  }
}
