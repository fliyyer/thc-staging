"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Menu, X } from "lucide-react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { useSession } from "next-auth/react";

import logoBlackImage from "@/assets/logo-black.png";
import logoImage from "@/assets/logo.png";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/hooks/use-wishlist";

const navItems = ["Home", "Shop", "Blog", "About", "Contact"];
const navHrefByItem: Record<(typeof navItems)[number], string> = {
  Home: "/",
  Shop: "/shop",
  Blog: "/blog",
  About: "/about",
  Contact: "/contact",
};

type SiteNavbarProps = {
  activeItem?: string;
  activeUtility?: "cart" | "wishlist";
  isLoggedIn?: boolean;
  variant?: "light" | "dark";
};



export function SiteNavbar({
  activeItem = "Home",
  activeUtility,
  isLoggedIn = false,
  variant = "light",
}: SiteNavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isTokenLoggedIn, setIsTokenLoggedIn] = useState(false);
  const { data: session, status: sessionStatus } = useSession();
  const { cartCount, userAvatar, userProfile, fetchProfile } = useCart();
  const { wishlist } = useWishlist();
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 100) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  });

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const hasToken = !!(token && token !== "undefined" && token !== "null");
    setIsTokenLoggedIn(hasToken);
    if (hasToken) {
      fetchProfile();
    }
    setMounted(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isUserLoggedIn = mounted && (isTokenLoggedIn || sessionStatus === "authenticated" || !!(session as any)?.user || !!userProfile);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const logo = variant === "dark" ? logoBlackImage : logoImage;
  const iconButtonClass =
    variant === "dark"
      ? "size-9 rounded-lg border-black/0 bg-transparent p-0 text-black hover:bg-black hover:text-white sm:size-10"
      : "size-9 rounded-lg border-white/0 bg-transparent p-0 text-white hover:bg-white hover:text-black sm:size-10";
  const activeIconClass =
    variant === "dark" ? "fill-black text-black" : "fill-white text-white";
  const signInButtonClass =
    variant === "dark"
      ? "h-10 rounded-lg border-black bg-white px-4 text-sm text-black hover:bg-black hover:text-white sm:h-auto sm:px-6 sm:text-base"
      : "h-10 rounded-lg border-white bg-white/5 px-4 text-sm text-white hover:bg-white hover:text-black sm:h-auto sm:px-6 sm:text-base";

  const menuBgClass =
    variant === "dark"
      ? "bg-white/95 border-black/10 text-black shadow-lg"
      : "bg-black/95 border-white/10 text-white shadow-lg";

  const menuLinkClass = (item: string) => {
    if (variant === "dark") {
      return item === activeItem
        ? "font-bold text-black"
        : "font-normal text-black/70 hover:text-black";
    } else {
      return item === activeItem
        ? "font-bold text-white"
        : "font-normal text-white/70 hover:text-white";
    }
  };

  const menuButtonClass =
    variant === "dark"
      ? "bg-black text-white hover:bg-black/90"
      : "bg-white text-black hover:bg-white/90";

  const initials = userProfile
    ? `${userProfile.firstName.charAt(0)}${userProfile.lastName.charAt(0)}`.toUpperCase()
    : "TH";

  return (
    <div className="w-full h-24 sm:h-36">
      <motion.header
        initial={{ y: 0 }}
        animate={{
          y: 0,
          backgroundColor: isScrolled
            ? (variant === "dark" ? "rgba(255, 255, 255, 0.95)" : "rgba(0, 0, 0, 0.95)")
            : (variant === "dark" ? "rgba(255, 255, 255, 0)" : "rgba(0, 0, 0, 0)"),
          backdropFilter: isScrolled ? "blur(12px)" : "blur(0px)",
          boxShadow: isScrolled ? "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)" : "none"
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className={`w-full z-50 transition-all duration-500 ease-in-out ${isScrolled ? "fixed top-0 left-0 right-0" : "relative"}`}
      >
        <div className={`mx-auto flex max-w-360 flex-col px-4 sm:px-10 2xl:px-0 transition-all duration-500 ease-in-out ${isScrolled ? "py-1 sm:py-2 gap-1" : "py-5 sm:py-8 gap-5"}`}>
          <div className="flex items-center justify-between gap-4">
            <Link
              aria-label="Go to homepage"
              className="rounded-md outline-none"
              href="/"
            >
              <Image
                src={logo}
                alt="True High Collabs"
                width={124}
                height={124}
                className={`h-auto transition-all duration-500 ease-in-out ${isScrolled ? "w-12 sm:w-16" : "w-20 sm:w-28"}`}
              />
            </Link>

            <nav className="hidden items-center gap-5 lg:gap-13 text-xl font-medium md:flex">
              {navItems.map((item) => (
                <Link
                  className={`transition-opacity hover:opacity-70 ${variant === "dark" ? "text-black" : "text-white"
                    } ${item === activeItem ? "font-bold" : "font-normal"}`}
                  href={navHrefByItem[item]}
                  key={item}
                >
                  {item}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2 lg:gap-8">
              <Button
                asChild
                aria-label="Open favorites"
                className={`${iconButtonClass} relative`}
                variant="ghost"
              >
                <Link
                  aria-current={activeUtility === "wishlist" ? "page" : undefined}
                  href="/wishlist"
                >
                  <Heart
                    className={`size-6 ${activeUtility === "wishlist" ? activeIconClass : ""
                      }`}
                  />
                  {wishlist.length > 0 && (
                    <span className="absolute -right-1.5 -top-1.5 flex size-4 items-center justify-center rounded-full bg-red-600 text-[9px] font-bold text-white animate-in zoom-in duration-300">
                      {wishlist.length}
                    </span>
                  )}
                </Link>
              </Button>
              <Button
                asChild
                aria-label="Open cart"
                className={`${iconButtonClass} relative`}
                variant="ghost"
              >
                <Link
                  aria-current={activeUtility === "cart" ? "page" : undefined}
                  href="/cart"
                >
                  <ShoppingCart
                    className={`size-6 ${activeUtility === "cart" ? activeIconClass : ""}`}
                  />
                  {cartCount > 0 && (
                    <span className="absolute -right-1.5 -top-1.5 flex size-4 items-center justify-center rounded-full bg-red-600 text-[9px] font-bold text-white animate-in zoom-in duration-300">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </Button>
              {isUserLoggedIn ? (
                <Link
                  aria-label="Open account"
                  className="hidden md:block rounded-full outline-none transition-opacity hover:opacity-80 focus-visible:ring-3 focus-visible:ring-ring/50"
                  href="/account"
                >
                  <Avatar className="size-11 border border-current/25">
                    {userAvatar ? (
                      <div className="relative size-11 rounded-full overflow-hidden">
                        <Image
                          src={userAvatar}
                          alt="User Avatar"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    ) : (
                      <AvatarFallback
                        className={
                          variant === "dark"
                            ? "bg-black text-white"
                            : "bg-white text-black"
                        }
                      >
                        {initials}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </Link>
              ) : (
                <Button
                  asChild
                  className={`${signInButtonClass} hidden md:inline-flex`}
                  variant="outline"
                >
                  <Link href="/auth/login">Sign in</Link>
                </Button>
              )}

              {/* Hamburger Button */}
              <Button
                onClick={() => setIsOpen(!isOpen)}
                className={`${iconButtonClass} md:hidden`}
                variant="ghost"
                aria-label="Toggle menu"
              >
                {isOpen ? <X className="size-6" /> : <Menu className="size-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Side Drawer */}
        {mounted && createPortal(
          <AnimatePresence>
            {isOpen && (
              <>
                {/* Overlay / Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setIsOpen(false)}
                  className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-[2px] md:hidden"
                />

                {/* Side Drawer Container */}
                <motion.div
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
                  className="fixed right-0 top-0 bottom-0 z-[9999] w-full max-w-[300px] bg-white text-black p-6 flex flex-col justify-between md:hidden shadow-2xl h-screen"
                >
                  <div>
                    {/* Close button at top right */}
                    <div className="flex justify-end">
                      <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 hover:opacity-70 text-black outline-none transition-opacity"
                        aria-label="Close menu"
                      >
                        <X className="size-6" />
                      </button>
                    </div>

                    {/* Menu Items (matching design style) */}
                    <nav className="mt-4 flex flex-col gap-6 text-[15px] font-bold tracking-widest text-black pl-2">
                      <Link
                        href="/shop"
                        onClick={() => setIsOpen(false)}
                        className="hover:opacity-70 transition-opacity"
                      >
                        SHOP
                      </Link>
                      <Link
                        href="/about"
                        onClick={() => setIsOpen(false)}
                        className="hover:opacity-70 transition-opacity"
                      >
                        ABOUT
                      </Link>
                      <Link
                        href="/blog"
                        onClick={() => setIsOpen(false)}
                        className="hover:opacity-70 transition-opacity"
                      >
                        BLOG
                      </Link>
                      <Link
                        href="/contact"
                        onClick={() => setIsOpen(false)}
                        className="hover:opacity-70 transition-opacity"
                      >
                        CONTACT
                      </Link>
                      <Link
                        href={isUserLoggedIn ? "/account" : "/auth/login"}
                        onClick={() => setIsOpen(false)}
                        className="hover:opacity-70 transition-opacity font-normal text-black/60 pt-6 border-t border-black/5"
                      >
                        {isUserLoggedIn ? "MY ACCOUNT" : "LOGIN / REGISTER"}
                      </Link>
                    </nav>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body
        )}
      </motion.header>
    </div>
  );
}
