
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import ArchivedShow from "@/models/ArchivedShow";
import { connectDB } from "@/lib/db";

type RouteContext = {
  params: Promise<{ id: string }>;
};

// GET /api/archive/show/:showId?page=1&limit=20
export async function GET(
  request: NextRequest,
  { params }: RouteContext,
) {
  try {
    await connectDB();

const { id: showId } = await params;

    if (!mongoose.isValidObjectId(showId)) {
      return NextResponse.json(
        { success: false, message: "Invalid show ID." },
        { status: 400 },
      );
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.min(
      100,
      Math.max(1, Number(searchParams.get("limit")) || 20),
    );

    const filter = {
      show: new mongoose.Types.ObjectId(showId),
      status: "published" as const,
    };

    const [episodes, total] = await Promise.all([
      ArchivedShow.find(filter)
        .sort({ broadcastDate: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),

      ArchivedShow.countDocuments(filter),
    ]);

    return NextResponse.json({
      success: true,
      data: episodes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Fetch show archive error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch show archive." },
      { status: 500 },
    );
  }
}
