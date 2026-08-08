"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import type { ApiProduct } from "@/lib/api/products-api";
import { fetchUserProfile, syncSocialLogin, type UserProfile } from "@/lib/api/auth-api";

export interface CartItem {
  cartItemId: string; // Unique identifier combining product ID and packSize label
  product: ApiProduct;
  quantity: number;
  packSize?: { label: string; price: number };
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: ApiProduct, quantity: number, packSize?: { label: string; price: number }) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  showToast: (message: string, type?: 'success' | 'error') => void;
  // User Profile & Avatar Additions
  userProfile: UserProfile | null;
  userAvatar: string | null;
  fetchProfile: () => Promise<void>;
  changeAvatar: (base64: string) => void;
  removeAvatar: () => void;
  // Coupon Additions
  couponCode: string | null;
  discountAmount: number;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [toasts, setToasts] = useState<{ id: string; message: string; type: 'success' | 'error' }[]>([]);
  const [coupon, setCoupon] = useState<{ code: string; discountType: string; value: number } | null>(null);
  const queryClient = useQueryClient();

  // Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem("thc_cart");
    if (storedCart) {
      try {
        setCartItems(JSON.parse(storedCart));
      } catch {
        console.error("Failed to parse cart items");
      }
    }
  }, []);

  // Remove coupon if cart becomes empty
  useEffect(() => {
    if (cartItems.length === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCoupon(null);
    }
  }, [cartItems]);

  const { data: session } = useSession();

  // Use TanStack Query to manage user profile cache reatively
  const { data: userProfile, refetch } = useQuery<UserProfile | null, Error>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
      if (token && token !== "undefined" && token !== "null") {
        return fetchUserProfile();
      }
      return null;
    },
    retry: false,
  });

  // Construct effective profile (fallback to Google NextAuth session if backend JWT not set yet)
  const effectiveProfile: UserProfile | null = useMemo(() => {
    if (userProfile) return userProfile;
    if (typeof window !== "undefined") {
      const savedGoogleProfile = localStorage.getItem("thc_google_profile");
      if (savedGoogleProfile) {
        try {
          return JSON.parse(savedGoogleProfile);
        } catch {}
      }
    }
    if (session?.user) {
      const nameParts = (session.user.name || "").split(" ");
      const firstName = nameParts[0] || "Google";
      const lastName = nameParts.slice(1).join(" ") || "User";
      return {
        id: (session.user as any).id || "google-user",
        firstName,
        lastName,
        email: session.user.email || "",
        avatarUrl: session.user.image || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
    return null;
  }, [userProfile, session]);

  const hasSyncedSocialRef = React.useRef(false);

  // Synchronize NextAuth Google Session with Backend JWT
  useEffect(() => {
    if (session?.user?.email && typeof window !== "undefined" && !hasSyncedSocialRef.current) {
      const token = localStorage.getItem("accessToken");
      if (!token || token === "undefined" || token === "null") {
        hasSyncedSocialRef.current = true;
        const nameParts = (session.user.name || "").split(" ");
        const firstName = nameParts[0] || "Google";
        const lastName = nameParts.slice(1).join(" ") || "User";

        syncSocialLogin({
          email: session.user.email,
          firstName,
          lastName,
        })
          .then((res) => {
            if (res?.accessToken) {
              localStorage.setItem("accessToken", res.accessToken);
              localStorage.setItem("refreshToken", res.refreshToken);
              refetch();
            }
          })
          .catch(() => {});
      }
    }
  }, [session, refetch]);

  // Dynamically resolve avatar URL from backend or NextAuth Google session
  const userAvatar = effectiveProfile?.avatarUrl
    ? (effectiveProfile.avatarUrl.startsWith("http")
      ? effectiveProfile.avatarUrl
      : `${BASE_URL}${effectiveProfile.avatarUrl}`)
    : (session?.user?.image || null);

  const fetchProfile = async () => {
    await refetch();
  };

  const changeAvatar = () => {
    queryClient.invalidateQueries({ queryKey: ["userProfile"] });
  };

  const removeAvatar = () => {
    queryClient.invalidateQueries({ queryKey: ["userProfile"] });
  };

  // Save cart helper
  const saveCart = (items: CartItem[]) => {
    setCartItems(items);
    localStorage.setItem("thc_cart", JSON.stringify(items));
  };

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const addToCart = (product: ApiProduct, quantity: number, packSize?: { label: string; price: number }) => {
    const cartItemId = packSize ? `${product.id}-${packSize.label}` : product.id;
    const existingIndex = cartItems.findIndex((item) => item.cartItemId === cartItemId);
    
    if (existingIndex > -1) {
      const newItems = [...cartItems];
      newItems[existingIndex].quantity += quantity;
      saveCart(newItems);
    } else {
      saveCart([...cartItems, { cartItemId, product, quantity, packSize }]);
    }
  };

  const removeFromCart = (cartItemId: string) => {
    saveCart(cartItems.filter((item) => item.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
    } else {
      saveCart(
        cartItems.map((item) =>
          item.cartItemId === cartItemId ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = () => {
    saveCart([]);
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cartItems.reduce((acc, item) => {
    const price = item.packSize ? item.packSize.price : item.product.price;
    return acc + price * item.quantity;
  }, 0);

  // Reactively calculate discount value based on subtotal updates
  const discountAmount = useMemo(() => {
    if (!coupon) return 0;
    if (coupon.discountType === "PERCENTAGE") {
      const calculated = cartSubtotal * (coupon.value / 100);
      return calculated > cartSubtotal ? cartSubtotal : calculated;
    } else {
      return coupon.value > cartSubtotal ? cartSubtotal : coupon.value;
    }
  }, [coupon, cartSubtotal]);

  const applyCoupon = async (code: string): Promise<{ success: boolean; message: string }> => {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token && token !== "undefined" && token !== "null") {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${BASE_URL}/orders/validate-coupon`, {
        method: "POST",
        headers,
        body: JSON.stringify({ code, subTotal: cartSubtotal }),
      });

      if (!response.ok) {
        let errMessage = "Invalid coupon code";
        try {
          const errData = await response.json();
          errMessage = errData.message || errMessage;
        } catch {}
        return { success: false, message: errMessage };
      }

      const data = await response.json();
      let value = 0;
      if (data.discountType === "PERCENTAGE") {
        value = cartSubtotal > 0 ? (data.discountAmount / cartSubtotal) * 100 : 0;
      } else {
        value = data.discountAmount;
      }

      setCoupon({
        code: data.code,
        discountType: data.discountType,
        value,
      });

      return { success: true, message: `Coupon ${data.code} applied successfully!` };
      } catch {
        return { success: false, message: "Invalid coupon code" };
      }
  };

  const removeCoupon = () => {
    setCoupon(null);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        showToast,
        userProfile: effectiveProfile,
        userAvatar,
        fetchProfile,
        changeAvatar,
        removeAvatar,
        couponCode: coupon ? coupon.code : null,
        discountAmount,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="flex items-center gap-3 bg-black text-white px-5 py-3.5 rounded-lg shadow-lg border border-white/20 transition-all duration-300 pointer-events-auto font-medium text-sm"
          >
            <div className={`size-2 rounded-full animate-pulse ${t.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'}`} />
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
