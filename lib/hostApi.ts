export interface HostPayload {
  fullName: string;
  bio?: string;
  profileImage?: string;
  coverImage?: string;
  email?: string;
  phone?: string;
  city?: string;
  languages?: string[];
  specialties?: string[];
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    youtube?: string;
    website?: string;
  };
  isFeatured?: boolean;
  isActive?: boolean;
}

export interface Host {
  id: string;
  _id: string;
  fullName: string;
  bio: string;
  profileImage: string;
  coverImage: string;
  email: string;
  phone: string;
  city: string;
  languages: string[];
  specialties: string[];

  socialLinks: {
    instagram: string;
    facebook: string;
    twitter: string;
    youtube: string;
    website: string;
  };

  isFeatured: boolean;
  isActive: boolean;

  createdAt: string;
  updatedAt: string;
}

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL ||
  "http://localhost:3000";

const API_URL = `${BASE_URL}/api/hosts`;

export async function createHost(
  data: HostPayload,
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
        "Failed to create host",
    );
  }

  return result;
}

export async function getHosts(): Promise<
  Host[]
> { 
  try {
    const response = await fetch(API_URL, {
      cache: "no-store",
    });

    if (!response.ok) {
      return [];
    }

    const contentType =
      response.headers.get(
        "content-type",
      );

    if (
      !contentType?.includes(
        "application/json",
      )
    ) {
      console.error(
        "Expected JSON but received:",
        contentType,
      );
      return [];
    }

    const result =
      await response.json();

    return Array.isArray(result.data)
      ? result.data
      : [];
  } catch (error) {
    console.error(
      "Error fetching hosts:",
      error,
    );
    return [];
  }
}

export async function getHostById(
  id: string,
): Promise<Host> {
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
        "Failed to fetch host",
    );
  }

  return result.data;
}

export async function updateHost(
  id: string,
  data: Partial<HostPayload>,
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
        "Failed to update host",
    );
  }

  return result;
}

export async function deleteHost(
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
        "Failed to delete host",
    );
  }

  return result;
}