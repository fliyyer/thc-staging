export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
}

export interface RegisterResponse {
  message: string;
  userId: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export async function registerUser(
  payload: RegisterPayload,
): Promise<RegisterResponse> {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let errorMessage = "Registration failed. Please try again.";
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      // If response is not JSON
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

export interface LoginPayload {
  email: string;
  password?: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export async function loginUser(payload: LoginPayload): Promise<LoginResponse> {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let errorMessage = "Login failed. Please check your credentials.";
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      // If response is not JSON
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

export async function syncSocialLogin(payload: { email: string; firstName?: string; lastName?: string }): Promise<LoginResponse | null> {
  try {
    const response = await fetch(`${BASE_URL}/auth/social-login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.warn("Backend social login sync endpoint returned status:", response.status);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.warn("Could not sync social login with backend:", error);
    return null;
  }
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username?: string | null;
  phone?: string | null;
  country?: string | null;
  streetAddress1?: string | null;
  streetAddress2?: string | null;
  city?: string | null;
  province?: string | null;
  postcode?: string | null;
  avatarUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  username?: string;
  phone?: string;
  country?: string;
  streetAddress1?: string;
  streetAddress2?: string;
  city?: string;
  province?: string;
  postcode?: string;
  avatarUrl?: string | null;
  avatar?: File | null;
  currentPassword?: string;
  newPassword?: string;
}

export async function fetchUserProfile(): Promise<UserProfile> {
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  if (!token) throw new Error("No access token found");

  const response = await fetch(`${BASE_URL}/users/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user profile");
  }

  return response.json();
}

export async function updateUserProfile(payload: UpdateProfilePayload): Promise<UserProfile> {
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  if (!token) {
    if (typeof window !== "undefined") {
      const existingStr = localStorage.getItem("thc_google_profile");
      const existing = existingStr ? JSON.parse(existingStr) : {};

      const updatedProfile: UserProfile = {
        id: existing.id || "google-user",
        firstName: payload.firstName ?? existing.firstName ?? "Google",
        lastName: payload.lastName ?? existing.lastName ?? "User",
        email: payload.email ?? existing.email ?? "",
        phone: payload.phone ?? existing.phone,
        username: payload.username ?? existing.username,
        country: payload.country ?? existing.country,
        streetAddress1: payload.streetAddress1 ?? existing.streetAddress1,
        streetAddress2: payload.streetAddress2 ?? existing.streetAddress2,
        city: payload.city ?? existing.city,
        province: payload.province ?? existing.province,
        postcode: payload.postcode ?? existing.postcode,
        avatarUrl: existing.avatarUrl || null,
        createdAt: existing.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem("thc_google_profile", JSON.stringify(updatedProfile));
      return updatedProfile;
    }
  }

  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined) {
      if (value === null) {
        formData.append(key, "");
      } else if (value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, String(value));
      }
    }
  });

  const response = await fetch(`${BASE_URL}/users/profile`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    let errorMessage = "Failed to update user profile";
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {}
    throw new Error(errorMessage);
  }

  return response.json();
}

