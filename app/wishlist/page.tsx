"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Share, ShoppingCart, Package } from "lucide-react";

import leaf1Icon from "@/assets/icons/leaf-1.svg";
import leaf2Icon from "@/assets/icons/leaf-2.svg";
import wishlistHeroImage from "@/assets/hero-wishlist.webp";
import { SiteFooter } from "@/components/home/footer";
import { SiteNavbar } from "@/components/home/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import MarqueeStrip from "@/components/marquee-strip";
import { FreeShippingBar } from "@/components/free-shipping-bar";
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/hooks/use-wishlist";
import { getProductImageUrl, type ApiProduct } from "@/lib/api/products-api";

export default function WishlistPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <WishlistHero />
      <MarqueeStrip />
      <WishlistProducts />
      <SiteFooter />
    </main>
  );
}

function WishlistHero() {
  return (
    <section className="relative min-h-[460px] sm:min-h-225 overflow-hidden bg-black text-white">
      <Image
        src={wishlistHeroImage}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-black/35" />

      <div className="relative z-10 flex min-h-[600px] sm:min-h-225 flex-col">
        <FreeShippingBar />
        <SiteNavbar activeUtility="wishlist" />

        <div className="mx-auto flex w-full max-w-360 flex-1 items-end justify-between gap-10 px-6 pb-12 sm:pb-16 sm:px-10 lg:pb-20 2xl:px-0">
          <div className="max-w-2xl">
            <h1 className="text-[28px] sm:text-5xl lg:text-[64px] font-satoshi font-bold leading-tight tracking-normal">
              Saved For Later
            </h1>
            <p className="max-w-xl text-sm sm:text-lg lg:text-xl font-medium mt-3 sm:mt-4">
              Products you&apos;ve saved for future routines, sessions, and
              moments.
            </p>

            {/* Mobile-only Icons */}
            <div className="flex items-center gap-4 mt-6 lg:hidden">
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
            </div>
          </div>

          {/* Desktop-only Icons */}
          <div className="hidden items-center gap-6 lg:flex">
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
          </div>
        </div>
      </div>
    </section>
  );
}

function WishlistProducts() {
  const { wishlist, clearWishlist, isLoading } = useWishlist();
  const { showToast } = useCart();

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "My True High Collabs Wishlist",
          text: "Check out these products I saved!",
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        showToast("Wishlist link copied to clipboard!");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="py-24 text-center text-gray-500 animate-pulse font-medium">
        Loading saved items...
      </div>
    );
  }

  const count = wishlist.length;

  return (
    <section className="px-4 py-16 sm:px-10 lg:py-36 2xl:px-0">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm sm:text-lg font-medium">
            Showing {count} of {count} products
          </p>
          <div className="flex items-center gap-2 sm:gap-4">
            <Button
              onClick={handleShare}
              className="h-9 sm:h-11 text-xs sm:text-base rounded-lg px-3 sm:px-6 hover:bg-black hover:text-white gap-2"
              variant="outline"
            >
              Share
              <Share className="size-3.5 sm:size-4" />
            </Button>
            {count > 0 && (
              <Button
                onClick={clearWishlist}
                className="h-9 sm:h-11 text-xs sm:text-base rounded-lg bg-black px-3 sm:px-6 text-white hover:bg-black/80"
              >
                Clear All
              </Button>
            )}
          </div>
        </div>

        {count === 0 ? (
          <div className="mt-12 text-center text-gray-500 border border-dashed rounded-lg py-20 px-6 max-w-md mx-auto shadow-sm">
            <Heart className="size-12 mx-auto text-gray-300" />
            <p className="text-lg font-semibold mt-4 text-black">
              Your wishlist is empty
            </p>
            <p className="text-sm mt-2 text-gray-500">
              Explore products in our shop and save them for later.
            </p>
            <Button
              asChild
              className="mt-6 bg-black text-white hover:bg-black/85"
            >
              <Link href="/shop">Go to Shop</Link>
            </Button>
          </div>
        ) : (
          <div className="mt-8 sm:mt-10 grid grid-cols-2 gap-4 sm:gap-6 xl:grid-cols-4">
            {wishlist.map((product) => (
              <WishlistCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function WishlistCard({ product }: { product: ApiProduct }) {
  const { toggleWishlist } = useWishlist();
  const { addToCart, showToast } = useCart();

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

  const handleAddToCart = () => {
    addToCart(product, 1);
    showToast("Added to Cart!");
  };

  const isBestSeller = product.collectionTypes && product.collectionTypes.includes("BEST_SELLER");
  const isNewArrival = product.collectionTypes && product.collectionTypes.includes("NEW_ARRIVAL");

  return (
    <Card className="relative h-full flex flex-col gap-0 rounded-[5px] border-0 bg-white p-0 shadow-[0_0_10px_0_rgba(0,0,0,0.25)]">
      <CardContent className="p-3 sm:p-6 flex flex-col flex-1 justify-between">
        <div className="flex flex-col flex-1">
          <div className="flex items-start justify-between">
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
              aria-label={`Remove ${product.title} from wishlist`}
              className="size-7 sm:size-9 rounded-lg bg-black p-0 text-white hover:bg-black/80"
              size="icon"
              type="button"
              onClick={() => toggleWishlist(product.id)}
            >
              <Heart className="size-3.5 sm:size-4 fill-white" />
            </Button>
          </div>

          <Link
            aria-label={`View details for ${product.title}`}
            className="group mt-4 sm:mt-8 block relative h-28 sm:h-44 w-full overflow-hidden rounded-lg"
            href={productHref}
          >
            {displayImage ? (
              <Image
                src={displayImage}
                alt={product.title}
                fill
                className="object-contain mx-auto transition-transform duration-300 ease-out group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-300">
                <Package className="size-8" />
              </div>
            )}
          </Link>

          <h2 className="mt-4 sm:mt-8 min-h-8 sm:min-h-10 text-sm sm:text-lg font-bold leading-tight flex items-start">
            <Link
              className="transition-opacity hover:opacity-65"
              href={productHref}
            >
              {product.title}
            </Link>
          </h2>
          <p className="mt-1 sm:mt-3 text-xs sm:text-sm font-medium">
            {displayPrice}
          </p>
        </div>
        <Button
          onClick={handleAddToCart}
          className="mt-3 sm:mt-4 h-9 sm:h-10 w-full rounded-md bg-black text-xs sm:text-sm text-white hover:bg-black/85 flex items-center justify-center gap-2"
        >
          Add to Cart
          <ShoppingCart className="size-3.5 sm:size-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
