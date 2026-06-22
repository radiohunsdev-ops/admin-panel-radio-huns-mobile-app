import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Show from "@/models/show";
import "@/models/host";
interface RouteProps {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  request: Request,
  { params }: RouteProps
) {
  try {
    await connectDB();

    const { id } =
      await params;

    const show =
      await Show.findById(id)
        .populate(
          "host",
          "hostName"
        );

    if (!show) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Show not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: show,
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
  { params }: RouteProps
) {
  try {
    await connectDB();

    const { id } =
      await params;

    const body =
      await request.json();

    const show =
      await Show.findByIdAndUpdate(
        id,
        body,
        {
          new: true,
          runValidators: true,
        }
      ).populate(
        "host",
        "hostName"
      );

    if (!show) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Show not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Show updated successfully",
      data: show,
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
  { params }: RouteProps
) {
  try {
    await connectDB();

    const { id } =
      await params;

    const show =
      await Show.findByIdAndDelete(
        id
      );

    if (!show) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Show not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Show deleted successfully",
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