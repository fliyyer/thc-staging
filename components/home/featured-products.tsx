"use client";

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

import promoProduct1 from "@/assets/promo/pro-1.png";
import promoProduct4 from "@/assets/promo/pro-4.png";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  fetchProducts,
  getProductImageUrl,
  type ApiProduct,
} from "@/lib/api/products-api";

type FeaturedSlide = {
  description: string;
  image: StaticImageData | string;
  subtitle: string;
  title: string;
  slug?: string;
};

// Helper to convert database products into slides, 1 slide per product
function mapProductsToSlides(
  products: ApiProduct[],
  fallbackImage: StaticImageData,
): FeaturedSlide[] {
  return products.map((p) => {
    const primaryImage =
      p.imageUrl
        ? p.imageUrl
        : p.imageUrls && p.imageUrls.length > 0
          ? p.imageUrls[0]
          : null;

    return {
      title: p.title,
      subtitle: p.subtitle || "Premium Quality Product",
      description: p.summary || p.description || "",
      image: (primaryImage ? getProductImageUrl(primaryImage) : null) || fallbackImage,
      slug: p.slug,
    };
  });
}

export function FeaturedProducts() {
  const [newArrivalSlides, setNewArrivalSlides] = useState<FeaturedSlide[]>([]);
  const [vapeBestSellers, setVapeBestSellers] = useState<FeaturedSlide[]>([]);
  const [gummiesBestSellers, setGummiesBestSellers] = useState<FeaturedSlide[]>(
    [],
  );
  const [loading, setLoading] = useState(true);

  const [activeMobileSlide, setActiveMobileSlide] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (!carouselRef.current) return;
    const scrollLeft = carouselRef.current.scrollLeft;
    // Each slide is w-[85vw] plus gap, let's use clientWidth as an approximation
    const slideWidth = carouselRef.current.clientWidth;
    const newIndex = Math.round(scrollLeft / slideWidth);
    if (newIndex !== activeMobileSlide) {
      setActiveMobileSlide(newIndex);
    }
  };

  const scrollToSlide = (index: number) => {
    if (!carouselRef.current) return;
    const slideWidth = carouselRef.current.clientWidth;
    carouselRef.current.scrollTo({
      left: slideWidth * index,
      behavior: "smooth",
    });
    setActiveMobileSlide(index);
  };

  useEffect(() => {
    async function loadFeaturedData() {
      try {
        const [naRes, bsRes] = await Promise.all([
          fetchProducts({ collection: "NEW_ARRIVAL", limit: 10 }),
          fetchProducts({ collection: "BEST_SELLER", limit: 10 }),
        ]);

        if (naRes.data && naRes.data.length > 0) {
          const slides = mapProductsToSlides(naRes.data, promoProduct1);
          setNewArrivalSlides(slides);
        }

        if (bsRes.data && bsRes.data.length > 0) {
          // Split Best Sellers into two groups for the two mini cards
          const half = Math.max(1, Math.ceil(bsRes.data.length / 2));
          const firstHalf = bsRes.data.slice(0, half);
          const secondHalf = bsRes.data.slice(half);

          if (firstHalf.length > 0) {
            setVapeBestSellers(mapProductsToSlides(firstHalf, promoProduct1));
          }
          if (secondHalf.length > 0) {
            setGummiesBestSellers(mapProductsToSlides(secondHalf, promoProduct4));
          } else {
            // If only 1 best seller exists, duplicate it so the UI doesn't break
            setGummiesBestSellers(mapProductsToSlides(firstHalf, promoProduct4));
          }
        }
      } catch (err) {
        console.error("Failed to load featured products:", err);
      } finally {
        setLoading(false);
      }
    }
    loadFeaturedData();
  }, []);

  if (loading) {
    return (
      <section className="px-4 py-16 sm:px-10 sm:py-24">
        <div className="mx-auto max-w-7xl animate-pulse">
          <p className="text-xs sm:text-base font-medium uppercase bg-gray-200 h-4 w-32 rounded mb-4" />
          <h2 className="mt-4 h-10 sm:h-12 w-2/3 sm:w-1/2 bg-gray-200 rounded mb-8" />

          <div className="-mx-6 flex gap-5 overflow-x-auto px-6 pb-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] lg:mx-0 lg:px-0 lg:pb-0 lg:grid lg:grid-cols-2 lg:h-[859px] lg:overflow-visible">
            {/* Large Card Skeleton */}
            <div className="w-[85vw] shrink-0 snap-center sm:w-[90vw] lg:w-auto lg:h-full">
              <Card className="rounded-lg p-0 shadow-md h-full flex flex-col">
                <CardHeader className="p-4 m-6 text-center bg-gray-100 rounded h-14" />
                <CardContent className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="h-[260px] sm:h-[350px] lg:h-[400px] w-full bg-gray-200 rounded-lg mb-6" />
                    <div className="h-4 w-1/4 bg-gray-200 rounded mx-auto mb-5" />
                    <div className="h-8 w-3/4 bg-gray-200 rounded mb-4" />
                    <div className="h-5 w-1/2 bg-gray-200 rounded mb-4" />
                    <div className="h-16 w-full bg-gray-200 rounded mb-6" />
                  </div>
                  <div className="h-10 w-32 bg-gray-200 rounded" />
                </CardContent>
              </Card>
            </div>

            {/* Mini Cards Skeletons (Mobile) */}
            {[1, 2].map((i) => (
              <div
                key={i}
                className="w-[85vw] shrink-0 snap-center sm:w-[90vw] lg:hidden"
              >
                <Card className="rounded-lg p-0 shadow-md h-full flex flex-col">
                  <CardHeader className="p-4 m-6 text-center bg-gray-100 rounded h-14" />
                  <CardContent className="grid gap-6 p-6 sm:grid-cols-[1fr_160px] flex-1">
                    <div className="flex flex-col justify-between h-full">
                      <div>
                        <div className="h-8 w-3/4 bg-gray-200 rounded mb-4" />
                        <div className="h-5 w-1/2 bg-gray-200 rounded mb-4" />
                        <div className="h-16 w-full bg-gray-200 rounded mb-6" />
                      </div>
                      <div className="h-10 w-32 bg-gray-200 rounded" />
                    </div>
                    <div>
                      <div className="h-45 w-40 bg-gray-200 rounded-lg mb-5" />
                      <div className="h-4 w-1/4 bg-gray-200 rounded mx-auto" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}

            {/* Mini Cards Skeletons (Desktop) */}
            <div className="hidden lg:grid grid-rows-2 gap-5 h-full">
              {[1, 2].map((i) => (
                <Card
                  key={`desktop-${i}`}
                  className="rounded-lg p-0 shadow-md h-full flex flex-col"
                >
                  <CardHeader className="p-4 m-6 text-center bg-gray-100 rounded h-14" />
                  <CardContent className="grid gap-6 p-6 sm:grid-cols-[1fr_160px] flex-1">
                    <div className="flex flex-col justify-between h-full">
                      <div>
                        <div className="h-8 w-3/4 bg-gray-200 rounded mb-4" />
                        <div className="h-5 w-1/2 bg-gray-200 rounded mb-4" />
                        <div className="h-16 w-full bg-gray-200 rounded mb-6" />
                      </div>
                      <div className="h-10 w-32 bg-gray-200 rounded" />
                    </div>
                    <div>
                      <div className="h-45 w-40 bg-gray-200 rounded-lg mb-5" />
                      <div className="h-4 w-1/4 bg-gray-200 rounded mx-auto" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
      className="px-4 py-16 sm:px-10 sm:py-24"
    >
      <div className="mx-auto max-w-7xl">
        <p className=" text-xs sm:text-base font-medium uppercase">
          Featured Products
        </p>
        <h2 className="mt-4 text-[22px] w-2xs sm:w-fit font-satoshi font-bold tracking-normal sm:text-4xl lg:text-5xl">
          Most Loved Products, and Newest Arrival
        </h2>

        <div
          ref={carouselRef}
          onScroll={handleScroll}
          className="-mx-6 mt-8 flex gap-5 overflow-x-auto px-6 pb-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] lg:mx-0 lg:px-0 lg:pb-0 lg:grid lg:grid-cols-2 lg:h-[859px] lg:overflow-visible"
        >
          <div className="w-[85vw] shrink-0 snap-center sm:w-[90vw] lg:w-auto lg:h-full">
            <FeaturedLargeCard label="New Arrival" slides={newArrivalSlides} />
          </div>

          {/* Mobile Carousel Items */}
          <div className="w-[85vw] shrink-0 snap-center sm:w-[90vw] lg:hidden">
            <FeaturedMiniCard label="Best Seller" slides={vapeBestSellers} />
          </div>
          <div className="w-[85vw] shrink-0 snap-center sm:w-[90vw] lg:hidden">
            <FeaturedMiniCard label="Best Seller" slides={gummiesBestSellers} />
          </div>

          {/* Desktop Grid Items */}
          <div className="hidden lg:grid grid-rows-2 gap-5 h-full">
            <FeaturedMiniCard label="Best Seller" slides={vapeBestSellers} />
            <FeaturedMiniCard label="Best Seller" slides={gummiesBestSellers} />
          </div>
        </div>

        {/* Mobile Carousel Dots */}
        <div className="lg:hidden mt-2 pb-2">
          <ClickableDots
            activeIndex={activeMobileSlide}
            count={3}
            onChange={scrollToSlide}
          />
        </div>
      </div>
    </motion.section>
  );
}

function FeaturedLargeCard({
  label,
  slides,
}: {
  label: string;
  slides: FeaturedSlide[];
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  const length = slides?.length || 0;

  const goToNext = useCallback(() => {
    if (length > 0) {
      setActiveIndex((current) => (current + 1) % length);
    }
  }, [length]);

  const goToPrevious = useCallback(() => {
    if (length > 0) {
      setActiveIndex((current) => (current - 1 + length) % length);
    }
  }, [length]);

  const goToIndex = (index: number) => setActiveIndex(index);

  useEffect(() => {
    if (length <= 1) return;
    const timer = setInterval(goToNext, 4000);
    return () => clearInterval(timer);
  }, [goToNext, length]);

  if (!slides || length === 0) return null;

  const activeSlide = slides[activeIndex];

  return (
    <Card className="gap-0 rounded-lg p-0 shadow-md h-full flex flex-col">
      <CardHeader
        className="p-3 sm:p-4 m-4 sm:m-6 mb-0 sm:mb-6 text-center"
        style={{
          background:
            "linear-gradient(90deg, #FFF 0%, rgba(210, 213, 219, 0.25) 50%, var(--Primary-2, #FFF) 100%)",
        }}
      >
        <CardTitle className="text-base sm:text-[24px]">{label}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-4 sm:p-6 sm:pt-6 flex-1 flex flex-col justify-between">
        <div>
          <ProductVisual
            image={activeSlide.image}
            imageAlt={activeSlide.title}
            onNext={goToNext}
            onPrevious={goToPrevious}
            size="large"
            showNavigation={slides.length > 1}
          />
          {slides.length > 1 && (
            <ClickableDots
              activeIndex={activeIndex}
              className="mt-5"
              count={slides.length}
              onChange={goToIndex}
            />
          )}
          <div className="sm:min-h-[220px]">
            <h3 className="mt-4 sm:mt-6 text-xl sm:text-[32px] font-satoshi font-bold leading-tight line-clamp-2">
              {activeSlide.title}
            </h3>
            <p className="mt-2 sm:mt-4 text-base sm:text-xl font-bold line-clamp-2">
              {activeSlide.subtitle}
            </p>
            <div
              className="mt-2 sm:mt-4 text-sm sm:text-base md:text-lg text-justify leading-5 line-clamp-4 [&_ol]:list-decimal [&_ol:has(li[data-list='bullet'])]:list-disc [&_ul]:list-disc [&_ol]:pl-5 [&_ul]:pl-5 [&_li]:my-1.5 [&_p]:mb-2 [&_.ql-ui]:hidden"
              dangerouslySetInnerHTML={{ __html: activeSlide.description }}
            />
          </div>
        </div>
          <Button
            asChild
            className="mt-6 rounded-lg md:py-6 bg-black px-8 text-white hover:bg-black/85 w-fit"
          >
            <Link href={activeSlide.slug ? `/shop/${activeSlide.slug}` : "/shop"}>Shop Now</Link>
          </Button>
      </CardContent>
    </Card>
  );
}

function FeaturedMiniCard({
  label,
  slides,
}: {
  label: string;
  slides: FeaturedSlide[];
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  const length = slides?.length || 0;

  const goToNext = useCallback(() => {
    if (length > 0) {
      setActiveIndex((current) => (current + 1) % length);
    }
  }, [length]);

  const goToPrevious = useCallback(() => {
    if (length > 0) {
      setActiveIndex((current) => (current - 1 + length) % length);
    }
  }, [length]);

  const goToIndex = (index: number) => setActiveIndex(index);

  useEffect(() => {
    if (length === 0) return;
    const timer = setInterval(goToNext, 4000);
    return () => clearInterval(timer);
  }, [goToNext, length]);

  if (!slides || length === 0) return null;

  const activeSlide = slides[activeIndex];

  return (
    <Card className="gap-0 rounded-lg p-0 shadow-md h-full flex flex-col">
      <CardHeader
        className="p-3 sm:p-4 m-4 sm:m-6 mb-0 sm:mb-6 text-center"
        style={{
          background:
            "linear-gradient(90deg, #FFF 0%, rgba(210, 213, 219, 0.25) 50%, var(--Primary-2, #FFF) 100%)",
        }}
      >
        <CardTitle className="text-base sm:text-[28px]">{label}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col sm:grid gap-0 sm:gap-6 p-4 pt-4 sm:p-6 sm:pt-6 sm:grid-cols-[1fr_160px] flex-1">
        <div className="flex flex-col justify-between h-full flex-1 order-2 sm:order-1">
          <div className="sm:min-h-[180px]">
            <h3 className="mt-4 sm:mt-0 text-xl sm:text-[32px] font-satoshi font-bold leading-tight line-clamp-2">
              {activeSlide.title}
            </h3>
            <p className="mt-2 sm:mt-4 text-base font-bold line-clamp-2">
              {activeSlide.subtitle}
            </p>
            <div
              className="mt-2 sm:mt-4 text-sm md:text-base leading-5 line-clamp-4 [&_ol]:list-decimal [&_ol:has(li[data-list='bullet'])]:list-disc [&_ul]:list-disc [&_ol]:pl-5 [&_ul]:pl-5 [&_li]:my-1.5 [&_p]:mb-2 [&_.ql-ui]:hidden"
              dangerouslySetInnerHTML={{ __html: activeSlide.description }}
            />
          </div>
          <Button
            asChild
            className="mt-6 rounded-lg text-xs sm:text-base md:py-6 bg-black px-8 text-white hover:bg-black/85 w-fit"
          >
            <Link href={activeSlide.slug ? `/shop/${activeSlide.slug}` : "/shop"}>Shop Now</Link>
          </Button>
        </div>
        <div className="order-1 sm:order-2">
          <ProductVisual
            image={activeSlide.image}
            imageAlt={activeSlide.title}
            onNext={goToNext}
            onPrevious={goToPrevious}
            size="mini"
          />
          <ClickableDots
            activeIndex={activeIndex}
            className="mt-5"
            count={slides.length}
            onChange={goToIndex}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function ProductVisual({
  image,
  imageAlt,
  onNext,
  onPrevious,
  size,
  showNavigation = true,
}: {
  image: StaticImageData | string;
  imageAlt: string;
  onNext: () => void;
  onPrevious: () => void;
  size: "large" | "mini";
  showNavigation?: boolean;
}) {
  const isLarge = size === "large";

  return (
    <div
      className={`group relative mx-auto overflow-hidden rounded-lg ${
        isLarge
          ? "h-[260px] sm:h-[350px] lg:h-[400px] w-full max-w-[480px]"
          : "h-[260px] sm:h-[180px] w-full max-w-[480px] sm:max-w-40"
      }`}
    >
      <div className="absolute inset-0 rounded-lg bg-[#f7f7f7]/35 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <Image
        alt={imageAlt}
        className="object-contain transition-transform duration-300 ease-out group-hover:scale-110"
        fill
        priority={isLarge}
        sizes={isLarge ? "(min-width: 1024px) 422px, 100vw" : "160px"}
        src={image}
      />
      {showNavigation && (
        <>
          <Button
            aria-label={`Show previous ${imageAlt}`}
            className={`absolute left-0 top-1/2 inline-flex -translate-x-2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/85 text-white opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 ${
              isLarge ? "size-10" : "size-8"
            }`}
            onClick={onPrevious}
            type="button"
          >
            <ChevronLeft className={isLarge ? "size-4" : "size-3"} />
          </Button>
          <Button
            aria-label={`Show next ${imageAlt}`}
            className={`absolute right-0 top-1/2 inline-flex translate-x-2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/85 text-white opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 ${
              isLarge ? "size-10" : "size-8"
            }`}
            onClick={onNext}
            type="button"
          >
            <ChevronRight className={isLarge ? "size-4" : "size-3"} />
          </Button>
        </>
      )}
    </div>
  );
}

function ClickableDots({
  activeIndex,
  className = "",
  count,
  onChange,
}: {
  activeIndex: number;
  className?: string;
  count: number;
  onChange: (index: number) => void;
}) {
  return (
    <div className={`flex justify-center gap-2 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <button
          aria-label={`Go to slide ${index + 1}`}
          className={`size-2 shrink-0 cursor-pointer rounded-full p-0 transition-colors ${
            index === activeIndex
              ? "bg-black/85"
              : "bg-[#d2d5db] hover:bg-black/45"
          }`}
          key={index}
          onClick={() => onChange(index)}
          type="button"
        />
      ))}
    </div>
  );
}
