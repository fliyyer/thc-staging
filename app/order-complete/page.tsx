"use client";

import { useEffect, useState } from "react";
import { CircleAlert, Headphones, RefreshCw } from "lucide-react";

import { CompactOrderProduct } from "@/components/transaction/order-products";
import { TransactionShell } from "@/components/transaction/transaction-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart, type CartItem } from "@/context/cart-context";

export default function OrderCompletePage() {
  const { clearCart } = useCart();
  const [completedItems, setCompletedItems] = useState<CartItem[]>([]);
  const [completedSubtotal, setCompletedSubtotal] = useState(0);
  const [completedDiscount, setCompletedDiscount] = useState(0);
  const [completedTotal, setCompletedTotal] = useState(0);
  const [orderMeta, setOrderMeta] = useState<any>(null);

  // Capture cart details on mount, then clear the global cart
  useEffect(() => {
    const saved = localStorage.getItem("thc_last_order");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCompletedItems(parsed.items || []);
        setCompletedSubtotal(parsed.subtotal || 0);
        setCompletedDiscount(parsed.discountAmount || 0);
        setCompletedTotal(parsed.total || 0);
        setOrderMeta(parsed);
      } catch (e) {
        console.error("Failed to parse saved order metadata:", e);
      }
    }
    clearCart();
  }, []);

  return (
    <TransactionShell step="complete">
      <div className="mt-6 lg:mt-8 grid gap-6 lg:gap-10 lg:grid-cols-[minmax(0,1fr)_600px]">
        <div>
          <PendingNotice />
          <BankDetails />
          <OrderDetails
            items={completedItems}
            subtotal={completedSubtotal}
            discount={completedDiscount}
            total={completedTotal}
            note={orderMeta?.orderNotes}
          />
          <BillingAddress meta={orderMeta} />
        </div>

        <OrderSidebar meta={orderMeta} />
      </div>
    </TransactionShell>
  );
}

function PendingNotice() {
  return (
    <div className="rounded-lg bg-[#fff7e8] p-4 sm:p-6 text-sm sm:text-lg">
      <div className="flex gap-3 sm:gap-4">
        <CircleAlert className="size-5 sm:size-6 shrink-0 text-amber-500 mt-0.5" />
        <div>
          <h1 className="font-bold text-sm sm:text-sm">Pending Payment</h1>
          <p className="mt-2 text-[#FEBF54]">
            Thank you! Your order has been received.
          </p>
          <p className="mt-2">
            Please, complete your payment using the bank details below,{" "}
            <strong>using your order number as payment reference.</strong>
          </p>
          <p className="mt-2">
            After completing your payment, please{" "}
            <strong>reply to your confirmation email</strong> with your payment
            proof.
          </p>
          <p className="mt-2">
            Once we receive your payment, we will process your order within 24HR
            and use Royal Mail 24HR tracked delivery.
          </p>
        </div>
      </div>
    </div>
  );
}

function BankDetails() {
  return (
    <section className="mt-6 sm:mt-8">
      <h2 className="text-xl sm:text-2xl font-satoshi font-bold">
        Bank Details
      </h2>
      <Card className="mt-3 sm:mt-4 rounded-lg py-0 shadow-none">
        <CardContent className="space-y-1.5 p-4 sm:p-5">
          <p className="font-bold text-base sm:text-xl">TOP E-COMM LTD</p>
          <p className="text-sm sm:text-lg">Account number: 20399928</p>
          <p className="text-sm sm:text-lg">Sort code: 040003</p>
        </CardContent>
      </Card>
    </section>
  );
}

function OrderDetails({
  items,
  subtotal,
  discount,
  total,
  note,
}: {
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  note?: string;
}) {
  const shippingVal = subtotal >= 125 ? 0 : 12.99;

  const subtotalStr = `£${subtotal.toFixed(2)}`;
  const discountStr = discount > 0 ? `-£${discount.toFixed(2)}` : null;
  const shippingStr = shippingVal === 0 ? "Free" : `£${shippingVal.toFixed(2)}`;
  const totalStr = `£${total.toFixed(2)}`;

  return (
    <section className="mt-6 sm:mt-8">
      <h2 className="text-xl sm:text-2xl font-satoshi font-bold">
        Order Details
      </h2>
      <Card className="mt-3 sm:mt-4 rounded-lg py-0 shadow-none">
        <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-5">
          <div className="flex justify-between text-base sm:text-xl font-bold uppercase">
            <span>Product</span>
            <span>Total</span>
          </div>
          {items.map((item) => (
            <CompactOrderProduct
              key={item.cartItemId}
              name={item.product.title}
              price={`£${((item.packSize ? item.packSize.price : item.product.price) * item.quantity).toFixed(2)}`}
              quantity={item.quantity}
              packSizeLabel={item.packSize?.label}
              imageUrl={
                item.product.imageUrl ||
                (item.product.imageUrls && item.product.imageUrls.length > 0
                  ? item.product.imageUrls[0]
                  : null)
              }
            />
          ))}
          <Separator />
          <DetailLine label="Subtotal" value={subtotalStr} />
          {discountStr && <DetailLine label="Discount" value={discountStr} />}
          <DetailLine label="Shipping" value={shippingStr} />
          <DetailLine label="Payment method" value="Direct bank transfer" />
          <DetailLine label="Total" value={totalStr} bold />
          {note && <DetailLine label="Note" value={note} />}
        </CardContent>
      </Card>
    </section>
  );
}

function BillingAddress({ meta }: { meta: any }) {
  if (!meta) {
    return (
      <section className="mt-6 sm:mt-8">
        <h2 className="text-xl sm:text-2xl font-bold font-satoshi">
          Billing Address
        </h2>
        <Card className="mt-3 sm:mt-4 rounded-lg py-0 shadow-none">
          <CardContent className="p-4 sm:p-5 text-sm sm:text-lg text-gray-400">
            No address details available.
          </CardContent>
        </Card>
      </section>
    );
  }

  const fullName = `${meta.firstName} ${meta.lastName}`;
  const address2Line = meta.streetAddress2 ? (
    <p>{meta.streetAddress2}</p>
  ) : null;
  const countryName =
    meta.country === "uk" ? "United Kingdom (UK)" : meta.country;

  return (
    <section className="mt-6 sm:mt-8">
      <h2 className="text-xl sm:text-2xl font-bold font-satoshi">
        Billing Address
      </h2>
      <Card className="mt-3 sm:mt-4 rounded-lg py-0 shadow-none">
        <CardContent className="space-y-1 p-4 sm:p-5 text-sm sm:text-lg leading-normal sm:leading-5">
          <p className="font-bold">{fullName}</p>
          <p>{meta.streetAddress}</p>
          {address2Line}
          <p>{meta.city}</p>
          <p>{meta.state}</p>
          <p>{meta.postcode}</p>
          <p className="capitalize">{countryName}</p>
          <p>{meta.phone}</p>
          <p>{meta.email}</p>
        </CardContent>
      </Card>
    </section>
  );
}

function OrderSidebar({ meta }: { meta: any }) {
  const orderNumber = meta?.orderNumber || "7384";
  const dateStr = meta?.createdAt
    ? new Date(meta.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "May 27, 2026";

  return (
    <div className="grid content-start gap-4 sm:gap-5">
      <Card className="rounded-lg py-0 shadow-none">
        <CardHeader className="p-4 pb-2 sm:p-6 sm:pb-3">
          <CardTitle className="text-base sm:text-lg font-satoshi font-bold">
            Order Information
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0 pb-4 sm:pb-6 text-xs sm:text-sm space-y-4 sm:space-y-5">
          <DetailLine label="Order Number" value={orderNumber} />
          <DetailLine label="Date" value={dateStr} />
          <DetailLine label="Payment Method" value="Direct bank transfer" />
        </CardContent>
      </Card>

      <Card className="rounded-lg py-0 shadow-none">
        <CardHeader className="p-4 pb-2 sm:p-6 sm:pb-3">
          <CardTitle className="text-base sm:text-lg font-satoshi font-bold">
            Payment Status
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0 pb-4 sm:pb-6 text-xs sm:text-sm">
          <div className="flex items-center gap-3 text-sm sm:text-base font-semibold">
            <RefreshCw className="size-4 text-amber-500" />
            Pending Payment
          </div>
          <p className="mt-3 sm:mt-5 text-sm sm:text-base text-black/65">
            Awaiting your payment confirmation.
          </p>
        </CardContent>
      </Card>

      <Card className="rounded-lg py-0 shadow-none">
        <CardHeader className="p-4 pb-2 sm:p-6 sm:pb-3">
          <CardTitle className="text-base sm:text-lg font-satoshi font-bold">
            Need Help?
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0 pb-4 sm:pb-6 text-xs sm:text-sm">
          <p className="text-sm sm:text-base leading-normal sm:leading-5">
            If you have any questions about your order, feel free to contact our
            support team.
          </p>
          <Button
            className="mt-4 sm:mt-5 h-10 w-fit text-sm sm:text-base flex items-center justify-center gap-2"
            variant="outline"
          >
            <Headphones className="size-4" />
            Contact Support
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function DetailLine({
  bold,
  label,
  value,
}: {
  bold?: boolean;
  label: string;
  value: string;
}) {
  return (
    <div
      className={`flex justify-between gap-4 text-sm sm:text-lg ${bold ? "font-bold" : ""}`}
    >
      <span className="font-semibold">{label}</span>
      <span className="text-right">{value}</span>
    </div>
  );
}
