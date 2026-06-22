import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Host from "@/models/host";

// GET SINGLE HOST
export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    await connectDB();

    const { id } = await params;

    const host = await Host.findById(id);

    if (!host) {
      return NextResponse.json(
        {
          success: false,
          message: "Host not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      data: host,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch host",
      },
      {
        status: 500,
      }
    );
  }
}

// UPDATE HOST
export async function PUT(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    await connectDB();

    const { id } = await params;
    const body = await request.json();

    const host =
      await Host.findByIdAndUpdate(
        id,
        {
          ...body,
        },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!host) {
      return NextResponse.json(
        {
          success: false,
          message: "Host not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Host updated successfully",
      data: host,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update host",
      },
      {
        status: 500,
      }
    );
  }
}

// DELETE HOST
export async function DELETE(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    await connectDB();

    const { id } = await params;

    const host =
      await Host.findByIdAndDelete(id);

    if (!host) {
      return NextResponse.json(
        {
          success: false,
          message: "Host not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Host deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete host",
      },
      {
        status: 500,
      }
    );
  }
}