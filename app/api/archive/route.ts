import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import ArchivedShow from "@/models/ArchivedShow";
import { connectDB } from "@/lib/db";
import Show from "@/models/show";
import Schedule from "@/models/schedules";
import { createB2PlaybackUrl } from "@/lib/b2";
export const dynamic = "force-dynamic";

// GET /api/archive?page=1&limit=20

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.min(
      100,
      Math.max(1, Number(searchParams.get("limit")) || 20),
    );

    // Only published episodes are available through the public API.
    const filter = { status: "published" as const };

    const [episodes, total] = await Promise.all([
      ArchivedShow.find(filter)
        .populate("show", "showName shortTitle coverImage host")
        .sort({ broadcastDate: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),

      ArchivedShow.countDocuments(filter),
    ]);

    const data = await Promise.all(
      episodes.map(async (episode) => ({
        ...episode,
        audioUrl: episode.storageKey
          ? await createB2PlaybackUrl(episode.storageKey)
          : episode.audioUrl,
      })),
    );

    return NextResponse.json({
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Fetch archive error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch archived shows." },
      { status: 500 },
    );
  }
}


// POST /api/archive
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Add your admin authentication/authorization here.
    const body = await request.json();

    const {
      show,
      schedule,
      title,
      description,
      host,
      broadcastDate,
      durationSeconds,
      audioUrl,
      storageKey,
      artworkUrl,
      status,
    } = body;

    if (
      !mongoose.isValidObjectId(show) ||
      !mongoose.isValidObjectId(schedule)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Valid show and schedule IDs are required.",
        },
        { status: 400 },
      );
    }

    if (
      !title?.trim() ||
      !audioUrl?.trim() ||
      !Number.isFinite(durationSeconds) ||
      durationSeconds < 1 ||
      !Number.isFinite(Date.parse(broadcastDate))
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Valid title, audio URL, broadcast date, and duration are required.",
        },
        { status: 400 },
      );
    }

    if (
      status !== undefined &&
      !["draft", "published", "archived"].includes(status)
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid archive status." },
        { status: 400 },
      );
    }

    const [showExists, scheduleExists] = await Promise.all([
      Show.exists({ _id: show }),
      Schedule.exists({ _id: schedule }),
    ]);

    if (!showExists || !scheduleExists) {
      return NextResponse.json(
        { success: false, message: "Show or schedule was not found." },
        { status: 404 },
      );
    }

    const episode = await ArchivedShow.create({
      show,
      schedule,
      title: title.trim(),
      description,
      host,
      broadcastDate: new Date(broadcastDate),
      durationSeconds,
      audioUrl: audioUrl.trim(),
      storageKey,
      artworkUrl,
      status: status ?? "draft",
    });

    return NextResponse.json(
      { success: true, message: "Archive episode created.", data: episode },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof mongoose.Error && error.name === "ValidationError") {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 },
      );
    }

    if (
      error instanceof mongoose.mongo.MongoServerError &&
      error.code === 11000
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "An archive entry already exists for this schedule and date.",
        },
        { status: 409 },
      );
    }

    console.error("Create archive error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to create archive episode." },
      { status: 500 },
    );
  }
}
