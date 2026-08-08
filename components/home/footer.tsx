import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import logoImage from "@/assets/logo.png";
import masterCardImage from "@/assets/master-card.png";
import visaImage from "@/assets/visa.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const navItems = ["Home", "Shop", "Blog", "About", "Contact"];
const navHrefByItem: Record<(typeof navItems)[number], string> = {
  Home: "/",
  Shop: "/shop",
  Blog: "/blog",
  About: "/about",
  Contact: "/contact",
};

export function SiteFooter() {
  return (
    <footer className="bg-black px-4 py-12 text-white sm:px-10 sm:py-16">
      <div className="mx-auto max-w-360">
        <div className="grid gap-6 lg:grid-cols-[1fr_420px] lg:gap-8">
          <div>
            <h2 className="text-xl sm:text-[32px] font-satoshi font-bold leading-tight">
              Join the True High Collabs Community
            </h2>
            <p className="mt-2 max-w-xl text-xs sm:text-sm leading-5 text-white/80">
              Sign up for our members list and enjoy exclusive offers, updates.
              Stay connected with True High Collabs to be the first to know
              about new products, promotions and events.
            </p>
          </div>
          <form className="relative w-full self-center lg:self-end" action="#">
            <label className="sr-only" htmlFor="footer-email">
              Email address
            </label>
            <Input
              className="h-12 rounded-lg border-0 bg-white pl-5 pr-14 text-xs sm:text-sm text-black shadow-none placeholder:text-[#8c8c8c] focus-visible:ring-2 focus-visible:ring-white/30"
              id="footer-email"
              placeholder="Enter your e-mail"
              type="email"
            />
            <Button
              aria-label="Subscribe"
              className="absolute right-2 top-1/2 size-8 -translate-y-1/2 rounded-md bg-black p-0 text-white hover:bg-black/80"
              size="icon"
              type="submit"
            >
              <ArrowRight className="size-4 -rotate-45" />
            </Button>
          </form>
        </div>

        <div className="mt-12 sm:mt-15 grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-[1.2fr_1fr_0.6fr_0.8fr] lg:gap-10">
          <div className="col-span-2 lg:col-span-1">
            <Image
              src={logoImage}
              alt="True High Collabs"
              width={100}
              height={100}
              className="h-16 w-16 lg:h-[131px] lg:w-[131px] object-contain"
            />
            <p className="mt-4 lg:mt-6 mb-2 lg:mb-8 max-w-xs text-xs sm:text-sm leading-5 text-white/80">
              Founded in 2023, True High Collabs combines nature&apos;s most
              potent remedies to create exceptional products that truly stand
              out.
            </p>
          </div>
          <div className="col-span-2 lg:col-span-1">
            <h3 className="text-sm sm:text-base lg:text-lg font-bold">Contact</h3>
            <p className="mt-3 text-xs sm:text-sm leading-5 text-white/80">
              Have Questions about our services or current offers? Contact our
              team for expert assistance.
            </p>
            <p className="mt-4 text-xs sm:text-sm">Email : hello@truehighcollabs.co.uk</p>
          </div>
          <div className="col-span-1">
            <h3 className="text-sm sm:text-base lg:text-lg font-bold">Quick Links</h3>
            <div className="mt-3 grid gap-2 text-xs sm:text-sm text-white/80">
              {navItems.map((item) => (
                <Link
                  className="transition-opacity hover:opacity-70"
                  href={navHrefByItem[item]}
                  key={item}
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
          <div className="col-span-1">
            <h3 className="text-sm sm:text-base lg:text-lg font-bold">Help & Support</h3>
            <div className="mt-3 grid gap-2 text-xs sm:text-sm text-white/80">
              <Link className="transition-opacity hover:opacity-70" href="/faq">
                Frequently Asked Questions
              </Link>
              <Link
                className="transition-opacity hover:opacity-70"
                href="/privacy-policy"
              >
                Privacy Policy
              </Link>
              <Link
                className="transition-opacity hover:opacity-70"
                href="/terms-and-conditions"
              >
                Term & Conditions
              </Link>
              <Link
                className="transition-opacity hover:opacity-70"
                href="/track-order"
              >
                Track Order
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 flex items-center justify-between">
          <Link
            aria-label="Instagram"
            className="text-2xl"
            href="https://www.instagram.com/truehighcollabs/"
          >
            <InstagramIcon />
          </Link>

          <div className="flex items-center gap-3">
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

        <Separator className="mt-8 bg-white/40" />
        <p className="mt-8 text-center text-xs sm:text-sm text-white/60">© 2026 True High Collabs</p>
      </div>
    </footer>
  );
}

function InstagramIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-8"
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="3.5"
        y="3.5"
        width="17"
        height="17"
        rx="5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="12" r="3.8" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
    </svg>
  );
}
