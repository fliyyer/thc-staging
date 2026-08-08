const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export interface CheckoutPayload {
  firstName: string;
  lastName: string;
  country: string;
  streetAddress1: string;
  streetAddress2?: string;
  city: string;
  state: string;
  postcode: string;
  phone: string;
  email: string;
  orderNotes?: string;
  couponCode?: string;
  items?: { productId: string; quantity: number }[];
}

export interface PlaceOrderResponse {
  id: string;
  orderNumber: string;
  subTotal: number;
  discountAmount: number;
  totalAmount: number;
  status: string;
  firstName: string;
  lastName: string;
  country: string;
  streetAddress: string;
  city: string;
  state: string;
  postcode: string;
  phone: string;
  email: string;
  orderNotes?: string;
  createdAt: string;
}

export async function placeOrder(payload: CheckoutPayload): Promise<PlaceOrderResponse> {
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token && token !== "undefined" && token !== "null") {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}/orders/checkout`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let errMessage = "Failed to place order";
    try {
      const errData = await response.json();
      errMessage = errData.message || errMessage;
    } catch {}
    throw new Error(errMessage);
  }

  return response.json();
}

export async function trackOrderAPI(orderNumber: string): Promise<unknown> {
  const response = await fetch(`${BASE_URL}/orders/track/${orderNumber}`);
  if (!response.ok) {
    let errMessage = "Order not found";
    try {
      const errData = await response.json();
      errMessage = errData.message || errMessage;
    } catch {}
    throw new Error(errMessage);
  }
  return response.json();
}

export async function fetchUserOrderHistory(): Promise<unknown[]> {
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  if (!token || token === "undefined" || token === "null") {
    throw new Error("No access token found");
  }

  const response = await fetch(`${BASE_URL}/orders/history`, {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch order history");
  }

  return response.json();
}
