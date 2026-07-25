import mongoose from "mongoose";

import { sendExpoPushNotification } from "@/lib/expoPush";

import NotificationLog from "@/models/NotificationLog";

import NotificationSubscription, {
  INotificationSubscription,
} from "@/models/NotificationSubscription";
import { ISchedule } from "@/models/schedules";

import {
  currentDayInTimezone,
  currentMinutesInTimezone,
  minutesUntilShow,
  shouldSend15Min,
  shouldSend30Min,
  shouldSendStartNow,
  timeStringToMinutes,
} from "@/lib/timeHelper";

interface ProcessNotificationParams {
  schedule: ISchedule;
  subscriptions: INotificationSubscription[];
}

export async function processScheduleNotifications({
  schedule,
  subscriptions,
}: ProcessNotificationParams) {
  let sent = 0;
  
  const failed: string[] = [];

  if (!schedule || subscriptions.length === 0) {
    return {
      sent,
      failed,
    };
  }

  const show =
    schedule.show instanceof mongoose.Types.ObjectId ? null : schedule.show;

  if (!show) {
    return {
      sent,
      failed,
    };
  }

  const currentDay = currentDayInTimezone("America/Toronto");
  const currentMinutes = currentMinutesInTimezone("America/Toronto");
  const showMinutes = timeStringToMinutes(schedule.startTime);

  const remaining = minutesUntilShow({
    currentDay,
    scheduleDay: schedule.day,
    currentMinutes,
    showMinutes,
  });

  if (remaining < 0) {
    return {
      sent,
      failed,
    };
  }
  console.log("Remaining:", remaining);

  /*
      Decide notification type
  */

  let notificationType: "30_MIN" | "15_MIN" | "START_NOW" | null = null;

  if (shouldSendStartNow(remaining)) {
    notificationType = "START_NOW";
  } else if (shouldSend15Min(remaining)) {
    notificationType = "15_MIN";
  } else if (shouldSend30Min(remaining)) {
    notificationType = "30_MIN";
  }

  /*
      Convert for NotificationLog
  */

  let logType: "15min" | "30min" | "start" | null = null;

  if (notificationType === "30_MIN") {
    logType = "30min";
  }

  if (notificationType === "15_MIN") {
    logType = "15min";
  }

  if (notificationType === "START_NOW") {
    logType = "start";
  }

  console.log("Notification type:", notificationType);

  console.log("Log type:", logType);

  if (!notificationType || !logType) {
    return {
      sent,
      failed,
    };
  }

  /*
      SEND NOTIFICATIONS
  */

  for (const subscription of subscriptions) {
    try {
      if (!subscription.active) {
        continue;
      }

      if (!subscription.expoPushToken) {
        continue;
      }

      /*
          USER SETTINGS CHECK
      */

      if (notificationType === "30_MIN" && !subscription.notify30Min) {
        continue;
      }

      if (notificationType === "15_MIN" && !subscription.notify15Min) {
        continue;
      }

      if (notificationType === "START_NOW" && !subscription.notifyStartNow) {
        continue;
      }

      /*
          DUPLICATE CHECK
      */

      const existingLog = await NotificationLog.findOne({
        user: subscription.user,
        schedule: schedule._id,
        type: logType,
        status: "sent",
      });

      if (existingLog) {
        console.log("Duplicate skipped:", logType);

        continue;
      }

      /*
          MESSAGE
      */

      let body = "";

      if (notificationType === "30_MIN") {
        body = `${show.showName} starts in 30 minutes`;
      }

      if (notificationType === "15_MIN") {
        body = `${show.showName} starts in 15 minutes`;
      }

      if (notificationType === "START_NOW") {
        body = `${show.showName} is live now`;
      }

      /*
          CREATE LOG
      */

      const log = await NotificationLog.create({
        user: subscription.user,

        schedule: schedule._id,

        show: show._id,

        expoPushToken: subscription.expoPushToken,

        type: logType,

        title: show.showName,

        body,

        status: "pending",
      });

      /*
          SEND EXPO
      */

      const response = await sendExpoPushNotification({
        to: subscription.expoPushToken,

        title: show.showName ?? "Radio Show",

        body,

        data: {
          scheduleId: schedule._id.toString(),

          showId: show._id?.toString(),

          type: notificationType,

          remaining,
        },
      });

      /*
          UPDATE LOG
      */

      if (response.success) {
        await NotificationLog.findByIdAndUpdate(log._id, {
          status: "sent",
          sentAt: new Date(),
        });

        sent++;
      } else {
        const errorMessage = response.error ?? "Expo notification failed";

        console.error("Expo failed:", errorMessage);

        /*
    Disable invalid Expo tokens
  */

        if (errorMessage.includes("DeviceNotRegistered")) {
          await NotificationSubscription.findByIdAndUpdate(subscription._id, {
            active: false,
          });

          console.log("Disabled invalid token:", subscription.expoPushToken);
        }

        await NotificationLog.findByIdAndUpdate(log._id, {
          status: "failed",
          error: errorMessage,
        });

        failed.push(subscription.user.toString());
      }
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

