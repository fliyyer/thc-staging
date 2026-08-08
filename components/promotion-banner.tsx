"use client";

import Image from "next/image";
import { useState, useSyncExternalStore } from "react";
import { X, Loader2 } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";

import logoImage from "@/assets/logo.png";
import bannerImageFallback from "@/assets/bannerpromo.webp";
import productImageFallback from "@/assets/produk.png";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  fetchPromoBanner,
  subscribeNewsletter,
  getPromoImageUrl,
} from "@/lib/api/promotion-api";
import { getProductImageUrl } from "@/lib/api/products-api";

const AGE_GATE_COOKIE = "thc_age_verified";
const PROMO_SESSION_KEY = "thc_promo_seen";
const emptySubscribe = () => () => { };
const subscribeAgeVerification = (callback: () => void) => {
  window.addEventListener("thc-age-verified", callback);
  return () => {
    window.removeEventListener("thc-age-verified", callback);
  };
};

function readAgeVerificationCookie() {
  return document.cookie
    .split("; ")
    .some((cookie) => cookie.startsWith(`${AGE_GATE_COOKIE}=true`));
}

function readPromoSession() {
  return window.sessionStorage.getItem(PROMO_SESSION_KEY) === "true";
}

type PromoStep = "intro" | "form" | "success";

export function PromotionBanner() {
  const [step, setStep] = useState<PromoStep>("intro");
  const [email, setEmail] = useState("");
  const [isDismissed, setIsDismissed] = useState(false);
  
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  
  const isAgeVerified = useSyncExternalStore(
    subscribeAgeVerification,
    readAgeVerificationCookie,
    () => false,
  );
  
  const hasSeenPromo = useSyncExternalStore(
    emptySubscribe,
    readPromoSession,
    () => true,
  );

  const { data: banner, isLoading } = useQuery({
    queryKey: ["promo-banner"],
    queryFn: fetchPromoBanner,
    enabled: isClient && isAgeVerified && !hasSeenPromo,
  });

  const subscribeMutation = useMutation({
    mutationFn: subscribeNewsletter,
    onSuccess: () => {
      setStep("success");
    },
  });

  if (!isClient) {
    return null;
  }

  const canShow = isAgeVerified && !hasSeenPromo && banner?.isActive;
  const isOpen = canShow && !isDismissed && !isLoading;

  const dismissForSession = () => {
    window.sessionStorage.setItem(PROMO_SESSION_KEY, "true");
    setIsDismissed(true);
  };

  if (!isOpen || !banner) {
    return null;
  }

  return (
    <Dialog open={isOpen}>
      <DialogContent
        className="w-[calc(100vw-1.5rem)] max-w-[30rem] overflow-hidden rounded-[5px] border-0 bg-transparent p-0 shadow-none sm:w-246 sm:max-w-none"
        onEscapeKeyDown={dismissForSession}
        aria-describedby={undefined}
        onInteractOutside={dismissForSession}
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">
          {banner.title} promotional offer
        </DialogTitle>
        <div
          className={`relative w-full overflow-hidden rounded-[5px] ${step === "form"
            ? "min-h-[43rem] sm:h-140 sm:min-h-0"
            : step === "success"
              ? "min-h-[38rem] sm:h-115 sm:min-h-0"
              : "min-h-[41rem] sm:h-125 sm:min-h-0"
            }`}
        >
          <Image
            alt={banner.title}
            className="object-cover"
            fill
            priority
            sizes="(min-width: 640px) 984px, 100vw"
            src={getPromoImageUrl(banner.imageUrl) || bannerImageFallback}
          />

          <Button
            aria-label="Close promotion banner"
            className="absolute right-4 top-4 z-30 size-9 rounded-full border border-white bg-black/10 p-0 text-white transition hover:bg-white hover:text-black sm:right-8 sm:top-8 sm:size-10"
            onClick={dismissForSession}
            size="icon"
            type="button"
          >
            <X className="size-5" />
          </Button>

          <div className="relative z-10 flex flex-col items-center px-4 pb-6 pt-14 text-center sm:absolute sm:inset-x-0 sm:top-0 sm:flex-row sm:items-start sm:justify-between sm:px-7 sm:py-6 sm:text-left">
            <Image
              alt="True High Collabs"
              className="h-auto w-18 shrink-0 drop-shadow-[0_4px_14px_rgba(0,0,0,0.45)] sm:w-24"
              height={96}
              src={logoImage}
              width={96}
            />
            <div className="mt-4 flex-1 px-0 text-white sm:mt-0 sm:px-6 sm:text-center">
              <p className="text-sm font-medium uppercase tracking-[0.2em] sm:text-base sm:tracking-wide">
                Special Offer
              </p>
              <h2 className="mt-2 text-3xl font-bold leading-none sm:text-5xl">
                {banner.title}
              </h2>
              {banner.promoProducts && banner.promoProducts.length > 0 && (
                <div className="mt-4 grid grid-cols-4 justify-center gap-3 sm:flex sm:gap-6">
                  {banner.promoProducts.map((product, index) => (
                    <div
                      className="relative size-18 shrink-0 drop-shadow-[0_10px_20px_rgba(0,0,0,0.28)] sm:size-22"
                      key={product.id || index}
                    >
                      <Image
                        alt={product.title}
                        className="object-contain"
                        fill
                        sizes="(min-width: 640px) 88px, 72px"
                        src={getProductImageUrl(product.imageUrl) || productImageFallback}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="hidden w-24 sm:block" />
          </div>

          <div className="relative z-10 mt-6 flex justify-center px-4 pb-4 sm:absolute sm:inset-x-0 sm:bottom-8 sm:mt-0 sm:px-6 sm:pb-0">
            <div className="w-full max-w-[26rem] rounded-[5px] bg-white px-5 py-6 text-center shadow-[0_8px_24px_rgba(0,0,0,0.18)] sm:max-w-[424px] sm:px-8 sm:py-7">
              <p className="text-sm font-semibold sm:text-base">
                {banner.subtitle}
              </p>
              <p className="mt-3 text-lg font-bold sm:text-xl">{banner.discountText}</p>
              
              {step === "intro" ? (
                <>
                  <Button
                    className="mt-3 w-full rounded-[5px] bg-black px-6 py-3 text-sm text-white hover:bg-black/80 sm:w-auto"
                    onClick={() => setStep("form")}
                    type="button"
                  >
                    Get My Discount Code
                  </Button>
                  <p className="mt-3 text-sm font-semibold">
                    Subscriber Exclusive
                  </p>
                  <p className="mt-3 text-xs text-black/70">
                    {banner.description}
                  </p>
                </>
              ) : null}

              {step === "form" ? (
                <>
                  <Input
                    className="mt-3 rounded-[5px] px-4 py-3 text-center sm:px-6"
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Enter your Email Address"
                    type="email"
                    value={email}
                  />
                  {subscribeMutation.error && (
                    <p className="mt-2 text-xs font-semibold text-red-600">
                      {subscribeMutation.error.message}
                    </p>
                  )}
                  <Button
                    className="mt-3 w-full rounded-[5px] bg-black px-6 py-3 text-white hover:bg-black/80 flex items-center justify-center gap-2"
                    onClick={() => {
                      if (!email.trim() || subscribeMutation.isPending) {
                        return;
                      }
                      subscribeMutation.mutate(email);
                    }}
                    disabled={subscribeMutation.isPending}
                    type="button"
                  >
                    {subscribeMutation.isPending && (
                      <Loader2 className="size-4 animate-spin" />
                    )}
                    Continue
                  </Button>
                  <p className="mt-3 text-sm font-semibold">
                    Subscriber Exclusive
                  </p>
                  <p className="mt-3 text-xs leading-5 text-black/70">
                    {banner.description}
                  </p>
                </>
              ) : null}

              {step === "success" ? (
                <>
                  <p className="text-sm mt-3 font-bold text-emerald-600">Success!</p>
                  <p className="mt-3 text-xs leading-5 text-black/70">
                    Check your inbox for the discount code.
                  </p>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
