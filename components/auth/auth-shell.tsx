import Image from "next/image";
import type { ReactNode } from "react";

import layoutAuthImage from "@/assets/layout-auth.png";
import logoImage from "@/assets/logo.png";
import { cn } from "@/lib/utils";

type AuthShellProps = {
  children: ReactNode;
};

export function AuthShell({ children }: AuthShellProps) {
  return (
    <main className="min-h-screen bg-white text-black">
      <div className="grid min-h-screen lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <section className="relative min-h-90 overflow-hidden bg-black lg:min-h-screen">
          <Image
            src={layoutAuthImage}
            alt=""
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/35" />
          <div className="relative z-10 flex h-full min-h-90 flex-col justify-between px-8 py-10 text-white sm:px-12 lg:min-h-screen lg:px-14 lg:py-16">
            <Image
              src={logoImage}
              alt="True High Collabs"
              width={132}
              height={132}
              priority
              className="h-auto w-[65px] sm:w-28 lg:w-32"
            />
            <div className="max-w-143">
              <h1 className="font-satoshi text-2xl mt-24 sm:mt-0 font-bold leading-tight tracking-normal sm:text-5xl">
                <span>Unlock The</span> <br /> Power Of Nature <br />
                With True High Collabs.
              </h1>
              <p className="mt-6 text-xs sm:text-lg font-medium text-white">
                Founded in 2023, True High Collabs combines nature&apos;s most
                potent remedies to create exceptional products that truly stand
                out.
              </p>
            </div>
          </div>
        </section>

        <section
          className={cn(
            "flex min-h-screen items-start justify-center px-6 py-12 pt-20 sm:px-10 sm:pt-24 lg:px-12 lg:pt-28",
          )}
        >
          <div className="w-full ">{children}</div>
        </section>
      </div>
    </main>
  );
}
