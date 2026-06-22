export interface ShowPayload {
  showName: string;
  shortTitle?: string;
  description: string;
  host: string;
  station: string;
  language?: string;
  genre?: string;
  tags?: string[];
  coverImage?: string;
  isLive?: boolean;
  isFeatured?: boolean;
  showOnHome?: boolean;
  allowSubscriptions?: boolean;
  enableComments?: boolean;
  status?: "active" | "inactive" | "archived";
}

export interface Show {
  id: string;
  _id: string;
  showName: string;
  shortTitle?: string;
  description: string;
  host:
    | string
    | {
        _id: string;
        hostName: string;
      };
  station: string;
  language: string;
  genre?: string;
  tags: string[];
  coverImage?: string;
  isLive: boolean;
  isFeatured: boolean;
  showOnHome: boolean;
  allowSubscriptions: boolean;
  enableComments: boolean;
  status: "active" | "inactive" | "archived";
  createdAt: string;
  updatedAt: string;
}

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL ||
  "http://localhost:3000";

const API_URL = `${BASE_URL}/api/shows`;

export async function createShow(
  data: ShowPayload,
) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type":
        "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Failed to create show",
    );
  }

  return result;
}

export async function getShows(): Promise<Show[]> {
  try {
    const response = await fetch(API_URL, {
      cache: "no-store",
    });

    if (!response.ok) {
      return [];
    }

    const contentType =
      response.headers.get("content-type");

    if (
      !contentType?.includes(
        "application/json"
      )
    ) {
      console.error(
        "Expected JSON but received:",
        contentType
      );
      return [];
    }

    const result = await response.json();

    return Array.isArray(result.data)
      ? result.data
      : [];
  } catch (error) {
    console.error(
      "Error fetching shows:",
      error
    );
    return [];
  }
}
export async function getShowById(
  id: string,
): Promise<Show> {
  const response = await fetch(
    `${API_URL}/${id}`,
    {
      cache: "no-store",
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Failed to fetch show",
    );
  }

  return result.data;
}

export async function updateShow(
  id: string,
  data: Partial<ShowPayload>,
) {
  const response = await fetch(
    `${API_URL}/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify(data),
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Failed to update show",
    );
  }

  return result;
}

export async function deleteShow(
  id: string,
) {
  const response = await fetch(
    `${API_URL}/${id}`,
    {
      method: "DELETE",
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Failed to delete show",
    );
  }

  return result;
}