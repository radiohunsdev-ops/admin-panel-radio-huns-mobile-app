// src/utils/timeHelper.ts

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export function timeStringToMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

export function currentMinutesInTimezone(
  timezone: string = "America/Toronto"
) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: timezone,
  });

  const parts = formatter.formatToParts(new Date());

  const hour = Number(
    parts.find((p) => p.type === "hour")?.value ?? 0
  );

  const minute = Number(
    parts.find((p) => p.type === "minute")?.value ?? 0
  );

  return hour * 60 + minute;
}

export function currentDayInTimezone(
  timezone: string = "America/Toronto"
) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    timeZone: timezone,
  }).format(new Date());
}

export function minutesUntilShow({
  currentDay,
  scheduleDay,
  currentMinutes,
  showMinutes,
}: {
  currentDay: string;
  scheduleDay: string;
  currentMinutes: number;
  showMinutes: number;
}) {
  const currentDayIndex = DAYS.indexOf(currentDay);
  const scheduleDayIndex = DAYS.indexOf(scheduleDay);

  if (currentDayIndex === -1 || scheduleDayIndex === -1) {
    return -1;
  }

  let dayDifference = scheduleDayIndex - currentDayIndex;

  if (dayDifference < 0) {
    dayDifference += 7;
  }

  let remaining =
    dayDifference * 24 * 60 +
    (showMinutes - currentMinutes);

  // Same day but time already passed -> next week
  if (remaining < 0) {
    remaining += 7 * 24 * 60;
  }

  return remaining;
}

export function shouldSend30Min(minutes: number) {
  return minutes >= 25 && minutes <= 30;
}

export function shouldSend15Min(minutes: number) {
  return minutes > 0 && minutes <= 15;
}

export function shouldSendStartNow(minutes: number) {
  return minutes >= 0 && minutes <= 1;
}