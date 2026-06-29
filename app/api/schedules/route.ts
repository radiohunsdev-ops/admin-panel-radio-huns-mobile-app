import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

import Schedule from "@/models/schedules";

import "@/models/show";
import "@/models/host";

export async function GET() {
  try {
    await connectDB();

    const schedules = await Schedule.find()
      .populate({
        path: "show",
        select: "showName shortTitle  description coverImage station language",
        populate: {
          path: "host",
          select: "fullName coverImage, profileImage",
        },
      })
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: schedules.length,
      data: schedules,
    });
  } catch (error) {
    console.error("GET Schedule Error:", error);

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

    const schedule = await Schedule.create(body);

    const populatedSchedule = await Schedule.findById(schedule._id).populate({
      path: "show",
      select: "showName coverImage station language",
      populate: {
        path: "host",
        select: "fullName profileImage email city",
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Schedule created successfully",
        data: populatedSchedule,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST Schedule Error:", error);

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
