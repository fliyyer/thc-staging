"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Check, Clock3, RefreshCw, X, Search, Package, ShieldCheck, Truck } from "lucide-react";

import { SiteNavbar } from "@/components/home/navbar";
import { SiteFooter } from "@/components/home/footer";
import { FreeShippingBar } from "@/components/free-shipping-bar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { trackOrderAPI } from "@/lib/api/orders-api";
import { getProductImageUrl } from "@/lib/api/products-api";
import productImageFallback from "@/assets/produk.png";

function TrackOrderContent() {
  const [orderNumber, setOrderNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [order, setOrder] = useState<any>(null);

  const searchParams = useSearchParams();
  const queryOrderNumber = searchParams.get("orderNumber");

  const performSearch = async (num: string) => {
    if (!num.trim()) return;

    setLoading(true);
    setErrorMsg("");
    setOrder(null);

    try {
      const data = await trackOrderAPI(num.trim());
      setOrder(data);
    } catch (err: any) {
      setErrorMsg(err.message || "Order not found. Please verify the order number.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (queryOrderNumber) {
      setOrderNumber(queryOrderNumber);
      performSearch(queryOrderNumber);
    }
  }, [queryOrderNumber]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(orderNumber);
  };

  return (
    <main className="min-h-screen bg-white text-black flex flex-col justify-between">
      <div>
        <FreeShippingBar />
        <SiteNavbar variant="dark" />

        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
          {!order ? (
            <div className="max-w-md mx-auto">
              <h1 className="text-2xl sm:text-4xl font-bold tracking-normal font-satoshi text-center">
                Track Your Order
              </h1>
              <p className="mt-3 text-xs sm:text-sm text-black/60 text-center leading-normal">
                Enter your order number to track your shipment status, billing information, and purchased items.
              </p>

              <Card className="mt-8 border border-gray-100 shadow-lg rounded-xl">
                <CardContent className="p-6">
                  <form onSubmit={handleSearch} className="space-y-4">
                    <div>
                      <label className="text-xs sm:text-sm font-semibold mb-2 block" htmlFor="orderNumInput">
                        Order Number
                      </label>
                      <div className="relative">
                        <Input
                          id="orderNumInput"
                          placeholder="e.g. THC-20260704-1234"
                          value={orderNumber}
                          onChange={(e) => setOrderNumber(e.target.value)}
                          className="h-11 sm:h-12 pl-10 uppercase text-xs sm:text-sm"
                          required
                          disabled={loading}
                        />
                        <Search className="size-4 text-black/40 absolute left-3 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>

                    {errorMsg && (
                      <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-600 font-medium animate-in fade-in duration-300">
                        {errorMsg}
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={loading || !orderNumber.trim()}
                      className="w-full h-11 sm:h-12 bg-black text-white hover:bg-black/90 font-bold uppercase text-xs sm:text-sm flex items-center justify-center gap-2"
                    >
                      {loading ? "Searching..." : "Track Order"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          ) : (
            <OrderDetailView order={order} onBack={() => setOrder(null)} />
          )}
        </div>
      </div>

      <SiteFooter />
    </main>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-white text-black flex flex-col justify-between">
        <div>
          <FreeShippingBar />
          <SiteNavbar variant="dark" />
          <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20 text-center">
            <p className="text-sm text-black/60">Loading tracking page...</p>
          </div>
        </div>
        <SiteFooter />
      </main>
    }>
      <TrackOrderContent />
    </Suspense>
  );
}

function OrderDetailView({
  order,
  onBack,
}: {
  order: any;
  onBack: () => void;
}) {
  const statusConfig = getOrderStatusConfig(order.status);
  const StatusIcon = statusConfig.icon;
  const dateStr = new Date(order.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const shippingVal = order.subTotal >= 125 ? 0 : 12.99;
  const countryName = order.country === "uk"
    ? "United Kingdom (UK)"
    : order.country;

  return (
    <div className="animate-in fade-in duration-300">
      <Button
        className="mb-6 bg-black text-white hover:bg-black/85 gap-2 h-10 px-4 text-xs sm:text-sm uppercase font-bold"
        onClick={onBack}
        type="button"
      >
        <ArrowLeft className="size-4" />
        Track another order
      </Button>

      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
        <h2 className="text-2xl font-bold tracking-normal sm:text-3xl font-satoshi">
          Order {order.orderNumber}
        </h2>
        <p className="text-xs sm:text-sm text-black/60">
          Placed on <span className="font-semibold text-black">{dateStr}</span>
        </p>
      </div>

      {/* Status Panel */}
      <div className={`mt-6 flex flex-col gap-4 rounded-xl p-4 sm:flex-row sm:gap-5 sm:p-6 ${statusConfig.panelClassName}`}>
        <div className={`flex size-10 shrink-0 items-center justify-center rounded-full ${statusConfig.iconClassName}`}>
          <StatusIcon className="size-5" />
        </div>
        <div>
          <p className="text-xs sm:text-sm font-bold uppercase tracking-wider">Current Status</p>
          <p className="mt-1 text-xl font-bold font-satoshi">
            {statusConfig.label}
          </p>
          <p className="mt-2 text-xs sm:text-sm text-black/75 leading-relaxed">{statusConfig.statusMessage}</p>
        </div>
      </div>

      {/* Order Items & Breakdown */}
      <h3 className="mt-10 text-lg sm:text-xl font-bold font-satoshi">Order Items</h3>
      <Card className="mt-4 rounded-xl border border-gray-100 shadow-sm py-0">
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-[1fr_auto] gap-4 border-b pb-4 text-xs font-bold uppercase tracking-wider text-black/60">
            <span>Product</span>
            <span>Total</span>
          </div>

          <div className="divide-y divide-gray-100">
            {order.orderItems.map((item: any) => {
              const displayImage = item.product.imageUrl
                ? getProductImageUrl(item.product.imageUrl)
                : (item.product.imageUrls && item.product.imageUrls.length > 0 ? getProductImageUrl(item.product.imageUrls[0]) : "");
              
              return (
                <div
                  className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-8 py-5"
                  key={item.id}
                >
                  <div className="flex items-center gap-4 sm:gap-5">
                    <div className="relative size-16 shrink-0 overflow-hidden bg-gray-50 border rounded-lg flex items-center justify-center">
                      {displayImage ? (
                        <Image
                          alt={item.product.title}
                          className="object-contain p-1"
                          fill
                          src={displayImage}
                        />
                      ) : (
                        <Image
                          alt={item.product.title}
                          className="object-contain p-1"
                          fill
                          src={productImageFallback}
                        />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold leading-snug">
                        {item.product.title}
                      </p>
                      <p className="mt-1.5 text-xs text-black/55">x{item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-bold text-sm sm:text-right">£{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              );
            })}
          </div>

          <Separator className="my-2" />
          <OrderTotalRow label="Subtotal" value={`£${order.subTotal.toFixed(2)}`} />
          {order.discountAmount > 0 && (
            <OrderTotalRow 
              label="Discount" 
              value={`-£${order.discountAmount.toFixed(2)}`} 
              valueClassName="text-emerald-600 font-semibold" 
            />
          )}
          <OrderTotalRow label="Shipping" value={shippingVal === 0 ? "Free" : `£${shippingVal.toFixed(2)}`} />
          <OrderTotalRow label="Payment method" value="Direct bank transfer" />
          <OrderTotalRow label="Total" value={`£${order.totalAmount.toFixed(2)}`} valueClassName="font-bold text-lg text-black" />
          {order.orderNotes && <OrderTotalRow label="Note" value={order.orderNotes} />}
        </CardContent>
      </Card>

      {/* Billing Address Details */}
      <h3 className="mt-10 text-lg sm:text-xl font-bold font-satoshi">Billing &amp; Shipping Address</h3>
      <Card className="mt-4 rounded-xl border border-gray-100 shadow-sm py-0">
        <CardContent className="space-y-1 p-4 text-xs sm:text-sm leading-normal sm:leading-relaxed sm:p-6 text-black/80">
          <p className="font-bold text-black text-sm sm:text-base">{order.firstName} {order.lastName}</p>
          <p>{order.streetAddress}</p>
          <p>{order.city}</p>
          <p>{order.state}</p>
          <p>{order.postcode}</p>
          <p>{countryName}</p>
          <p className="pt-2"><strong>Phone:</strong> {order.phone}</p>
          <p><strong>Email:</strong> {order.email}</p>
        </CardContent>
      </Card>
    </div>
  );
}

function OrderTotalRow({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="grid grid-cols-1 py-3 text-xs sm:text-sm sm:grid-cols-[1fr_auto] sm:gap-6 border-b border-gray-50 last:border-0">
      <span className="font-semibold text-black/60">{label}</span>
      <span className={valueClassName || "font-semibold text-black"}>{value}</span>
    </div>
  );
}

function getOrderStatusConfig(status: string) {
  const normalized = status ? status.toUpperCase() : "PENDING";
  switch (normalized) {
    case "COMPLETED":
      return {
        label: "Completed",
        icon: Check,
        badgeClassName: "bg-[#F2F9F2] text-[#04DA8D]",
        iconClassName: "bg-emerald-500 text-white",
        panelClassName: "bg-emerald-50 border border-emerald-200 text-emerald-800",
        textClassName: "text-emerald-600",
        statusMessage: "Your order has been completed successfully. Thank you for shopping with us!",
      };
    case "SHIPPED":
      return {
        label: "Shipped",
        icon: Truck,
        badgeClassName: "bg-[#F8F2F9] text-[#B604DA]",
        iconClassName: "bg-fuchsia-600 text-white",
        panelClassName: "bg-fuchsia-50 border border-fuchsia-200 text-fuchsia-800",
        textClassName: "text-fuchsia-600",
        statusMessage: "Your order has been shipped and is on its way to you!",
      };
    case "PROCESSING":
      return {
        label: "Processing",
        icon: RefreshCw,
        badgeClassName: "bg-[#F2F2F9] text-[#2404DA]",
        iconClassName: "bg-indigo-700 text-white",
        panelClassName: "bg-indigo-50 border border-indigo-200 text-indigo-800",
        textClassName: "text-indigo-700",
        statusMessage: "We are currently processing your order and preparing it for delivery.",
      };
    case "CANCELLED":
      return {
        label: "Cancelled",
        icon: X,
        badgeClassName: "bg-[#D2D5DB40] text-black",
        iconClassName: "bg-black text-white",
        panelClassName: "bg-gray-50 border border-gray-200 text-gray-800",
        textClassName: "text-black",
        statusMessage: "This order has been cancelled.",
      };
    case "PENDING":
    default:
      return {
        label: "Pending",
        icon: Clock3,
        badgeClassName: "bg-[#FEF8ED] text-[#FEBF54]",
        iconClassName: "bg-amber-400 text-white",
        panelClassName: "bg-amber-50 border border-amber-200 text-amber-800",
        textClassName: "text-amber-500",
        statusMessage: "We are awaiting your payment confirmation. Please complete the bank transfer using the order reference.",
      };
  }
}
