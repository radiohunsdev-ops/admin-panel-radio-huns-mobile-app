export interface LiveStreamPayload {
  stationName: string;
  stationCode: string;
  frequency: string;
  language: string;
  streamUrl: string;
  backupStreamUrl?: string;
  coverImage?: string;
  logo?: string;
  genre: string;
  isActive?: boolean;
}
export interface LiveStream extends LiveStreamPayload {
  _id: string;
  isLive?: boolean;
  createdAt: string;
  updatedAt: string;
}
const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL ||
  "http://localhost:3000";
const API_URL = `${BASE_URL}/api/live-streams`;

export async function createLiveStream(data: LiveStreamPayload) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to create stream");
  }

  return result;
}

export async function getLiveStreams() {
  const response = await fetch(API_URL, {
    cache: "no-store",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch streams");
  }

  return result.data;
}

export async function getLiveStreamById(id: string) {
  const response = await fetch(`${API_URL}/${id}`, {
    cache: "no-store",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch stream");
  }

  return result.data;
}

export async function updateLiveStream(
  id: string,
  data: Partial<LiveStreamPayload>,
) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to update stream");
  }

  return result;
}

export async function deleteLiveStream(id: string) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to delete stream");
  }

  return result;
}
