const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export interface ApiPromoProduct {
  id: string;
  title: string;
  imageUrl?: string | null;
}

export interface PromoBannerResponse {
  id: string;
  title: string;
  subtitle: string;
  discountText: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
  productIds: string[];
  couponId?: string | null;
  promoProducts: ApiPromoProduct[];
}

export async function fetchPromoBanner(): Promise<PromoBannerResponse | null> {
  const response = await fetch(`${BASE_URL}/promo-banner`, {
    cache: "no-store",
  });
  if (!response.ok) {
    return null;
  }
  return response.json();
}

export async function subscribeNewsletter(email: string): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${BASE_URL}/newsletter/subscribe`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to subscribe");
  }

  return response.json();
}

export function getPromoImageUrl(imageUrl?: string | null): string {
  if (!imageUrl) return "";
  if (imageUrl.startsWith("data:")) return "";
  if (imageUrl.startsWith("http")) return imageUrl;
  const cleanPath = imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`;
  return `${BASE_URL}${cleanPath}`;
}
