"use client";

import Image from "next/image";
import { useState, useSyncExternalStore } from "react";

import gateImage from "@/assets/verif-age.webp";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const AGE_GATE_COOKIE = "thc_age_verified";
const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365;
const emptySubscribe = () => () => {};

function readAgeVerificationCookie() {
  return document.cookie
    .split("; ")
    .some((cookie) => cookie.startsWith(`${AGE_GATE_COOKIE}=true`));
}

export function AgeGate() {
  const [isAccepted, setIsAccepted] = useState(false);
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  const isVerified = useSyncExternalStore(
    emptySubscribe,
    readAgeVerificationCookie,
    () => false,
  );

  if (!isClient) {
    return null;
  }

  return (
    <Dialog open={!isAccepted && !isVerified}>
      <DialogContent
        className="w-108 rounded-[5px] border-0 p-4 sm:p-6"
        onEscapeKeyDown={(event) => event.preventDefault()}
        onInteractOutside={(event) => event.preventDefault()}
        showCloseButton={false}
      >
        <div className="overflow-hidden rounded-[5px]">
          <Image
            src={gateImage}
            alt="True High Collabs age verification"
            width={384}
            height={384}
            priority
          />
        </div>

        <DialogHeader className="px-2 pb-1 text-center">
          <DialogTitle className="text-center text-xl font-bold tracking-normal">
            Are You 18 Or Older?
          </DialogTitle>
          <DialogDescription className="mx-auto my-3 text-center text-sm leading-5 text-black">
            You must be at least 18 years of age to access and explore the
            collections available on this website.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4">
          <Button
            className="px-6 py-3 rounded-[5px] hover:bg-black/30 "
            onClick={() => {
              window.location.href = "https://www.google.com";
            }}
            type="button"
            variant="outline"
          >
            No, I&apos;m under 18
          </Button>
          <Button
            className="px-6 py-3 rounded-[5px] bg-black text-white hover:bg-black/80"
            onClick={() => {
              document.cookie = `${AGE_GATE_COOKIE}=true; max-age=${ONE_YEAR_IN_SECONDS}; path=/; SameSite=Lax`;
              window.dispatchEvent(new Event("thc-age-verified"));
              setIsAccepted(true);
            }}
            type="button"
          >
            Yes, I&apos;m 18+
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
