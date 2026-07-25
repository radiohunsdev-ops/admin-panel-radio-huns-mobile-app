import { NextResponse } from "next/server";
import NotificationSubscription from "@/models/NotificationSubscription";
import Schedule from "@/models/schedules";
import { connectDB } from "@/lib/db";
import { processScheduleNotifications } from "../notificationHelper";
import "@/models/show";
export async function GET() {
  try {
    await connectDB();

    const schedules = await Schedule.find({
      status: "published",
      enableSubscriptions: true,
    }).populate("show");

    const totalSchedules = schedules.length;
    let totalSubscribers = 0;
    let totalNotifications = 0;

    for (const schedule of schedules) {
      const subscriptions = await NotificationSubscription.find({
        schedule: schedule._id,
        active: true,
      });

      totalSubscribers += subscriptions.length;

      if (!subscriptions.length) {
        continue;
      }

      const result = await processScheduleNotifications({
        schedule,
        subscriptions,
      });

      totalNotifications += result.sent;
    }

    return NextResponse.json({
      success: true,
      summary: {
        schedules: totalSchedules,
        subscribers: totalSubscribers,
        notifications: totalNotifications,
      },
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
