import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import NotificationSubscription from "@/models/NotificationSubscription";
import Schedule from "@/models/schedules";
import "@/models/show";
import { processScheduleNotifications } from "../notificationHelper";

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized",
      },
      { status: 401 }
    );
  }

  try {
    await connectDB();

    const [schedules, subscriptions] = await Promise.all([
      Schedule.find({
        status: "published",
        enableSubscriptions: true,
      }).populate("show"),

      NotificationSubscription.find({
        active: true,
      }),
    ]);

    const subscriptionMap = new Map<string, typeof subscriptions>();

    for (const subscription of subscriptions) {
      const scheduleId = subscription.schedule.toString();

      if (!subscriptionMap.has(scheduleId)) {
        subscriptionMap.set(scheduleId, []);
      }

      subscriptionMap.get(scheduleId)!.push(subscription);
    }

    let totalSubscribers = 0;

    const results = await Promise.all(
      schedules.map(async (schedule) => {
        const scheduleSubscriptions =
          subscriptionMap.get(schedule._id.toString()) ?? [];

        totalSubscribers += scheduleSubscriptions.length;

        if (!scheduleSubscriptions.length) {
          return 0;
        }

        const { sent } = await processScheduleNotifications({
          schedule,
          subscriptions: scheduleSubscriptions,
        });

        return sent;
      })
    );

    const totalNotifications = results.reduce((sum, sent) => sum + sent, 0);

    return NextResponse.json({
      success: true,
      summary: {
        schedules: schedules.length,
        subscribers: totalSubscribers,
        notifications: totalNotifications,
      },
    });
  } catch (error) {
    console.error("Cron notification error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}