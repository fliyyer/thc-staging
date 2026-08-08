"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole, UserRound } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import masterCardImage from "@/assets/master-card.png";
import visaImage from "@/assets/visa.png";
import { CouponPanel } from "@/components/transaction/coupon-panel";
import { CompactOrderProduct } from "@/components/transaction/order-products";
import { TransactionShell } from "@/components/transaction/transaction-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCart } from "@/context/cart-context";
import { usePlaceOrder } from "@/hooks/use-place-order";
import type { CheckoutPayload } from "@/lib/api/orders-api";
import { countryCodes } from "@/lib/country-codes";
import { PhoneCodeSelect } from "@/components/ui/phone-code-select";
import { AddressSelect } from "@/components/ui/address-select";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function CheckoutPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { cartItems, cartSubtotal, couponCode, showToast } = useCart();
  const { mutate: placeOrderMutation, isPending } = usePlaceOrder();
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!(token && token !== "undefined" && token !== "null"));
  }, []);

  const { data: defaultAddress } = useQuery({
    queryKey: ["defaultAddress"],
    queryFn: async () => {
      const token = localStorage.getItem("accessToken");
      if (token && token !== "undefined" && token !== "null") {
        const res = await fetch(`${BASE_URL}/orders/default-address`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) return res.json();
      }
      return null;
    },
    retry: false,
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");

    if (cartItems.length === 0) {
      showToast("Your cart is empty.");
      return;
    }

    if (!agreedToTerms) {
      showToast("Please agree to the website terms and conditions before placing an order.", "error");
      return;
    }

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const country = formData.get("country") as string;
    const streetAddress1 = formData.get("streetAddress1") as string;
    const streetAddress2 = (formData.get("streetAddress2") || "") as string;
    const city = formData.get("city") as string;
    const state = formData.get("state") as string;
    const postcode = formData.get("postcode") as string;

    const phoneCode = formData.get("phone-code") as string;
    const phoneNum = formData.get("phoneNum") as string;
    const phone = `${phoneCode} ${phoneNum}`;

    const orderNotes = (formData.get("orderNotes") || "") as string;

    const payload: CheckoutPayload = {
      email,
      firstName,
      lastName,
      country,
      streetAddress1,
      streetAddress2,
      city,
      state,
      postcode,
      phone,
      orderNotes,
      items: cartItems.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      })),
    };

    if (couponCode) {
      payload.couponCode = couponCode;
    }

    placeOrderMutation(payload, {
      onSuccess: (data) => {
        const shippingVal = cartSubtotal >= 125 ? 0 : 12.99;
        const savedOrder = {
          orderNumber: data.orderNumber,
          createdAt: data.createdAt,
          firstName: data.firstName,
          lastName: data.lastName,
          streetAddress: data.streetAddress,
          city: data.city,
          state: data.state,
          postcode: data.postcode,
          country: data.country,
          phone: data.phone,
          email: data.email,
          subtotal: cartSubtotal,
          discountAmount: data.discountAmount,
          shipping: shippingVal,
          total: data.totalAmount,
          items: cartItems,
          orderNotes: data.orderNotes,
        };
        localStorage.setItem("thc_last_order", JSON.stringify(savedOrder));
        router.push("/order-complete");
      },
      onError: (err: any) => {
        setErrorMsg(err.message || "Failed to place order. Please try again.");
      },
    });
  };

  return (
    <TransactionShell step="checkout">
      <div className="mt-6 lg:mt-8 grid gap-6 lg:gap-10 lg:grid-cols-[minmax(0,1fr)_410px]">
        <div>
          <CouponPanel />
          {!isLoggedIn && (
            <div className="mt-4 flex items-start gap-3 rounded-lg bg-[#eef0f2] px-4 py-3 text-xs sm:text-sm">
              <UserRound className="size-4 shrink-0 mt-0.5" />
              <span>
                Checkout as guest or{" "}
                <Link
                  className="font-semibold underline text-black"
                  href="/auth/register"
                >
                  create an account
                </Link>{" "}
                later to track your orders.
              </span>
            </div>
          )}

          {errorMsg && (
            <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs sm:text-sm text-red-600 font-medium">
              {errorMsg}
            </div>
          )}

          <BillingForm
            onSubmit={handleSubmit}
            defaultAddress={defaultAddress}
          />
        </div>

        <CheckoutSummary 
          isPending={isPending} 
          agreedToTerms={agreedToTerms}
          setAgreedToTerms={setAgreedToTerms}
        />
      </div>
    </TransactionShell>
  );
}

interface BillingAddressPayload {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  country: string;
  streetAddress1: string;
  streetAddress2?: string;
  city: string;
  province: string;
  postcode: string;
}

function BillingForm({
  onSubmit,
  defaultAddress,
}: {
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  defaultAddress?: BillingAddressPayload | null;
}) {
  const [country, setCountry] = useState("uk");
  const [phoneCode, setPhoneCode] = useState("+44");

  // Sync state values when defaultAddress loads
  useEffect(() => {
    if (defaultAddress) {
      if (defaultAddress.country)
        setCountry(defaultAddress.country.toLowerCase());
      if (defaultAddress.phone) {
        const parts = defaultAddress.phone.split(" ");
        if (parts[0]) setPhoneCode(parts[0]);
      }
    }
  }, [defaultAddress]);

  const phoneParts = defaultAddress?.phone
    ? defaultAddress.phone.split(" ")
    : [];
  const defaultPhoneNum = phoneParts.slice(1).join(" ") || "";

  return (
    <form id="checkout-form" onSubmit={onSubmit} className="mt-6 sm:mt-8">
      <input type="hidden" name="phone-code" value={phoneCode} />

      <h1 className="text-[28px] sm:text-5xl font-bold font-satoshi tracking-normal">
        Billing &amp; Shipping
      </h1>
      <p className="mt-3 sm:mt-5 text-sm sm:text-lg text-black/70">
        Please enter your details to complete your order.
      </p>

      <div className="mt-6 sm:mt-8 grid gap-4 sm:gap-6">
        <Field
          id="email"
          label="Email Address"
          placeholder="example@gmail.com"
          type="email"
          defaultValue={defaultAddress?.email}
        />
        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
          <Field
            id="firstName"
            label="First Name"
            placeholder="First Name"
            defaultValue={defaultAddress?.firstName}
          />
          <Field
            id="lastName"
            label="Last Name"
            placeholder="Last Name"
            defaultValue={defaultAddress?.lastName}
          />
        </div>

        <AddressSelect
          countryName="country"
          stateName="state"
          cityName="city"
          defaultCountryCode={defaultAddress?.country || "GB"}
          defaultStateCode={defaultAddress?.province || ""}
          defaultCity={defaultAddress?.city || ""}
          size="sm"
          onCountryChange={(iso) => setCountry(iso)}
        />

        <div>
          <Label className="text-xs sm:text-sm font-semibold">
            Street Address<span className="text-red-600">*</span>
          </Label>
          <div className="mt-2 sm:mt-3 grid gap-3 sm:gap-4 sm:grid-cols-2">
            <Input
              id="streetAddress1"
              name="streetAddress1"
              required
              defaultValue={defaultAddress?.streetAddress1}
              className="h-10 sm:h-12 text-xs sm:text-sm"
              placeholder="House Number and Street Name"
            />
            <Input
              id="streetAddress2"
              name="streetAddress2"
              defaultValue={defaultAddress?.streetAddress2}
              className="h-10 sm:h-12 text-xs sm:text-sm"
              placeholder="Apartment, suite, unit, etc (optional)"
            />
          </div>
        </div>

        <Field
          id="postcode"
          label="Postcode"
          placeholder="Postcode"
          defaultValue={defaultAddress?.postcode}
        />

        <div>
          <Label className="text-xs sm:text-sm font-semibold">
            Phone<span className="text-red-600">*</span>
          </Label>
          <div className="mt-2 sm:mt-3 grid grid-cols-[80px_1fr] sm:grid-cols-[100px_1fr] gap-3 sm:gap-4">
            <PhoneCodeSelect
              value={phoneCode}
              onValueChange={setPhoneCode}
              className="h-10 sm:h-12 w-full text-xs sm:text-sm"
            />
            <Input
              className="h-10 sm:h-12 text-xs sm:text-sm"
              id="phoneNum"
              name="phoneNum"
              placeholder="1234567890"
              defaultValue={defaultPhoneNum}
              required
            />
          </div>
        </div>

        <label className="flex items-start gap-3 text-xs sm:text-sm">
          <Checkbox className="mt-0.5" />
          <span>Sign me up to receive email updates and news (optional)</span>
        </label>

        <div>
          <Label
            className="text-xs sm:text-sm font-semibold"
            htmlFor="orderNotes"
          >
            Order Notes (optional)
          </Label>
          <textarea
            className="mt-2 sm:mt-3 min-h-24 sm:min-h-36 w-full rounded-lg border border-input bg-white px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm outline-none placeholder:text-muted-foreground focus-visible:border-foreground/60 focus-visible:ring-3 focus-visible:ring-ring/50"
            id="orderNotes"
            name="orderNotes"
            placeholder="e.g special notes for delivery"
          />
        </div>
      </div>
    </form>
  );
}

function Field({
  id,
  name,
  label,
  placeholder,
  type = "text",
  defaultValue,
}: {
  id: string;
  name?: string;
  label: string;
  placeholder: string;
  type?: string;
  defaultValue?: string;
}) {
  return (
    <div>
      <Label className="text-sm sm:text-lg font-semibold" htmlFor={id}>
        {label}
        <span className="text-red-600">*</span>
      </Label>
      <Input
        className="mt-2 sm:mt-3 h-10 sm:h-12 text-xs sm:text-sm"
        id={id}
        name={name || id}
        placeholder={placeholder}
        type={type}
        defaultValue={defaultValue}
        required
      />
    </div>
  );
}

function CheckoutSummary({ 
  isPending, 
  agreedToTerms, 
  setAgreedToTerms 
}: { 
  isPending: boolean;
  agreedToTerms: boolean;
  setAgreedToTerms: (val: boolean) => void;
}) {
  const { cartItems, cartSubtotal, couponCode, discountAmount } = useCart();

  // Free shipping over £125
  const shippingVal = cartSubtotal >= 125 ? 0 : 12.99;
  const totalVal = Math.max(0, cartSubtotal - discountAmount + shippingVal);

  const subtotalStr = `£${cartSubtotal.toFixed(2)}`;
  const shippingStr = shippingVal === 0 ? "Free" : `£${shippingVal.toFixed(2)}`;
  const totalStr = `£${totalVal.toFixed(2)}`;

  return (
    <div>
      <Card className="rounded-lg border-0 shadow-[0_0_8px_rgba(0,0,0,0.2)]">
        <CardHeader className="p-4 pb-2 sm:p-6 sm:pb-3">
          <CardTitle className="text-lg sm:text-xl font-satoshi font-bold">
            Order Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0 space-y-4 sm:space-y-6">
          <div className="flex justify-between text-base sm:text-xl font-bold uppercase">
            <span>Product</span>
            <span>Subtotal</span>
          </div>
          {cartItems.map((item) => (
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
          <SummaryLine label="Subtotal" value={subtotalStr} />
          {discountAmount > 0 && (
            <div className="flex justify-between text-emerald-600 font-semibold text-sm sm:text-xl animate-in fade-in duration-300">
              <span>Discount ({couponCode})</span>
              <span>-£{discountAmount.toFixed(2)}</span>
            </div>
          )}
          <SummaryLine label="Shipping" value={shippingStr} />
          <div className="flex justify-between text-base sm:text-xl font-bold">
            <span>Total</span>
            <span>{totalStr}</span>
          </div>

          <div className="rounded-lg border p-4 sm:p-5">
            <div className="flex gap-3 sm:gap-4">
              <div className="flex size-8 sm:size-10 shrink-0 items-center justify-center rounded-md bg-black text-white">
                <LockKeyhole className="size-4 sm:size-5" />
              </div>
              <div>
                <p className="font-semibold text-sm sm:text-lg">
                  Secure Checkout
                </p>
                <p className="mt-1 sm:mt-2 text-xs sm:text-base leading-normal text-black/65">
                  Every detail is carefully considered from formulation to
                  presentation.
                </p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm sm:text-lg font-semibold">
              Direct bank transfer
            </p>
            <p className="mt-1 sm:mt-2 text-xs sm:text-base text-black/65">
              Bank details will be emailed upon order.
            </p>
          </div>

          <label className="flex items-start gap-2.5 sm:gap-3 text-xs sm:text-base leading-4 cursor-pointer">
            <Checkbox 
              className="mt-0.5" 
              checked={agreedToTerms}
              onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
              required 
            />
            <span>
              I have read and agree to the website{" "}
              <Link
                className="font-semibold underline text-black"
                href="/terms-and-conditions"
              >
                terms and conditions
              </Link>
              .
            </span>
          </label>

          <Button
            type="submit"
            form="checkout-form"
            disabled={isPending}
            className="h-10 sm:h-12 w-full bg-black uppercase text-sm sm:text-lg font-bold text-white hover:bg-black/80 flex items-center justify-center animate-in zoom-in duration-300"
          >
            {isPending ? "Placing Order..." : "Place Order"}
          </Button>
          <p className="text-xs sm:text-base leading-normal text-black/60">
            Your personal data will be used to process your order, support your
            experience throughout this website, and for other purposes described
            in our privacy policy.
          </p>
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

function SummaryLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm sm:text-lg">
      <span className="font-semibold">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
