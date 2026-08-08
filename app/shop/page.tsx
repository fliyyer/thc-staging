/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Heart,
  Package,
  Search,
  ShoppingCart,
  SlidersHorizontal,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import heroImage from "@/assets/shop/hero.png";
import leaf1Icon from "@/assets/icons/leaf-1.svg";
import leaf2Icon from "@/assets/icons/leaf-2.svg";
import { SiteFooter } from "@/components/home/footer";
import { SiteNavbar } from "@/components/home/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import MarqueeStrip from "@/components/marquee-strip";
import { FreeShippingBar } from "@/components/free-shipping-bar";
import { getProductImageUrl, type ApiProduct } from "@/lib/api/products-api";
import { useProducts } from "@/hooks/use-products";
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/hooks/use-wishlist";

const collectionFilters = [
  "All Products",
  "New Arrival",
  "Best Seller",
  "420",
  "Mushrooms",
];

const productTypeFilters = [
  "V2 Vape",
  "V3 Live Resin Vape",
  "Gummies",
  "Capsule",
  "Chocolate",
];

const collectionMap: Record<string, string | undefined> = {
  "All Products": undefined,
  "New Arrival": "NEW_ARRIVAL",
  "Best Seller": "BEST_SELLER",
  "420": "FOUR_TWENTY",
  Mushrooms: "MUSHROOMS",
};

const productTypeMap: Record<string, string | undefined> = {
  "V2 Vape": "V2_VAPE",
  "V3 Live Resin Vape": "V3_LIVE_RESIN_VAPE",
  Gummies: "GUMMIES",
  Capsule: "CAPSULE",
  Chocolate: "CHOCOLATE",
};

export default function ShopPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <ShopHero />
      <MarqueeStrip />
      <Suspense
        fallback={
          <div className="py-20 text-center text-gray-500 animate-pulse">
            Loading Collection...
          </div>
        }
      >
        <ProductsSection />
      </Suspense>
      <SiteFooter />
    </main>
  );
}

function ShopHero() {
  return (
    <section className="relative min-h-[460px] sm:min-h-225 overflow-hidden bg-black text-white">
      <Image
        src={heroImage}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/55" />

      <div className="relative z-10 flex min-h-[600px] sm:min-h-225 flex-col">
        <FreeShippingBar />

        <SiteNavbar activeItem="Shop" />

        <div className="mx-auto flex w-full max-w-360 flex-1 items-end justify-between gap-10 px-6 pb-12 sm:pb-16 sm:px-10 lg:pb-20 2xl:px-0">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="max-w-2xl"
          >
            <h1 className="text-[28px] sm:text-6xl lg:text-[64px] font-satoshi font-bold">
              Curated Collection
            </h1>
            <p className="max-w-xl text-sm sm:text-lg lg:text-xl  font-medium mt-3 sm:mt-4">
              Explore premium products inspired by modern plant culture, refined
              routines, and everyday experiences.
            </p>

            {/* Mobile-only Icons */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
              className="flex items-center gap-4 mt-6 lg:hidden"
            >
              <div
                aria-label="Plant intelligence"
                className="size-11 rounded-lg flex items-center justify-center bg-white text-black"
              >
                <Image src={leaf1Icon} alt="leaf" width={24} height={24} />
              </div>
              <div
                aria-label="Ceremonial mushrooms"
                className="size-11 rounded-lg flex items-center justify-center bg-white text-black"
              >
                <Image src={leaf2Icon} alt="mushroom" width={24} height={24} />
              </div>
            </motion.div>
          </motion.div>

          {/* Desktop-only Icons */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
            className="hidden items-center gap-6 lg:flex"
          >
            <div
              aria-label="Plant intelligence"
              className="size-18 rounded-lg flex items-center justify-center bg-white text-black "
            >
              <Image src={leaf1Icon} alt="leaf" width={50} height={50} />
            </div>
            <div
              aria-label="Ceremonial mushrooms"
              className="size-18 rounded-lg flex items-center justify-center bg-white text-black"
            >
              <Image src={leaf2Icon} alt="mushroom" width={50} height={50} />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ProductsSection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Derived state from URL search params
  const currentCollection = searchParams.get("collection") || "All Products";
  const currentType = searchParams.get("type") || "";
  const currentPage = Number(searchParams.get("page")) || 1;
  const urlSearch = searchParams.get("search") || "";

  // Local state only for the search input text (to handle keystrokes smoothly)
  const [searchInput, setSearchInput] = useState(urlSearch);

  // Helper to push query updates to router without scrolling to top
  const updateQuery = (
    updates: Record<string, string | number | undefined>,
  ) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === "") {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Debounced search sync to URL
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== urlSearch) {
        updateQuery({ search: searchInput || undefined, page: 1 });
      }
    }, 450);
    return () => clearTimeout(timer);
  }, [searchInput, urlSearch]);

  // Keep input field value in sync if URL parameter is updated externally (e.g. navigation)
  useEffect(() => {
    setSearchInput(urlSearch);
  }, [urlSearch]);

  const mappedCollection = collectionMap[currentCollection];
  const mappedType = currentType ? productTypeMap[currentType] : undefined;

  // Reactively fetch products via TanStack Query
  const { data: res, isLoading } = useProducts({
    page: currentPage,
    limit: 6,
    search: urlSearch || undefined,
    collection: mappedCollection,
    type: mappedType,
  });

  const productsList = res?.data || [];
  const total = res?.meta.totalItems || 0;
  const totalPages = res?.meta.totalPages || 1;

  return (
    <section className="px-6 py-16 sm:py-28 2xl:px-0">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[300px_1fr]">
          <FilterSidebar
            selectedCollection={currentCollection}
            setSelectedCollection={(val) =>
              updateQuery({
                collection: val === "All Products" ? undefined : val,
                page: 1,
              })
            }
            selectedType={currentType}
            setSelectedType={(val) =>
              updateQuery({ type: val || undefined, page: 1 })
            }
          />

          <div>
            {/* Mobile-only Filter Header */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:hidden mb-8"
            >
              <h2 className="text-[22px] font-satoshi font-bold text-center">
                Filter Options
              </h2>

              <div className="mt-6 grid grid-cols-2 gap-4">
                {/* Collections Dropdown */}
                <div>
                  <div className="flex items-center gap-1.5 mb-2 text-base font-semibold text-black/70">
                    <SlidersHorizontal className="size-3.5" />
                    <span>Collections</span>
                  </div>
                  <div className="relative">
                    <select
                      value={currentCollection}
                      onChange={(e) => {
                        updateQuery({
                          collection:
                            e.target.value === "All Products"
                              ? undefined
                              : e.target.value,
                          page: 1,
                        });
                      }}
                      className={`w-full h-11 pl-3 pr-8 rounded-[10px] text-sm font-medium outline-none appearance-none cursor-pointer ${
                        currentCollection !== "All Products"
                          ? "bg-black text-white border-transparent"
                          : "bg-white text-black border border-[#d6dbe1]"
                      }`}
                    >
                      {collectionFilters.map((f) => (
                        <option
                          key={f}
                          value={f}
                          className="text-black bg-white"
                        >
                          {f}
                        </option>
                      ))}
                    </select>
                    <div
                      className={`absolute inset-y-0 right-3 flex items-center pointer-events-none ${
                        currentCollection !== "All Products"
                          ? "text-white"
                          : "text-black"
                      }`}
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Product Type Dropdown */}
                <div>
                  <div className="flex items-center gap-1.5 mb-2 text-base font-semibold text-black/70">
                    <Package className="size-3.5" />
                    <span>Product Type</span>
                  </div>
                  <div className="relative">
                    <select
                      value={currentType}
                      onChange={(e) => {
                        updateQuery({
                          type: e.target.value || undefined,
                          page: 1,
                        });
                      }}
                      className={`w-full h-11 pl-3 pr-8 rounded-[10px] text-sm font-medium outline-none appearance-none cursor-pointer ${
                        currentType
                          ? "bg-black text-white border-transparent"
                          : "bg-white text-black border border-[#d6dbe1]"
                      }`}
                    >
                      <option value="" className="text-black bg-white">
                        All Types
                      </option>
                      {productTypeFilters.map((f) => (
                        <option
                          key={f}
                          value={f}
                          className="text-black bg-white"
                        >
                          {f}
                        </option>
                      ))}
                    </select>
                    <div
                      className={`absolute inset-y-0 right-3 flex items-center pointer-events-none ${
                        currentType ? "text-white" : "text-black"
                      }`}
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col gap-5 sm:flex-row sm:items-center justify-end"
            >
              <p className="text-sm sm:text-base font-medium">
                {isLoading
                  ? "Showing..."
                  : `Showing ${productsList.length} of ${total} products`}
              </p>
              <div className="relative w-full sm:max-w-80">
                <Input
                  className="h-12 border-black/70 pr-11 rounded-[10px] text-sm placeholder:text-black/60"
                  placeholder="Search"
                  type="search"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
                <Search className="absolute right-4 top-1/2 size-4 -translate-y-1/2 text-black/60" />
              </div>
            </motion.div>

            <motion.div
              layout
              initial="hidden"
              animate="show"
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: { staggerChildren: 0.1 },
                },
              }}
              className="mt-8 sm:mt-10 grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-2 xl:grid-cols-3"
            >
              <AnimatePresence mode="popLayout">
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <motion.div
                      key={`skeleton-${i}`}
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        show: { opacity: 1, y: 0 },
                      }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ProductCardSkeleton />
                    </motion.div>
                  ))
                ) : productsList.length > 0 ? (
                  productsList.map((product) => (
                    <motion.div
                      key={product.id}
                      layout
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        show: { opacity: 1, y: 0 },
                      }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      whileHover={{
                        y: -6,
                        transition: { duration: 0.2, ease: "easeInOut" },
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="col-span-full py-20 text-center text-gray-500"
                  >
                    No products found. Try adjusting your filters.
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <ShopPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => updateQuery({ page })}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FilterSidebar({
  selectedCollection,
  setSelectedCollection,
  selectedType,
  setSelectedType,
}: {
  selectedCollection: string;
  setSelectedCollection: (val: string) => void;
  selectedType: string;
  setSelectedType: (val: string) => void;
}) {
  return (
    <motion.aside
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0, x: -20 },
        visible: {
          opacity: 1,
          x: 0,
          transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.1 },
        },
      }}
      className="hidden lg:block"
    >
      <motion.h2 
        variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
        className="text-5xl text-nowrap font-satoshi font-bold"
      >
        Filter Options
      </motion.h2>

      <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="mt-8">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="size-5" />
          <h3 className="text-base font-bold">Collections</h3>
        </div>
        <div className="mt-4 grid gap-4">
          {collectionFilters.map((filter) => (
            <Button
              className={`h-13 justify-start rounded-lg px-6 text-base font-normal hover:bg-black hover:text-white ${
                selectedCollection === filter
                  ? "bg-black text-white hover:bg-black/90"
                  : ""
              }`}
              key={filter}
              variant={selectedCollection === filter ? "default" : "outline"}
              onClick={() => setSelectedCollection(filter)}
            >
              {filter}
            </Button>
          ))}
        </div>
      </motion.div>

      <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="mt-12">
        <div className="flex items-center gap-2">
          <Package className="size-5" />
          <h3 className="text-base font-bold">Product Type</h3>
        </div>
        <div className="mt-4 grid gap-4">
          <Button
            className={`h-13 hover:bg-black hover:text-white justify-start rounded-lg px-6 text-base font-normal ${
              selectedType === "" ? "bg-black text-white hover:bg-black/90" : ""
            }`}
            variant={selectedType === "" ? "default" : "outline"}
            onClick={() => setSelectedType("")}
          >
            All Types
          </Button>
          {productTypeFilters.map((filter) => (
            <Button
              className={`h-13 hover:bg-black hover:text-white justify-start rounded-lg px-6 text-base font-normal ${
                selectedType === filter
                  ? "bg-black text-white hover:bg-black/90"
                  : ""
              }`}
              key={filter}
              variant={selectedType === filter ? "default" : "outline"}
              onClick={() => setSelectedType(filter)}
            >
              {filter}
            </Button>
          ))}
        </div>
      </motion.div>
    </motion.aside>
  );
}

function ProductCard({ product }: { product: ApiProduct }) {
  const { addToCart, showToast } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();
  const isFavorited = wishlist.some((item) => item.id === product.id);

  const handleWishlistClick = () => {
    const token = localStorage.getItem("accessToken");
    if (!token || token === "undefined" || token === "null") {
      showToast("Please sign in to add items to your wishlist.");
      return;
    }
    toggleWishlist(product.id);
  };

  const productHref = `/shop/${product.slug}`;
  const displayImage = product.imageUrl
    ? getProductImageUrl(product.imageUrl)
    : product.imageUrls && product.imageUrls.length > 0
      ? getProductImageUrl(product.imageUrls[0])
      : "";

  let displayPrice = typeof product.price === "number"
    ? `£${product.price.toFixed(2)}`
    : product.price;

  if (product.packSizes) {
    try {
      const parsed = typeof product.packSizes === "string" ? JSON.parse(product.packSizes) : product.packSizes;
      if (Array.isArray(parsed) && parsed.length > 0) {
        const prices = parsed.map((p: any) => Number(p.price) || 0);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        displayPrice = minPrice === maxPrice 
          ? `£${minPrice.toFixed(2)}` 
          : `£${minPrice.toFixed(2)} - £${maxPrice.toFixed(2)}`;
      }
    } catch (e) {
      // Ignore parse errors
    }
  }

  const isBestSeller = product.collectionTypes && product.collectionTypes.includes("BEST_SELLER");
  const isNewArrival = product.collectionTypes && product.collectionTypes.includes("NEW_ARRIVAL");

  return (
    <Card
      className="relative gap-0 rounded-[10px] border-0 bg-white p-0 h-full flex flex-col"
      style={{
        boxShadow: "0 0 7px 0 rgba(0, 0, 0, 0.25)",
      }}
    >
      <CardContent className="p-3 sm:p-6 flex flex-col flex-1 justify-between">
        <div className="flex flex-col flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              {isBestSeller ? (
                <Badge
                  className="rounded-[5px] px-2 py-1 text-[10px] sm:px-3 sm:py-2 sm:text-xs"
                  style={{
                    border: "1px solid #D2D5DB",
                    color: "#000",
                    background:
                      "linear-gradient(110deg, #FFF 3.18%, rgba(218, 219, 210, 0.5) 49.8%, #FFF 96.43%)",
                  }}
                >
                  Best Seller
                </Badge>
              ) : isNewArrival ? (
                <Badge
                  className="rounded-[5px] border border-[#FF0000] px-2 py-1.5 text-[9px] sm:text-xs sm:px-3 sm:py-2 text-white hover:opacity-90"
                  style={{
                    background:
                      "linear-gradient(110deg, #FFC107 3.18%, #FF6104 26.49%, #FF3002 49.8%, #FF6104 73.12%, #FFC107 96.43%)",
                  }}
                >
                  New
                </Badge>
              ) : (
                <div />
              )}
            </div>
            <Button
              aria-label={`Add ${product.title} to favorites`}
              className="size-7 sm:size-9 rounded-[5px] sm:rounded-lg bg-black p-0 text-white hover:bg-black/80"
              size="icon"
              type="button"
              onClick={handleWishlistClick}
            >
              <Heart
                className={`size-3.5 sm:size-4 ${isFavorited ? "fill-white" : ""}`}
              />
            </Button>
          </div>

          <Link
            aria-label={`View details for ${product.title}`}
            className="group mt-4 sm:mt-8 block overflow-hidden rounded-lg relative h-28 sm:h-44 w-full"
            href={productHref}
          >
            {displayImage ? (
              <Image
                src={displayImage}
                alt={product.title}
                fill
                sizes="(min-width: 640px) 224px, 112px"
                className="object-contain transition-transform duration-300 ease-out group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-lg">
                <Package className="size-12 text-gray-400" />
              </div>
            )}
          </Link>

          <h3 className="mt-4 sm:mt-8 min-h-[36px] sm:min-h-10 text-sm sm:text-lg font-bold leading-tight sm:leading-5 line-clamp-2">
            <Link className="hover:underline" href={productHref}>
              {product.title}
            </Link>
          </h3>
          <p className="mt-1.5 sm:mt-3 text-xs sm:text-base mb-3">
            {displayPrice}
          </p>
        </div>
        <Button
          onClick={() => {
            addToCart(product, 1);
            showToast(`${product.title} added to cart!`);
          }}
          className="mt-auto h-8 sm:h-10 w-full rounded-[5px] bg-black text-white hover:bg-black/85 text-xs sm:text-base py-1 gap-1"
        >
          Add to Cart
          <ShoppingCart className="size-3 sm:size-4" />
        </Button>
      </CardContent>
    </Card>
  );
}

function ProductCardSkeleton() {
  return (
    <Card
      className="relative gap-0 rounded-[10px] border-0 bg-white p-0 h-full flex flex-col animate-pulse"
      style={{
        boxShadow: "0 0 7px 0 rgba(0, 0, 0, 0.25)",
      }}
    >
      <CardContent className="p-3 sm:p-6 flex flex-col flex-1 animate-pulse">
        <div className="flex items-start justify-between">
          <div className="h-6 w-12 bg-gray-200 rounded" />
          <div className="size-7 sm:size-9 rounded-[5px] sm:rounded-lg bg-gray-200" />
        </div>
        <div className="mt-4 sm:mt-8 h-28 sm:h-44 w-full bg-gray-200 rounded-lg animate-pulse" />
        <div className="mt-4 sm:mt-8 h-5 w-3/4 bg-gray-200 rounded" />
        <div className="mt-1.5 sm:mt-3 h-4 w-1/4 bg-gray-200 rounded mb-3" />
        <div className="mt-auto h-8 sm:h-10 w-full bg-gray-200 rounded-[5px]" />
      </CardContent>
    </Card>
  );
}

function ShopPagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  return (
    <Pagination className="mt-20">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            className={
              currentPage === 1
                ? "pointer-events-none opacity-40 cursor-not-allowed"
                : "cursor-pointer"
            }
            onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
          />
        </PaginationItem>
        {Array.from({ length: totalPages }).map((_, index) => {
          const pageNum = index + 1;
          return (
            <PaginationItem key={pageNum}>
              <PaginationLink
                className={`cursor-pointer ${
                  pageNum === currentPage
                    ? "bg-black text-white text-xs sm:text-base hover:bg-black/90"
                    : ""
                }`}
                isActive={pageNum === currentPage}
                onClick={() => onPageChange(pageNum)}
              >
                {pageNum}
              </PaginationLink>
            </PaginationItem>
          );
        })}
        <PaginationItem>
          <PaginationNext
            className={
              currentPage === totalPages
                ? "pointer-events-none opacity-40 cursor-not-allowed"
                : "cursor-pointer"
            }
            onClick={() =>
              currentPage < totalPages && onPageChange(currentPage + 1)
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
