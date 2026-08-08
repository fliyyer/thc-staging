"use client";

import Image, { type StaticImageData } from "next/image";
import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "@/context/cart-context";

import productImage from "@/assets/produk.png";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { fetchProducts, getProductImageUrl } from "@/lib/api/products-api";

interface DisplayProduct {
  label: string;
  name: string;
  price: string;
  image: string | StaticImageData;
  rawProduct?: any;
}

const heroProducts: DisplayProduct[] = [
  {
    label: "New Arrival",
    name: "Alien OG V3 Live Resin Vape",
    price: "£89.00",
    image: productImage,
  },
  {
    label: "Best Seller",
    name: "V 2.0 420 Vape",
    price: "£69.00",
    image: productImage,
  },
  {
    label: "Popular",
    name: "420 Gummies",
    price: "£45.00",
    image: productImage,
  },
];

export function HeroProductSlider() {
  const { addToCart, showToast } = useCart();
  const [products, setProducts] = useState<DisplayProduct[]>(heroProducts);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<"left" | "right" | null>(null);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetchProducts({ limit: 3 });
        if (response.data && response.data.length > 0) {
          const mapped = response.data.map((prod): DisplayProduct => {
            // Map collectionType to readable label
            let label = "New Arrival";
            if (prod.collectionTypes && prod.collectionTypes.length > 0) {
              const primaryCollection = prod.collectionTypes[0];
              if (primaryCollection === "NEW_ARRIVAL") label = "New Arrival";
              else if (primaryCollection === "BEST_SELLER") label = "Best Seller";
              else if (primaryCollection === "FOUR_TWENTY" || primaryCollection === "420") label = "420 Vape";
              else if (primaryCollection === "MUSHROOMS") label = "Mushrooms";
            }

            // Format price
            let formattedPrice = `£${prod.price.toFixed(2)}`;

            if (prod.packSizes) {
              try {
                const parsed = typeof prod.packSizes === "string" ? JSON.parse(prod.packSizes) : prod.packSizes;
                if (Array.isArray(parsed) && parsed.length > 0) {
                  const prices = parsed.map((p: any) => Number(p.price) || 0);
                  const minPrice = Math.min(...prices);
                  const maxPrice = Math.max(...prices);
                  formattedPrice = minPrice === maxPrice 
                    ? `£${minPrice.toFixed(2)}` 
                    : `£${minPrice.toFixed(2)} - £${maxPrice.toFixed(2)}`;
                }
              } catch (e) {
                // Ignore parse errors
              }
            }
            // Resolve image URL
            const imgUrl = getProductImageUrl(prod.imageUrl) || productImage;

            return {
              label,
              name: prod.title,
              price: formattedPrice,
              image: imgUrl,
              rawProduct: prod,
            };
          });
          setProducts(mapped);
        }
      } catch (err) {
        console.error("Error fetching hero products:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);
  const handleAddToCart = () => {
    if (product.rawProduct) {
      addToCart(product.rawProduct, 1);
      showToast(`${product.name} added to cart!`);
    } else {
      showToast("Cannot add mock product to cart.");
    }
  };
  const navigate = (dir: "prev" | "next") => {
    if (animating) return;
    setAnimating(true);
    setDirection(dir === "next" ? "left" : "right");

    setTimeout(() => {
      setCurrent((prev) =>
        dir === "next"
          ? (prev + 1) % products.length
          : (prev - 1 + products.length) % products.length,
      );
      setDirection(null);
      setAnimating(false);
    }, 300);
  };

  if (loading) {
    return (
      <div className="relative w-full pb-14 lg:pb-0">
        <Card className="w-full rounded-[5px] border-white/70 bg-black/20 p-2 sm:p-4 lg:p-5 text-black shadow-none backdrop-blur-xs">
          <CardContent
            className="overflow-hidden rounded-lg bg-white p-3 sm:p-5 lg:p-6 min-h-[240px] sm:min-h-[290px] lg:min-h-[320px] flex flex-col justify-between animate-pulse"
          >
            <div>
              {/* Label shimmer */}
              <div className="h-6 sm:h-8 w-2/3 bg-gray-200 mx-auto rounded-md mb-4 sm:mb-6" />

              {/* Image shimmer */}
              <div className="mx-auto mt-3 sm:mt-4 lg:mt-6 h-24 w-24 sm:h-40 sm:w-40 lg:h-52 lg:w-52 bg-gray-200 rounded-lg mb-4 sm:mb-6" />

              {/* Title shimmer */}
              <div className="mt-3 sm:mt-4 lg:mt-6 h-8 sm:h-10 lg:h-12 flex flex-col gap-1 sm:gap-1.5 justify-center">
                <div className="h-3 sm:h-4 w-5/6 bg-gray-200 mx-auto rounded-md" />
                <div className="h-3 sm:h-4 w-1/2 bg-gray-200 mx-auto rounded-md" />
              </div>
            </div>

            {/* Button shimmer */}
            <div className="h-8 sm:h-10 w-full bg-gray-200 rounded-lg mt-4" />
          </CardContent>
        </Card>

        {/* Controls skeleton */}
        <div className="absolute bottom-2 right-0 lg:absolute lg:bottom-0 lg:right-100 flex gap-4 lg:gap-6">
          <div className="size-8 sm:size-10 bg-white/10 border border-white/40 rounded-[5px] animate-pulse" />
          <div className="size-8 sm:size-10 bg-white/10 border border-white/40 rounded-[5px] animate-pulse" />
        </div>
      </div>
    );
  }

  const product = products[current];

  return (
    <div className="relative w-full pb-14 lg:pb-0">
      <Card className="w-full rounded-[5px] border-white/70 bg-black/20 p-2 sm:p-4 lg:p-5 text-black shadow-none backdrop-blur-xs">
        <CardContent
          className="overflow-hidden rounded-lg bg-white p-3 sm:p-5 lg:p-6 min-h-[240px] sm:min-h-[290px] lg:min-h-[320px] flex flex-col justify-between"
        >
          <div
            key={current}
            className={`transition-all duration-300 ${
              animating
                ? direction === "left"
                  ? "translate-x-4 opacity-0"
                  : "-translate-x-4 opacity-0"
                : "translate-x-0 opacity-100"
            }`}
          >
            <div
              className="py-1.5 sm:py-2.5 lg:py-5 text-center text-xs sm:text-base lg:text-lg font-bold"
              style={{
                background:
                  "linear-gradient(90deg, #FFF 0%, rgba(210, 213, 219, 0.50) 50%, var(--Primary-2, #FFF) 100%)",
              }}
            >
              {product.label}
            </div>

            <div className="relative mx-auto mt-3 sm:mt-4 lg:mt-6 h-24 w-24 sm:h-40 sm:w-40 lg:h-52 lg:w-52">
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(min-width: 1024px) 208px, (min-width: 640px) 160px, 96px"
                className="object-contain"
                priority
              />
            </div>

            <h2 className="mt-3 sm:mt-4 lg:mt-6 h-8 sm:h-10 lg:h-12 text-xs sm:text-sm lg:text-base font-bold line-clamp-2">
              {product.name}
            </h2>
            <p className="mt-1 sm:mt-2 lg:mt-3 text-xs sm:text-sm">
              {product.price}
            </p>

            <Button 
              onClick={handleAddToCart}
              className="mt-3 sm:mt-4 h-8 sm:h-10 w-full rounded-lg bg-black text-white hover:bg-black/85 text-[10px] sm:text-sm gap-1.5 px-2"
            >
              Add to Cart
              <ShoppingCart className="size-3.5 sm:size-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Controls */}
      <div className="absolute bottom-2 right-0 lg:absolute lg:bottom-0 lg:right-100 flex gap-4 lg:gap-6">
        <Button
          onClick={() => navigate("prev")}
          aria-label="Previous product"
          className="flex size-8 sm:size-10 items-center justify-center border border-white/60 bg-white/10 text-white transition hover:bg-white/20"
        >
          <ChevronLeft className="size-4 sm:size-5" />
        </Button>

        <Button
          onClick={() => navigate("next")}
          aria-label="Next product"
          className="flex size-8 sm:size-10 items-center justify-center border border-white/60 bg-white/10 text-white transition hover:bg-white/20"
        >
          <ChevronRight className="size-4 sm:size-5" />
        </Button>
      </div>
    </div>
  );
}

