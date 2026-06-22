const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

const API_URL = `${BASE_URL}/api/schedules`;

/* =========================
   BASE SHARED TYPE
========================= */
type ScheduleBase = {
  mood?: string;

  day: string;
  customDays?: string[];

  startTime: string;
  endTime: string;

  timezone?: string;
  duration?: number;

  send15MinAlert?: boolean;
  send30MinAlert?: boolean;
  sendStartNowAlert?: boolean;

  enableSubscriptions?: boolean;

  linkedStream?: string;
  backupStream?: string;

  status?: "draft" | "published" | "scheduled" | "archived";

  trackAnalytics?: boolean;
};

/* =========================
   PAYLOAD (SEND TO API)
========================= */
export interface SchedulePayload extends ScheduleBase {
  show: string; // Show ID
}

/* =========================
   RESPONSE (FROM API)
========================= */
export interface Schedule extends ScheduleBase {
  _id: string;

  show:
    | string
    | {
        _id: string;
        showName: string;
        coverImage?: string;
        host?:
          | string
          | {
              _id: string;   
              fullName?: string;
              profileImage?: string;
            };
      };

  createdAt: string;
  updatedAt: string;
}

/* =========================
   CREATE SCHEDULE
========================= */
export async function createSchedule(data: SchedulePayload) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "Failed to create schedule");
  }

  return json.data;
}

/* =========================
   GET ALL SCHEDULES
========================= */
export async function getSchedules(): Promise<Schedule[]> {
  const res = await fetch(API_URL, {
    cache: "no-store",
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "Failed to fetch schedules");
  }

  return Array.isArray(json.data) ? json.data : [];
}

/* =========================
   GET SCHEDULE BY ID
========================= */
export async function getScheduleById(id: string): Promise<Schedule> {
  const res = await fetch(`${API_URL}/${id}`, {
    cache: "no-store",
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "Failed to fetch schedule");
  }

  return json.data;
}

/* =========================
   UPDATE SCHEDULE
========================= */
export async function updateSchedule(
  id: string,
  data: Partial<SchedulePayload>
) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "Failed to update schedule");
  }

  return json.data;
}

/* =========================
   DELETE SCHEDULE
========================= */
export async function deleteSchedule(id: string) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "Failed to delete schedule");
  }

  return json.data;
}