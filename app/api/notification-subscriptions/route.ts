import { NextRequest, NextResponse } from "next/server";
import NotificationSubscription from "@/models/NotificationSubscription";
import { connectDB } from "@/lib/db";

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
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields.",
        },
        {
          status: 400,
        }
      );
    }

    const existing = await NotificationSubscription.findOne({
      user: userId,
      schedule: scheduleId,
    });

    if (existing) {
      existing.expoPushToken = expoPushToken;
      existing.notify15Min = notify15Min;
      existing.notify30Min = notify30Min;
      existing.notifyStartNow = notifyStartNow;
      existing.active = true;

      await existing.save();

      return NextResponse.json({
        success: true,
        message: "Subscription updated.",
        data: existing,
      });
    }

    const subscription = await NotificationSubscription.create({
      user: userId,
      schedule: scheduleId,
      expoPushToken,
      notify15Min,
      notify30Min,
      notifyStartNow,
      active: true,
    });

    return NextResponse.json({
      success: true,
      message: "Subscription created.",
      data: subscription,
    });
  } catch (error: unknown) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "error.message",
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const userId = req.nextUrl.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "userId is required.",
        },
        {
          status: 400,
        }
      );
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
      .sort({
        createdAt: -1,
      });

    return NextResponse.json({
      success: true,
      data: subscriptions,
    });
  } catch (error: unknown) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "error.message",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();

    const { userId, scheduleId } = await req.json();

    if (!userId || !scheduleId) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields.",
        },
        {
          status: 400,
        }
      );
    }

    await NotificationSubscription.findOneAndUpdate(
      {
        user: userId,
        schedule: scheduleId,
      },
      {
        active: false,
      }
    );

    return NextResponse.json({
      success: true,
      message: "Subscription removed.",
    });
  } catch (error: unknown) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "error.message",
      },
      {
        status: 500,
      }
    );
  }
}