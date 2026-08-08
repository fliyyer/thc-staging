import type { ApiProduct } from "./products-api";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export async function fetchWishlist(): Promise<ApiProduct[]> {
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  if (!token) throw new Error("No access token found");

  const response = await fetch(`${BASE_URL}/wishlist`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch wishlist");
  }

  return response.json();
}

export interface ToggleWishlistResponse {
  message: string;
  isFavorited: boolean;
}

export async function toggleWishlist(productId: string): Promise<ToggleWishlistResponse> {
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  if (!token) throw new Error("No access token found");

  const response = await fetch(`${BASE_URL}/wishlist`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ productId }),
  });

  if (!response.ok) {
    let errorMessage = "Failed to toggle wishlist";
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {}
    throw new Error(errorMessage);
  }

  return response.json();
}

export async function clearWishlist(): Promise<{ message: string }> {
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  if (!token) throw new Error("No access token found");

  const response = await fetch(`${BASE_URL}/wishlist/clear`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to clear wishlist");
  }

  return response.json();
}
