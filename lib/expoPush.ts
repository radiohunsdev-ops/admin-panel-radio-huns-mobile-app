// src/lib/expoPush.ts

export interface ExpoPushMessage {
  to: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
}

interface ExpoPushResponse {
  data?: {
    status?: "ok" | "error";
    id?: string;
    message?: string;
    details?: {
      error?: string;
    };
  };
  errors?: Array<{
    message: string;
  }>;
}

export async function sendExpoPushNotification({
  to,
  title,
  body,
  data = {},
}: ExpoPushMessage) {
  try {
    const response = await fetch(
      "https://exp.host/--/api/v2/push/send",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Accept-Encoding": "gzip, deflate",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to,
          sound: "default",
          title,
          body,
          data,
        }),
      }
    );

    const result = (await response.json()) as ExpoPushResponse;

    if (!response.ok) {
      return {
        success: false,
        error:
          result.errors?.[0]?.message ?? "Expo API request failed",
        result,
      };
    }

    // Expo ticket error
    if (result.data?.status === "error") {
      return {
        success: false,
        error: result.data.message ?? "Expo ticket failed",
        details: result.data.details,
        result,
      };
    }

    return {
      success: true,
      result,
    };
  } catch (error: unknown) {
    console.error("Expo Push Error:", error);

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unknown Expo error",
    };
  }
}

export async function sendBulkExpoPushNotifications(
  messages: ExpoPushMessage[]
) {
  try {
    const response = await fetch(
      "https://exp.host/--/api/v2/push/send",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Accept-Encoding": "gzip, deflate",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          messages.map((message) => ({
            ...message,
            sound: "default",
          }))
        ),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: "Expo bulk notification failed",
        result,
      };
    }

    return {
      success: true,
      result,
    };
  } catch (error: unknown) {
    console.error("Expo Bulk Error:", error);

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error",
    };
  }
}