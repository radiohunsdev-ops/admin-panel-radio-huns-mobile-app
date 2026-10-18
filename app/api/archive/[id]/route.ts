
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import ArchivedShow from "@/models/ArchivedShow";
import { connectDB } from "@/lib/db";
import { createB2PlaybackUrl } from "@/lib/b2";
type RouteContext = {
  params: Promise<{ id: string }>;
};

// GET /api/archive/:id

export async function GET(
  _request: NextRequest,
  { params }: RouteContext,
) {
  try {
    await connectDB();

    const { id } = await params;

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid archive ID." },
        { status: 400 },
      );
    }

    const episode = await ArchivedShow.findOne({
      _id: id,
      status: "published",
    })
      .populate("show", "showName shortTitle description coverImage host")
      .lean();

    if (!episode) {
      return NextResponse.json(
        { success: false, message: "Archived episode not found." },
        { status: 404 },
      );
    }

    const audioUrl = episode.storageKey
      ? await createB2PlaybackUrl(episode.storageKey)
      : episode.audioUrl;

    return NextResponse.json({
      success: true,
      data: {
        ...episode,
        audioUrl,
      },
    });
  } catch (error) {
    console.error("Fetch archive episode error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch archived episode." },
      { status: 500 },
    );
  }
}

// PATCH /api/archive/:id
export async function PATCH(
  request: NextRequest,
  { params }: RouteContext,
) {
  try {
    await connectDB();
    const { id } = await params;

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid archive ID." },
        { status: 400 },
      );
    }

    const body = await request.json();

    const allowedFields = [
      "title",
      "description",
      "host",
      "broadcastDate",
      "durationSeconds",
      "audioUrl",
      "storageKey",
      "artworkUrl",
      "status",
    ] as const;

    const updates: Record<string, unknown> = {};

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    if (typeof updates.title === "string") {
      updates.title = updates.title.trim();
      if (!updates.title) {
        return NextResponse.json(
          { success: false, message: "Title cannot be empty." },
          { status: 400 },
        );
      }
    }

    if (
      updates.status !== undefined &&
      !["draft", "published", "archived"].includes(
        String(updates.status),
      )
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid archive status." },
        { status: 400 },
      );
    }

    if (updates.broadcastDate !== undefined) {
      const date = new Date(String(updates.broadcastDate));

      if (!Number.isFinite(date.getTime())) {
        return NextResponse.json(
          { success: false, message: "Invalid broadcast date." },
          { status: 400 },
        );
      }

      updates.broadcastDate = date;
    }

    if (updates.durationSeconds !== undefined) {
      const duration = Number(updates.durationSeconds);

      if (!Number.isFinite(duration) || duration < 1) {
        return NextResponse.json(
          { success: false, message: "Duration must be at least one second." },
          { status: 400 },
        );
      }

      updates.durationSeconds = duration;
    }

    if (typeof updates.audioUrl === "string") {
      updates.audioUrl = updates.audioUrl.trim();

      if (!updates.audioUrl) {
        return NextResponse.json(
          { success: false, message: "Audio URL cannot be empty." },
          { status: 400 },
        );
      }
    }

    const episode = await ArchivedShow.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true },
    );

    if (!episode) {
      return NextResponse.json(
        { success: false, message: "Archived episode not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Archive episode updated.",
      data: episode,
    });
  } catch (error) {
    console.error("Update archive error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to update archive episode." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: RouteContext,
) {
  try {
    await connectDB();

    // TODO: Verify admin authentication/authorization here.

    const { id } = await params;

    console.log("Deleting archive episode:", id);

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid archive ID." },
        { status: 400 },
      );
    }

    const episode = await ArchivedShow.findByIdAndDelete(id);

    if (!episode) {
      console.log("Archive episode not found:", id);

      return NextResponse.json(
        { success: false, message: "Archived episode not found." },
        { status: 404 },
      );
    }

    console.log("Archive episode deleted:", episode._id.toString());

    return NextResponse.json({
      success: true,
      message: "Archive episode deleted.",
      data: { id: episode._id.toString() },
    });
  } catch (error) {
    console.error("Delete archive error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to delete archived episode." },
      { status: 500 },
    );
  }
}
