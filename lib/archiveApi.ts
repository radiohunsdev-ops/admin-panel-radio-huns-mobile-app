
const API_URL = "/api/archive";

export interface ArchivedShow {
  _id: string;
  show: string | {
    _id: string;
    showName: string;
    shortTitle?: string;
    coverImage?: string;
  };
  schedule: string;
  title: string;
  description?: string;
  host?: string;
  broadcastDate: string;
  durationSeconds: number;
  audioUrl: string;
  storageKey?: string;
  artworkUrl?: string;
  status: "draft" | "published" | "archived";
  createdAt: string;
  updatedAt: string;
}

export interface ArchivedShowPayload {
  show: string;
  schedule: string;
  title: string;
  description?: string;
  host?: string;
  broadcastDate: string;
  durationSeconds: number;
  audioUrl: string;
  storageKey?: string;
  artworkUrl?: string;
  status: "draft" | "published" | "archived";
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

async function request<T>(
  url: string,
  options?: RequestInit,
): Promise<ApiResponse<T>> {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  const result: ApiResponse<T> = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Archive request failed.");
  }

  return result;
}

export async function getArchivedShows(): Promise<ArchivedShow[]> {
  const response = await request<ArchivedShow[]>(API_URL);
  return response.data;
}

export async function getArchivedShow(
  id: string,
): Promise<ArchivedShow> {
  const response = await request<ArchivedShow>(
    `${API_URL}/${id}`,
  );
  return response.data;
}

export async function createArchivedShow(
  payload: ArchivedShowPayload,
): Promise<ApiResponse<ArchivedShow>> {
  return request<ArchivedShow>(API_URL, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateArchivedShow(
  id: string,
  payload: Partial<ArchivedShowPayload>,
): Promise<ApiResponse<ArchivedShow>> {
  return request<ArchivedShow>(`${API_URL}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function deleteArchivedShow(
  id: string,
): Promise<void> {
  await request<null>(`${API_URL}/${id}`, {
    method: "DELETE",
  });
}
