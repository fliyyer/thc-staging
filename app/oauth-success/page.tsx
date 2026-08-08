"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/context/cart-context";

function OAuthSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { fetchProfile } = useCart();

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");

    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }
      
      // Load user profile and redirect to home
      fetchProfile().then(() => {
        router.replace("/");
      });
    } else {
      // If no token, redirect to login
      router.replace("/auth/login");
    }
  }, [searchParams, router, fetchProfile]);

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Login Berhasil</h2>
        <p className="text-gray-500">Mengarahkan Anda ke halaman utama...</p>
      </div>
    </div>
  );
}

export default function OAuthSuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen w-full items-center justify-center">
        <p>Memproses login...</p>
      </div>
    }>
      <OAuthSuccessContent />
    </Suspense>
  );
}
