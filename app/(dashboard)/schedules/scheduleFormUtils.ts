import { Schedule } from "@/lib/schedulesApi";
import {
  INITIAL_SCHEDULE_FORM,
  ScheduleFormData,
} from "./ScheduleFormFields";


export function mapScheduleToForm(
  schedule: Schedule,
): ScheduleFormData {
  return {
    ...INITIAL_SCHEDULE_FORM,

    show:
      typeof schedule.show === "string"
        ? schedule.show
        : schedule.show?._id || "",

    mood: schedule.mood || "",

    day: schedule.day || "",

    customDays: schedule.customDays?.join(", ") || "",

    startTime: schedule.startTime || "",

    endTime: schedule.endTime || "",

    timezone:
      schedule.timezone || "America/Toronto",

    duration: schedule.duration
      ? String(schedule.duration)
      : "",

    send15MinAlert: String(
      schedule.send15MinAlert ?? true,
    ),

    send30MinAlert: String(
      schedule.send30MinAlert ?? false,
    ),

    sendStartNowAlert: String(
      schedule.sendStartNowAlert ?? true,
    ),

    enableSubscriptions: String(
      schedule.enableSubscriptions ?? true,
    ),

    linkedStream:
      schedule.linkedStream || "",

    backupStream:
      schedule.backupStream || "",

    status:
      schedule.status || "published",

    trackAnalytics: String(
      schedule.trackAnalytics ?? true,
    ),
  };
}


export function serializeScheduleForm(
  formData: ScheduleFormData,
) {
  return {
    ...formData,

    description: "",
    station: "",

    customDays: formData.customDays
      ? formData.customDays
          .split(",")
          .map((day) => day.trim())
          .filter(Boolean)
      : [],

    duration: formData.duration
      ? Number(formData.duration)
      : undefined,

    send15MinAlert:
      formData.send15MinAlert === "true",

    send30MinAlert:
      formData.send30MinAlert === "true",

    sendStartNowAlert:
      formData.sendStartNowAlert === "true",

    enableSubscriptions:
      formData.enableSubscriptions === "true",

    trackAnalytics:
      formData.trackAnalytics === "true",
  };
}