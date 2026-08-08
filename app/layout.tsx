import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";

import { AgeGate } from "@/components/age-gate";
import { QueryProvider } from "@/components/providers/query-provider";
import { SessionProvider } from "@/components/providers/session-provider";
import { CartProvider } from "@/context/cart-context";
import "./globals.css";


const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const satoshi = localFont({
  src: [
    {
      path: "../assets/font/satoshi/Satoshi-Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../assets/font/satoshi/Satoshi-LightItalic.otf",
      weight: "300",
      style: "italic",
    },
    {
      path: "../assets/font/satoshi/Satoshi-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/font/satoshi/Satoshi-Italic.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../assets/font/satoshi/Satoshi-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../assets/font/satoshi/Satoshi-MediumItalic.otf",
      weight: "500",
      style: "italic",
    },
    {
      path: "../assets/font/satoshi/Satoshi-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../assets/font/satoshi/Satoshi-BoldItalic.otf",
      weight: "700",
      style: "italic",
    },
    {
      path: "../assets/font/satoshi/Satoshi-Black.otf",
      weight: "900",
      style: "normal",
    },
    {
      path: "../assets/font/satoshi/Satoshi-BlackItalic.otf",
      weight: "900",
      style: "italic",
    },
  ],
  variable: "--font-satoshi",
});

export const metadata: Metadata = {
  title: "True High Collabs | Premium Cannabis & Mushroom Products",
  description: "Unlock the power of nature with True High Collabs. Discover premium products inspired by cannabis culture, mushrooms, and modern rituals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${geistMono.variable} ${satoshi.variable}`}>
        <SessionProvider>
          <QueryProvider>
            <CartProvider>
              {children}
              <AgeGate />
            </CartProvider>
          </QueryProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
