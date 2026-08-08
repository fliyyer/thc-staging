"use client";

import { useMemo, useState, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

import choose1Icon from "@/assets/icons/choose-1.svg";
import choose2Icon from "@/assets/icons/choose-2.svg";
import choose3Icon from "@/assets/icons/choose-3.svg";
import choose4Icon from "@/assets/icons/choose-4.svg";
import choose5Icon from "@/assets/icons/choose-5.svg";
import choose6Icon from "@/assets/icons/choose-6.svg";
import choose7Icon from "@/assets/icons/choose-7.svg";
import choose8Icon from "@/assets/icons/choose-8.svg";
import choose9Icon from "@/assets/icons/choose-9.svg";

const reasons = [
  {
    icon: choose1Icon,
    title: "Organic Ingredients Throughout",
    text: "While many brands cut corners with low-grade ingredients, we prioritise organic inputs and carefully selected materials across our range wherever possible.",
  },
  {
    icon: choose2Icon,
    title: "Certificates of Analysis",
    text: "Not every brand can show where their extracts come from. We work with legitimate suppliers and source materials supported by Certificates of Analysis for added confidence and traceability.",
  },
  {
    icon: choose3Icon,
    title: "Premium Extracts. No Shortcuts.",
    text: "A product is only good as what goes into it. We focus on top-tier extracts and high-quality ingredients rather than cheaper, weaker alternatives.",
  },
  {
    icon: choose4Icon,
    title: "Curated Product Selection",
    text: "Instead of flooding the market with average products, we carefully curate our range to offer standout vapes, gummies and more with purpose and quality.",
  },
  {
    icon: choose5Icon,
    title: "Discreet & Reliable Delivery",
    text: "Many customers are let down by poor packaging, delays or lack of communication. We focus on discreet delivery, reliable fulfilment and a smoother customer experience.",
  },
  {
    icon: choose6Icon,
    title: "Crafted For Consistency",
    text: "Inconsistent products are one of the biggest issues in the market. Our products are developed with consistency in mind, so customers know what to expect every time.",
  },
  {
    icon: choose7Icon,
    title: "Carefully Designed For Modern Customers",
    text: "We create products that feel refined, discreet and future forward - not outdated, messy or thrown together without thought.",
  },
  {
    icon: choose8Icon,
    title: "Future-Forward Innovation",
    text: "We don't believe in standing still. While others rely on the same basic formulas, we keep improving our materials, formulations and overall product experience.",
  },
  {
    icon: choose9Icon,
    title: "Built With Passion For Quality",
    text: "True High Collabs was built with care, not shortcuts. Every product reflects our commitment to better sourcing, better design and a better customer experience.",
  },
];

const PAGE_SIZE = 3;

export function WhyChooseSlider() {
  const [activePage, setActivePage] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const pages = useMemo(() => {
    const chunks = [];

    for (let index = 0; index < reasons.length; index += PAGE_SIZE) {
      chunks.push(reasons.slice(index, index + PAGE_SIZE));
    }

    return chunks;
  }, []);

  const totalPages = pages.length;

  const goToPrevious = () => {
    setActivePage((current) => (current - 1 + totalPages) % totalPages);
  };

  const goToNext = () => {
    setActivePage((current) => (current + 1) % totalPages);
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft } = scrollRef.current;
    const itemWidth =
      scrollRef.current.children[0]?.getBoundingClientRect().width || 1;
    const gap = 16;
    const index = Math.round(scrollLeft / (itemWidth + gap));
    const pageIndex = Math.min(2, Math.max(0, Math.floor(index / 3)));
    setActivePage(pageIndex);
  };

  const scrollToPage = (pageIndex: number) => {
    setActivePage(pageIndex);
    if (!scrollRef.current) return;
    const itemWidth =
      scrollRef.current.children[0]?.getBoundingClientRect().width || 0;
    const gap = 16;
    scrollRef.current.scrollTo({
      left: pageIndex * 3 * (itemWidth + gap),
      behavior: "smooth",
    });
  };

  return (
    <div className="mt-12">
      <div className="group relative">
        {/* Desktop-only chunk view */}
        <div className="hidden md:grid gap-6 md:grid-cols-3">
          {pages[activePage].map((reason) => {
            return (
              <Card
                className="gap-0 rounded-[5px] border-0 p-6 shadow-[0_0_10px_0_rgba(0,0,0,0.25)]"
                key={reason.title}
              >
                <div className="flex size-11 items-center justify-center rounded-md bg-black">
                  <Image
                    src={reason.icon}
                    alt=""
                    width={24}
                    height={24}
                    className="size-6 object-contain"
                  />
                </div>
                <CardTitle className="mt-8 text-[18px] font-bold leading-7">
                  {reason.title}
                </CardTitle>
                <CardDescription className="mt-4 text-sm leading-6 text-black">
                  {reason.text}
                </CardDescription>
              </Card>
            );
          })}
        </div>

        {/* Mobile-only horizontal continuous scroll carousel */}
        <div className="md:hidden">
          <style>{`
            .scrollbar-none::-webkit-scrollbar {
              display: none;
            }
            .scrollbar-none {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `}</style>
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-4 pb-4 scrollbar-none"
          >
            {reasons.map((reason) => (
              <div className="w-[70vw] shrink-0 snap-start" key={reason.title}>
                <Card className="gap-0 rounded-[5px] border-0 p-6 shadow-[0_0_10px_0_rgba(0,0,0,0.25)] h-full min-h-[220px]">
                  <div className="flex size-8 items-center justify-center rounded-md bg-black">
                    <Image
                      src={reason.icon}
                      alt=""
                      width={18}
                      height={18}
                      className="size-4 object-contain"
                    />
                  </div>
                  <CardTitle className="mt-2 text-justify text-sm font-bold leading-7">
                    {reason.title}
                  </CardTitle>
                  <CardDescription className="mt-2 text-xs text-justify text-black">
                    {reason.text}
                  </CardDescription>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {totalPages > 1 ? (
          <>
            <Button
              aria-label="Show previous reasons"
              className="absolute -left-12 top-1/2 z-10 hidden md:inline-flex size-9 -translate-x-2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/85 p-0 text-white opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
              onClick={goToPrevious}
              size="icon"
              type="button"
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              aria-label="Show next reasons"
              className="absolute -right-12 top-1/2 z-10 hidden md:inline-flex size-9 translate-x-2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/85 p-0 text-white opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
              onClick={goToNext}
              size="icon"
              type="button"
            >
              <ChevronRight className="size-4" />
            </Button>
          </>
        ) : null}
      </div>

      <div className="mt-14 flex justify-center gap-4">
        {pages.map((_, index) => (
          <button
            aria-label={`Go to reasons page ${index + 1}`}
            className={`size-3 cursor-pointer rounded-full transition-colors duration-200 ${
              index === activePage ? "bg-black" : "bg-[#d2d5db]"
            }`}
            key={index}
            onClick={() => scrollToPage(index)}
            type="button"
          />
        ))}
      </div>
    </div>
  );
}
