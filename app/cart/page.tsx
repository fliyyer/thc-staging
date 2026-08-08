"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Minus, Plus, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import masterCardImage from "@/assets/master-card.png";
import visaImage from "@/assets/visa.png";
import productImage from "@/assets/produk.png";
import { TransactionShell } from "@/components/transaction/transaction-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useCart, type CartItem } from "@/context/cart-context";
import { getProductImageUrl } from "@/lib/api/products-api";

export default function CartPage() {
  const { cartItems, cartCount } = useCart();

  return (
    <TransactionShell step="cart">
      <div className="mt-6 sm:mt-8">
        <h1 className="text-[28px] sm:text-5xl font-satoshi font-bold tracking-normal">
          Your Cart ({cartCount})
        </h1>
        <p className="mt-2 sm:mt-5 text-sm sm:text-lg text-black/70">
          Review your items and proceed to checkout.
        </p>
      </div>

      <div className="mt-6 sm:mt-10 grid gap-6 lg:gap-10 lg:grid-cols-[minmax(0,1fr)_410px]">
        <div>
          {cartItems.length > 0 ? (
            <>
              <div className="hidden grid-cols-[1fr_160px_100px_120px] pb-4 text-base font-bold uppercase sm:grid">
                <span>Product</span>
                <span>Price</span>
                <span>Qty</span>
                <span className="text-right">Subtotal</span>
              </div>

              <div className="grid gap-4 sm:gap-5">
                {cartItems.map((item) => (
                  <CartProductCard key={item.product.id} item={item} />
                ))}
              </div>
            </>
          ) : (
            <div className="py-12 text-center text-gray-500 border border-dashed rounded-lg">
              <p className="text-base font-medium">Your cart is empty.</p>
              <Button
                asChild
                className="mt-4 bg-black text-white hover:bg-black/85"
              >
                <Link href="/shop">Start Shopping</Link>
              </Button>
            </div>
          )}

          <Button
            asChild
            className="mt-6 sm:mt-8 h-auto p-0 uppercase text-sm sm:text-lg font-bold underline underline-offset-4"
            variant="link"
          >
            <Link href="/shop" className="gap-2">
              <ArrowLeft className="size-3.5 sm:size-4" />
              Continue Shopping
            </Link>
          </Button>
        </div>

        {cartItems.length > 0 && <OrderSummary />}
      </div>
    </TransactionShell>
  );
}

function CartProductCard({ item }: { item: CartItem }) {
  const { updateQuantity, removeFromCart } = useCart();
  const { product, quantity } = item;

  const displayImage = product.imageUrl
    ? getProductImageUrl(product.imageUrl)
    : product.imageUrls && product.imageUrls.length > 0
      ? getProductImageUrl(product.imageUrls[0])
      : "";

  const priceVal = item.packSize ? item.packSize.price : product.price;
  const priceStr = `£${priceVal.toFixed(2)}`;
  const subtotalStr = `£${(priceVal * quantity).toFixed(2)}`;

  return (
    <Card className="rounded-[5px] border-0 py-0 shadow-[0_0_8px_rgba(0,0,0,0.2)]">
      <CardContent className="p-3 sm:p-5 flex flex-row gap-3 sm:grid sm:grid-cols-[1fr_160px_100px_120px] sm:items-center sm:gap-6">
        {/* Mobile-only Image Block */}
        <div className="relative size-20 shrink-0 overflow-hidden rounded bg-gray-50 flex items-center justify-center sm:hidden">
          {displayImage ? (
            <Image
              src={displayImage}
              alt={product.title}
              fill
              className="object-contain p-1"
            />
          ) : (
            <Image
              src={productImage}
              alt={product.title}
              fill
              className="object-contain p-1"
            />
          )}
        </div>

        {/* Desktop-only Image & Title Block */}
        <div className="hidden sm:grid sm:grid-cols-[28px_88px_1fr] items-center gap-4">
          <Button
            aria-label={`Remove ${product.title}`}
            className="size-7 rounded-full hover:bg-red-600 hover:text-white"
            size="icon"
            variant="outline"
            onClick={() => removeFromCart(item.cartItemId)}
          >
            <X className="size-3 " />
          </Button>
          <div className="relative h-18 w-22 bg-gray-50 rounded flex items-center justify-center">
            {displayImage ? (
              <Image
                src={displayImage}
                alt={product.title}
                fill
                className="object-contain p-1"
              />
            ) : (
              <Image
                src={productImage}
                alt={product.title}
                fill
                className="object-contain p-1"
              />
            )}
          </div>
          <div>
            <p className="text-sm font-semibold leading-tight">
              {product.title}
            </p>
            {item.packSize && (
              <p className="text-xs text-gray-500 mt-1">{item.packSize.label}</p>
            )}
            <p className="mt-2 flex items-center gap-2 text-xs text-black/60">
              <span className="size-2 rounded-full bg-emerald-500" />
              In stock
            </p>
          </div>
        </div>

        {/* Mobile Content Block */}
        <div className="flex-1 flex flex-col justify-between sm:hidden">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-semibold leading-tight text-black line-clamp-2">
              {product.title}
            </p>
            {item.packSize && (
              <p className="text-xs text-gray-500 mt-1">{item.packSize.label}</p>
            )}
            <Button
              aria-label={`Remove ${product.title}`}
              className="size-6 shrink-0 rounded-full hover:bg-red-600 hover:text-white"
              size="icon"
              variant="outline"
              onClick={() => removeFromCart(item.cartItemId)}
            >
              <X className="size-3" />
            </Button>
          </div>

          <p className="text-xs sm:text-base text-black/60 mt-1 flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            In stock
          </p>

          <div className="flex items-end justify-between mt-3 gap-2">
            <div className="flex h-8 w-24 items-center justify-between rounded border">
              <Button
                className="size-8"
                size="icon"
                variant="ghost"
                onClick={() => updateQuantity(item.cartItemId, quantity - 1)}
              >
                <Minus className="size-3" />
              </Button>
              <span className="text-sm">{quantity}</span>
              <Button
                className="size-8"
                size="icon"
                variant="ghost"
                onClick={() => updateQuantity(item.cartItemId, quantity + 1)}
              >
                <Plus className="size-3" />
              </Button>
            </div>
            <div className="text-right">
              <p className="text-xs text-black/55">Subtotal</p>
              <p className="text-sm font-bold">{subtotalStr}</p>
            </div>
          </div>
        </div>

        {/* Desktop-only Columns */}
        <p className="hidden sm:block text-sm font-semibold">{priceStr}</p>
        <div className="hidden sm:flex h-10 w-28 items-center justify-between rounded-lg border">
          <Button
            className="size-9"
            size="icon"
            variant="ghost"
            onClick={() => updateQuantity(item.cartItemId, quantity - 1)}
          >
            <Minus className="size-3" />
          </Button>
          <span className="text-sm">{quantity}</span>
          <Button
            className="size-9"
            size="icon"
            variant="ghost"
            onClick={() => updateQuantity(item.cartItemId, quantity + 1)}
          >
            <Plus className="size-3" />
          </Button>
        </div>
        <p className="hidden sm:block text-sm font-semibold text-right">
          {subtotalStr}
        </p>
      </CardContent>
    </Card>
  );
}

function OrderSummary() {
  const {
    cartSubtotal,
    couponCode,
    discountAmount,
    applyCoupon,
    removeCoupon,
    showToast,
  } = useCart();
  const [couponInput, setCouponInput] = useState("");
  const [isPending, setIsPending] = useState(false);

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
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

  // Free shipping over £125
  const shippingVal = cartSubtotal >= 125 ? 0 : 12.99;
  const totalVal = Math.max(0, cartSubtotal - discountAmount + shippingVal);

  const subtotalStr = `£${cartSubtotal.toFixed(2)}`;
  const shippingStr = shippingVal === 0 ? "Free" : `£${shippingVal.toFixed(2)}`;
  const totalStr = `£${totalVal.toFixed(2)}`;

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
    <div>
      <Card className="rounded-lg border-0 shadow-[0_0_8px_rgba(0,0,0,0.2)]">
        <CardHeader className="p-4 pb-2 sm:p-6 sm:pb-3">
          <CardTitle className="text-lg sm:text-xl font-satoshi font-bold">
            Order Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0 space-y-4 sm:space-y-5">
          <div className="flex justify-between">
            <span className="font-semibold text-sm sm:text-lg">Subtotal</span>
            <span className="font-semibold text-sm sm:text-lg">
              {subtotalStr}
            </span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between text-emerald-600 font-semibold animate-in fade-in duration-300">
              <span className="text-sm sm:text-lg">
                Discount ({couponCode})
              </span>
              <span className="text-sm sm:text-lg">
                -£{discountAmount.toFixed(2)}
              </span>
            </div>
          )}
          <div className="flex justify-between">
            <div>
              <p className="font-semibold text-sm sm:text-lg">Shipping</p>
              <p className="mt-1 text-xs sm:text-sm text-black/60">
                Free shipping over £125
              </p>
            </div>
            <span className="font-semibold text-sm sm:text-lg">
              {shippingStr}
            </span>
          </div>
          <Separator />
          <div className="flex justify-between text-sm sm:text-base font-bold">
            <span className="text-sm sm:text-lg">Total</span>
            <span className="text-sm sm:text-lg">{totalStr}</span>
          </div>
          <p className="text-xs sm:text-base text-black/60">
            Tax included. Shipping calculated at checkout.
          </p>
          <Separator />
          <div>
            <p className="font-semibold mb-2 text-sm sm:text-base">
              Have a coupon?
            </p>
            {couponCode ? (
              <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 animate-in zoom-in duration-300">
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-sm sm:text-base">
                    Coupon <strong>{couponCode}</strong> active
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={removeCoupon}
                  className="h-7 text-sm sm:text-lg text-red-600 hover:text-red-800 hover:bg-red-50 px-2.5 font-bold"
                >
                  Remove
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-[1fr_auto] gap-2.5 sm:gap-3">
                  <Input
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="h-10 sm:h-11 text-sm sm:text-lg uppercase"
                    placeholder="Enter coupon code"
                    disabled={isPending}
                  />
                  <Button
                    onClick={handleApplyCoupon}
                    disabled={isPending || !couponInput.trim()}
                    className="h-10 sm:h-11 bg-black px-4 sm:px-6 text-sm sm:text-lg text-white hover:bg-black/80"
                  >
                    {isPending ? "Applying..." : "Apply"}
                  </Button>
                </div>
                {activeCoupons && activeCoupons.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2 items-center">
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
              </>
            )}
          </div>
          <Button
            asChild
            className="h-10 sm:h-12 w-full uppercase bg-black text-sm sm:text-lg text-white font-bold hover:bg-black/80 flex items-center justify-center"
          >
            <Link href="/checkout">Proceed to Checkout</Link>
          </Button>
        </CardContent>
      </Card>

      <div className="mt-6 sm:mt-8 flex items-center justify-center lg:justify-start gap-3">
        <Image
          src={masterCardImage}
          alt="Mastercard"
          width={75}
          height={45}
          className="h-6 sm:h-8 w-auto object-contain"
        />
        <Image
          src={visaImage}
          alt="Visa"
          width={75}
          height={45}
          className="h-6 sm:h-8 w-auto object-contain"
        />
      </div>
    </div>
  );
}
