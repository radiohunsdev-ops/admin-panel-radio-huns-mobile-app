import { NextRequest, NextResponse } from "next/server";
import NotificationSubscription from "@/models/NotificationSubscription";
import { connectDB } from "@/lib/db";

const badRequest = (message: string) =>
  NextResponse.json(
    {
      success: false,
      message,
    },
    { status: 400 }
  );

const errorResponse = (error: unknown) => {
  console.error(error);

  return NextResponse.json(
    {
      success: false,
      message: error instanceof Error ? error.message : "Internal server error",
    },
    { status: 500 }
  );
};

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const {
      userId,
      scheduleId,
      expoPushToken,
      notify15Min = true,
      notify30Min = false,
      notifyStartNow = true,
    } = await req.json();

    if (!userId || !scheduleId || !expoPushToken) {
      return badRequest("Missing required fields.");
    }

    const subscription = await NotificationSubscription.findOneAndUpdate(
      {
        user: userId,
        schedule: scheduleId,
      },
      {
        expoPushToken,
        notify15Min,
        notify30Min,
        notifyStartNow,
        active: true,
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    return NextResponse.json({
      success: true,
      message: "Subscription saved successfully.",
      data: subscription,
    });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const userId = req.nextUrl.searchParams.get("userId");

    if (!userId) {
      return badRequest("userId is required.");
    }

    const subscriptions = await NotificationSubscription.find({
      user: userId,
      active: true,
    })
      .populate({
        path: "schedule",
        populate: {
          path: "show",
        },
      })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: subscriptions,
    });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();

    const { userId, scheduleId } = await req.json();

    if (!userId || !scheduleId) {
      return badRequest("Missing required fields.");
    }

    const subscription = await NotificationSubscription.findOneAndUpdate(
      {
        user: userId,
        schedule: scheduleId,
      },
      {
        active: false,
      },
      {
        new: true,
      }
    );

    if (!subscription) {
      return NextResponse.json(
        {
          success: false,
          message: "Subscription not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Subscription removed.",
    });
  } catch (error) {
    return errorResponse(error);
  }
}