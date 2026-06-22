import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Show from "@/models/show";

export async function GET() {
  try {
    await connectDB();

    const shows = await Show.find()
      .populate("host", "fullName profileImage email city")
      .sort({
        createdAt: -1,
      });   

    return NextResponse.json({
      success: true,
      count: shows.length,
      data: shows,
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

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();

    const show = await Show.create(body);

    const populatedShow = await Show.findById(show._id).populate(
      "host",
      "hostName",
    );

    return NextResponse.json(
      {
        success: true,
        message: "Show created successfully",
        data: populatedShow,
      },
      { status: 201 },
    );
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
