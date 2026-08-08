"use client";

import { useState } from "react";
import { ChevronUp, TicketPercent } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/cart-context";
import { useQuery } from "@tanstack/react-query";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export function CouponPanel() {
  const [isOpen, setIsOpen] = useState(true);
  const { couponCode, applyCoupon, removeCoupon, showToast } = useCart();
  const [couponInput, setCouponInput] = useState("");
  const [isPending, setIsPending] = useState(false);

  const { data: activeCoupons } = useQuery({
    queryKey: ["activeCoupons"],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/orders/coupons/active`, {
        cache: 'no-store'
      });
      if (res.ok) return res.json();
      return [];
    },
    refetchOnWindowFocus: true,
  });

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setIsPending(true);
    const res = await applyCoupon(couponInput.trim().toUpperCase());
    setIsPending(false);
    showToast(res.message);
    if (res.success) {
      setCouponInput("");
    }
  };

  return (
    <Card className="rounded-lg border-0 py-0 shadow-[0_0_8px_rgba(0,0,0,0.2)]">
      <CardContent className="p-0">
        <Button
          aria-controls="checkout-coupon-form"
          aria-expanded={isOpen}
          className="flex h-auto w-full items-center justify-between rounded-lg px-4 py-4 text-left text-black hover:bg-black/3 sm:px-6 sm:py-5"
          onClick={() => setIsOpen((current) => !current)}
          type="button"
          variant="ghost"
        >
          <span className="flex items-center gap-3 text-xs sm:text-sm">
            <TicketPercent className="size-5 shrink-0" />
            <span className="leading-snug">
              Have a coupon?{" "}
              <span className="font-semibold underline underline-offset-4">
                Click here
              </span>{" "}
              to enter your code
            </span>
          </span>
          <ChevronUp
            className={`size-4 sm:size-5 shrink-0 transition-transform duration-200 ${
              isOpen ? "" : "rotate-180"
            }`}
          />
        </Button>

        <div
          className={`grid transition-[grid-template-rows,opacity] duration-200 ${
            isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
          id="checkout-coupon-form"
        >
          <div className="overflow-hidden">
            {couponCode ? (
              <div className="flex items-center justify-between p-3 mx-4 mb-4 sm:mx-6 sm:mb-6 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs sm:text-sm animate-in zoom-in duration-300">
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Coupon <strong>{couponCode}</strong> active</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={removeCoupon}
                  className="h-7 text-xs text-red-600 hover:text-red-800 hover:bg-red-50 px-2.5 font-bold"
                >
                  Remove
                </Button>
              </div>
            ) : (
              <div className="flex flex-col">
                <div className="grid grid-cols-1 gap-3 px-4 pb-4 sm:grid-cols-[1fr_170px] sm:gap-4 sm:px-6 sm:pb-6">
                  <Input
                    className="h-10 rounded-lg px-4 text-xs sm:text-sm shadow-sm uppercase"
                    placeholder="Enter coupon code"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    disabled={isPending}
                  />
                  <Button
                    className="h-10 rounded-lg bg-black px-6 text-xs sm:text-sm text-white hover:bg-black/80"
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={isPending || !couponInput.trim()}
                  >
                    {isPending ? "Applying..." : "Apply"}
                  </Button>
                </div>
                {activeCoupons && activeCoupons.length > 0 && (
                  <div className="px-4 pb-4 sm:px-6 sm:pb-6 pt-0 mt-[-10px] flex flex-wrap gap-2 items-center">
                    <span className="text-[10px] sm:text-xs font-semibold text-black/50 mr-1 uppercase tracking-wider">Available:</span>
                    {activeCoupons.map((c: any) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setCouponInput(c.code)}
                        className="text-[10px] sm:text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-1 rounded font-bold hover:bg-emerald-100 transition-colors"
                      >
                        {c.code} ({c.discountType === 'PERCENTAGE' ? `${c.discountValue}% OFF` : `£${c.discountValue} OFF`})
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
