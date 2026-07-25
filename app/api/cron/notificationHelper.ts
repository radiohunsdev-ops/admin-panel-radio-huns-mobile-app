import mongoose from "mongoose";
import { sendExpoPushNotification } from "@/lib/expoPush";
import NotificationLog from "@/models/NotificationLog";
import NotificationSubscription, { INotificationSubscription } from "@/models/NotificationSubscription";
import { ISchedule } from "@/models/schedules";

import { currentDayInTimezone, currentMinutesInTimezone, minutesUntilShow, shouldSend15Min, shouldSend30Min, shouldSendStartNow, timeStringToMinutes,
} from "@/lib/timeHelper";

interface ProcessNotificationParams {
  schedule: ISchedule;
  subscriptions: INotificationSubscription[];
}

type NotificationType = "30_MIN" | "15_MIN" | "START_NOW";
type LogType = "30min" | "15min" | "start";

const notificationConfig: Record<
  NotificationType,
  {
    logType: LogType;
    body: (showName: string) => string;
    enabled: (subscription: INotificationSubscription) => boolean;
  }
> = {
  "30_MIN": {
    logType: "30min",
    body: (show) => `${show} starts in 30 minutes`,
    enabled: (s) => s.notify30Min,
  },
  "15_MIN": {
    logType: "15min",
    body: (show) => `${show} starts in 15 minutes`,
    enabled: (s) => s.notify15Min,
  },
  START_NOW: {
    logType: "start",
    body: (show) => `${show} is live now`,
    enabled: (s) => s.notifyStartNow,
  },
};

export async function processScheduleNotifications({
  schedule,
  subscriptions,
}: ProcessNotificationParams) {
  let sent = 0;
  const failed: string[] = [];

  if (!schedule || subscriptions.length === 0) {
    return { sent, failed };
  }

  const show =
    schedule.show instanceof mongoose.Types.ObjectId ? null : schedule.show;

  if (!show) {
    return { sent, failed };
  }

  const currentDay = currentDayInTimezone("America/Toronto");
  const currentMinutes = currentMinutesInTimezone("America/Toronto");

  const remaining = minutesUntilShow({
    currentDay,
    scheduleDay: schedule.day,
    currentMinutes,
    showMinutes: timeStringToMinutes(schedule.startTime),
  });

  if (remaining < 0) {
    return { sent, failed };
  }


  let notificationType: NotificationType | null = null;

  if (shouldSendStartNow(remaining)) {
    notificationType = "START_NOW";
  } else if (shouldSend15Min(remaining)) {
    notificationType = "15_MIN";
  } else if (shouldSend30Min(remaining)) {
    notificationType = "30_MIN";
  }

  if (!notificationType) {
    return { sent, failed };
  }

  const config = notificationConfig[notificationType];


  for (const subscription of subscriptions) {
    try {
      if (
        !subscription.active ||
        !subscription.expoPushToken ||
        !config.enabled(subscription)
      ) {
        continue;
      }

      const existingLog = await NotificationLog.findOne({
        user: subscription.user,
        schedule: schedule._id,
        type: config.logType,
        status: "sent",
      });

      if (existingLog) {
        continue;
      }

      const body = config.body(show.showName);

      const log = await NotificationLog.create({
        user: subscription.user,
        schedule: schedule._id,
        show: show._id,
        expoPushToken: subscription.expoPushToken,
        type: config.logType,
        title: show.showName,
        body,
        status: "pending",
      });

      const response = await sendExpoPushNotification({
        to: subscription.expoPushToken,
        title: show.showName || "Radio Show",
        body,
        data: {
          scheduleId: schedule._id.toString(),
          showId: show._id.toString(),
          type: notificationType,
          remaining,
        },
      });

      if (response.success) {
        await NotificationLog.findByIdAndUpdate(log._id, {
          status: "sent",
          sentAt: new Date(),
        });

        sent++;
        continue;
      }

      const errorMessage = response.error ?? "Expo notification failed";

      console.error("Expo failed:", errorMessage);

      if (errorMessage.includes("DeviceNotRegistered")) {
        await NotificationSubscription.findByIdAndUpdate(subscription._id, {
          active: false,
        });

      }

      await NotificationLog.findByIdAndUpdate(log._id, {
        status: "failed",
        error: errorMessage,
      });

      failed.push(subscription.user.toString());
    } catch (error) {
      console.error("Notification error:", error);
      failed.push(subscription.user.toString());
    }
  }

  return {
    sent,
    failed,
  };
}