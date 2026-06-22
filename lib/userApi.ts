const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

const API_URL = `${BASE_URL}/api/users`;

/* =========================
   BASE SHARED TYPE
========================= */
type NotificationPreferences = {
  showReminder15Min?: boolean;
  showReminder30Min?: boolean;
  giveawayAlerts?: boolean;
  newsAlerts?: boolean;
};

type ListeningHistory = {
  show:
    | string
    | {
        _id: string;
        showName: string;
      };

  startedAt: string;
  endedAt: string;
};

/* =========================
   PAYLOAD (SEND TO API)
========================= */
export interface UserPayload {
  fullName: string;
  email: string;
  phone?: string;
  password?: string;

  role?: "admin" | "manager" | "user";

  preferredLanguage?:
    | "Hindi"
    | "Punjabi"
    | "Urdu"
    | "English";

  city?: string;
  region?: string;

  provider?:
    | "email"
    | "google"
    | "apple"
    | "phone";

  emailVerified?: boolean;

  favouriteShows?: string[];
  subscribedShows?: string[];

  listeningHistory?: {
    show: string;
    startedAt: string;
    endedAt: string;
  }[];

  notificationPreferences?: NotificationPreferences;

  fcmTokens?: string[];
}

/* =========================
   RESPONSE (FROM API)
========================= */
export interface User {
  _id: string;

  fullName: string;
  email: string;
  phone?: string;

  role: "admin" | "manager" | "user";

  preferredLanguage?:
    | "Hindi"
    | "Punjabi"
    | "Urdu"
    | "English";

  city?: string;
  region?: string;

  provider:
    | "email"
    | "google"
    | "apple"
    | "phone";

  emailVerified: boolean;

  favouriteShows:
    | string[]
    | {
        _id: string;
        showName: string;
        coverImage?: string;
      }[];

  subscribedShows:
    | string[]
    | {
        _id: string;
        showName: string;
        coverImage?: string;
      }[];

  listeningHistory: ListeningHistory[];

  notificationPreferences: NotificationPreferences;

  fcmTokens: string[];

  createdAt: string;
  updatedAt: string;
}

/* =========================
   CREATE USER
========================= */
export async function createUser(data: UserPayload) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(
      json.message || "Failed to create user"
    );
  }

  return json.data;
}

/* =========================
   GET ALL USERS
========================= */
export async function getUsers(): Promise<User[]> {
  const res = await fetch(API_URL, {
    cache: "no-store",
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(
      json.message || "Failed to fetch users"
    );
  }

  return Array.isArray(json.data)
    ? json.data
    : [];
}

/* =========================
   GET USER BY ID
========================= */
export async function getUserById(
  id: string
): Promise<User> {
  const res = await fetch(
    `${API_URL}/${id}`,
    {
      cache: "no-store",
    }
  );

  const json = await res.json();

  if (!res.ok) {
    throw new Error(
      json.message || "Failed to fetch user"
    );
  }

  return json.data;
}

/* =========================
   UPDATE USER
========================= */
export async function updateUser(
  id: string,
  data: Partial<UserPayload>
) {
  const res = await fetch(
    `${API_URL}/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  const json = await res.json();

  if (!res.ok) {
    throw new Error(
      json.message || "Failed to update user"
    );
  }

  return json.data;
}

/* =========================
   DELETE USER
========================= */
export async function deleteUser(
  id: string
) {
  const res = await fetch(
    `${API_URL}/${id}`,
    {
      method: "DELETE",
    }
  );

  const json = await res.json();

  if (!res.ok) {
    throw new Error(
      json.message || "Failed to delete user"
    );
  }

  return json.data;
}