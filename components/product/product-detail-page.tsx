"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Home,
  LockKeyhole,
  Minus,
  PackageCheck,
  Plus,
  ShoppingCart,
  Truck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import masterCardImage from "@/assets/master-card.png";
import visaImage from "@/assets/visa.png";
import { SiteFooter } from "@/components/home/footer";
import { SiteNavbar } from "@/components/home/navbar";
import { FreeShippingBar } from "@/components/free-shipping-bar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getProductImageUrl, type ApiProduct } from "@/lib/api/products-api";
import { useCart } from "@/context/cart-context";
import { useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ProductDetailTab = string;

export function ProductDetailPage({ product }: { product: ApiProduct }) {
  const [activeTab, setActiveTab] = useState<ProductDetailTab>("description");

  return (
    <main className="min-h-screen bg-white text-black">
      <FreeShippingBar />
      <div className="text-black [&_header]:text-black [&_header_button]:text-black [&_header_button]:hover:bg-black [&_header_button]:hover:text-white [&_header_a]:text-black">
        <SiteNavbar activeItem="Shop" variant="dark" />
      </div>

      <section className="px-6 pb-28 pt-4 sm:px-10 2xl:px-0">
        <div className="mx-auto max-w-7xl">
          <ProductBreadcrumb product={product} />
          <div className="mt-10 grid gap-12 grid-cols-1 lg:grid-cols-[minmax(0,620px)_minmax(0,540px)] lg:grid-rows-[auto_auto] lg:justify-between">
            {/* Gallery (Image) - Row 1, Col 1 on desktop, Top on mobile */}
            <div className="order-1 lg:order-0 lg:col-start-1 lg:row-start-1">
              <ProductGallery product={product} />
            </div>

            {/* Description & How To Use - Row 2, Col 1 on desktop, Bottom on mobile */}
            <div className="order-3 lg:order-0 lg:col-start-1 lg:row-start-2">
              <ProductInfoTabs
                activeTab={activeTab}
                onTabChange={setActiveTab}
                product={product}
              />
            </div>

            {/* Product Summary (Checkout) - Row 1-2, Col 2 on desktop, Middle on mobile */}
            <div className="order-2 lg:order-0 lg:col-start-2 lg:row-start-1 lg:row-span-2">
              <ProductSummary product={product} />
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

function ProductGallery({ product }: { product: ApiProduct }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const galleryImages = product.imageUrls && product.imageUrls.length > 0
    ? product.imageUrls.map((img) => getProductImageUrl(img) || "")
    : (product.imageUrl ? [getProductImageUrl(product.imageUrl) || ""] : []);

  const gallery = galleryImages.length > 0
    ? galleryImages.map((img, idx) => ({
      image: img,
      alt: `${product.title} - Image ${idx + 1}`,
    }))
    : [{ image: "", alt: product.title }];

  const activeSlide = gallery[activeIndex];

  const goToPrevious = () => {
    setActiveIndex(
      (current) => (current - 1 + gallery.length) % gallery.length,
    );
  };

  const goToNext = () => {
    setActiveIndex((current) => (current + 1) % gallery.length);
  };

  return (
    <Card className="rounded-lg border border-[#d9d9d9] p-0 shadow-md">
      <CardContent className="p-10">
        <div className="group relative mx-auto w-full max-w-[540px] aspect-square overflow-hidden rounded-lg flex items-center justify-center">
          <AnimatePresence mode="wait">
            {activeSlide.image ? (
              <motion.div
                key={activeSlide.image}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="mx-auto h-full w-full flex items-center justify-center"
              >
                <Image
                  src={activeSlide.image}
                  alt={activeSlide.alt}
                  width={520}
                  height={540}
                  className="mx-auto h-full w-full transition-transform duration-300 ease-out group-hover:scale-105 object-contain"
                  priority
                />
              </motion.div>
            ) : (
              <PackageCheck className="size-24 text-gray-300" />
            )}
          </AnimatePresence>
          {gallery.length > 1 && (
            <>
              <Button
                aria-label={`Show previous ${activeSlide.alt}`}
                className="absolute left-0 top-1/2 inline-flex size-10 -translate-x-2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/85 p-0 text-white opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                onClick={goToPrevious}
                size="icon"
                type="button"
              >
                <ChevronLeft className="size-4" />
              </Button>
              <Button
                aria-label={`Show next ${activeSlide.alt}`}
                className="absolute right-0 top-1/2 inline-flex size-10 translate-x-2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/85 p-0 text-white opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                onClick={goToNext}
                size="icon"
                type="button"
              >
                <ChevronRight className="size-4" />
              </Button>
            </>
          )}
        </div>

        {gallery.length > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            {gallery.map((item, index) => (
              <button
                aria-label={`Go to product image ${index + 1}`}
                className={`size-2 shrink-0 cursor-pointer rounded-full p-0 transition-colors ${index === activeIndex
                  ? "bg-black"
                  : "bg-[#d2d5db] hover:bg-black/45"
                  }`}
                key={item.image}
                onClick={() => setActiveIndex(index)}
                type="button"
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ProductBreadcrumb({ product }: { product: ApiProduct }) {
  return (
    <Breadcrumb>
      <BreadcrumbList className="text-sm">
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">
              <Home className="size-4" />
              <span className="sr-only">Home</span>
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/shop">Shop</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{product.title}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

function ProductInfoTabs({
  activeTab,
  onTabChange,
  product,
}: {
  activeTab: ProductDetailTab;
  onTabChange: (tab: ProductDetailTab) => void;
  product: ApiProduct;
}) {
  let customSections: { id?: string; title: string; content: string }[] = [];
  if (product.customSections) {
    try {
      customSections = typeof product.customSections === "string" 
        ? JSON.parse(product.customSections) 
        : product.customSections;
    } catch (e) {
      // ignore
    }
  }

  return (
    <Tabs
      className="mt-10"
      onValueChange={(value) => onTabChange(value as ProductDetailTab)}
      value={activeTab}
    >
      <div className="border-b border-border">
        <TabsList
          className="h-auto gap-8 rounded-none bg-transparent p-0"
          variant="line"
        >
          <TabsTrigger
            className="h-12 rounded-none px-0 text-base font-bold uppercase after:hidden data-[state=inactive]:text-black/50 cursor-pointer"
            value="description"
          >
            Description
          </TabsTrigger>
          {customSections.map((section, idx) => (
            <TabsTrigger
              key={section.id || `sect-${idx}`}
              className="h-12 rounded-none px-0 text-base font-bold uppercase after:hidden data-[state=inactive]:text-black/50 cursor-pointer"
              value={`custom-${idx}`}
            >
              {section.title}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      <TabsContent className="pt-8" value="description">
        <DescriptionContent product={product} />
      </TabsContent>
      {customSections.map((section, idx) => (
        <TabsContent key={section.id || `sect-${idx}`} className="pt-8" value={`custom-${idx}`}>
          <div
            className="text-sm leading-6 [&_ol]:list-decimal [&_ol:has(li[data-list='bullet'])]:list-disc [&_ul]:list-disc [&_ol]:pl-5 [&_ul]:pl-5 [&_li]:my-1.5 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:mt-6 [&_h2]:mb-2 [&_h3]:text-base [&_h3]:font-bold [&_h3]:mt-6 [&_h3]:mb-2 [&_p]:mb-3 [&_p:empty]:hidden [&_p:has(br:only-child)]:hidden [&_.ql-ui]:hidden"
            dangerouslySetInnerHTML={{ __html: section.content }}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
}

function DescriptionContent({ product }: { product: ApiProduct }) {
  if (!product.description) {
    return <p className="text-sm text-gray-500">No description available.</p>;
  }
  return (
    <div
      className="text-sm leading-6 [&_ol]:list-decimal [&_ol:has(li[data-list='bullet'])]:list-disc [&_ul]:list-disc [&_ol]:pl-5 [&_ul]:pl-5 [&_li]:my-1.5 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:mt-6 [&_h2]:mb-2 [&_h3]:text-base [&_h3]:font-bold [&_h3]:mt-6 [&_h3]:mb-2 [&_p]:mb-3 [&_p:empty]:hidden [&_p:has(br:only-child)]:hidden [&_.ql-ui]:hidden"
      dangerouslySetInnerHTML={{ __html: product.description }}
    />
  );
}



function ProductSummary({ product }: { product: ApiProduct }) {
  const { addToCart, showToast } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const parsedPackSizes = useMemo(() => {
    let arr = [];
    if (!product.packSizes) return [];
    if (typeof product.packSizes === "string") {
      try {
        arr = JSON.parse(product.packSizes);
      } catch (e) {
        return [];
      }
    } else if (Array.isArray(product.packSizes)) {
      arr = product.packSizes;
    }
    
    return arr.map((p: any) => ({
      ...p,
      label: p.label || p.name,
    }));
  }, [product.packSizes]);

  const [selectedPackSizeLabel, setSelectedPackSizeLabel] = useState<string | null>(null);

  const selectedPackSize = useMemo(() => {
    return parsedPackSizes.find((p: any) => p.label === selectedPackSizeLabel) || null;
  }, [parsedPackSizes, selectedPackSizeLabel]);

  const handleAddToCart = () => {
    if (parsedPackSizes.length > 0 && !selectedPackSize) {
      showToast("Please select a pack size before adding to cart.");
      return;
    }
    addToCart(product, quantity, selectedPackSize);
    setIsAdded(true);
    showToast(`${product.title} added to cart!`);
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  let displayPrice = typeof product.price === "number" ? `£${product.price.toFixed(2)}` : product.price;

  if (selectedPackSize) {
    displayPrice = `£${Number(selectedPackSize.price).toFixed(2)}`;
  } else if (parsedPackSizes.length > 0) {
    const prices = parsedPackSizes.map((p: any) => Number(p.price) || 0);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    displayPrice = minPrice === maxPrice 
      ? `£${minPrice.toFixed(2)}` 
      : `£${minPrice.toFixed(2)} - £${maxPrice.toFixed(2)}`;
  }

  // Map category/type
  const categoryLabel = product.productType
    ? product.productType.replace(/_/g, " ")
    : (product.collectionTypes && product.collectionTypes.length > 0 ? product.collectionTypes[0].replace(/_/g, " ") : "Product");

  const details = [
    product.flavourAndAroma && { label: "Flavour & Aroma", value: product.flavourAndAroma },
    product.effectProfile && { label: "Effect Profile", value: product.effectProfile },
    product.strainType && { label: "Strain Type", value: product.strainType },
  ].filter(Boolean) as Array<{ label: string; value: string }>;

  return (
    <div>
      <p className="text-sm font-medium uppercase text-gray-500">{categoryLabel}</p>
      <h1 className="mt-4 font-satoshi text-2xl sm:text-5xl font-bold leading-tight tracking-normal">
        {product.title}
      </h1>
      {product.subtitle && (
        <p className="mt-2 text-base sm:text-lg text-gray-600 font-medium">
          {product.subtitle}
        </p>
      )}

      {parsedPackSizes.length > 0 && (
        <div className="mt-6 flex items-center justify-between border-y border-neutral-200 py-3">
          <p className="text-sm font-medium">Pack Size</p>
          <Select
            value={selectedPackSizeLabel || undefined}
            onValueChange={setSelectedPackSizeLabel}
          >
            <SelectTrigger className="w-[200px] border-none shadow-none bg-neutral-50 hover:bg-neutral-100 transition-colors focus:ring-0 rounded-sm font-medium">
              <SelectValue placeholder="Select pack size" />
            </SelectTrigger>
            <SelectContent>
              {parsedPackSizes.map((pack: any) => (
                <SelectItem key={pack.label} value={pack.label}>
                  {pack.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <p className="mt-6 text-xl sm:text-2xl font-bold">{displayPrice}</p>

      {details.length > 0 && (
        <div className="mt-6 space-y-3 text-sm">
          {details.map((detail) => (
            <p key={detail.label}>
              <strong>{detail.label}</strong> – {detail.value}
            </p>
          ))}
        </div>
      )}

      {product.summary && (
        <div
          className="mt-6 text-sm leading-6 text-justify [&_ol]:list-decimal [&_ol:has(li[data-list='bullet'])]:list-disc [&_ul]:list-disc [&_ol]:pl-5 [&_ul]:pl-5 [&_li]:my-1.5 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:mt-6 [&_h2]:mb-2 [&_h3]:text-base [&_h3]:font-bold [&_h3]:mt-6 [&_h3]:mb-2 [&_p]:mb-3 [&_p:empty]:hidden [&_p:has(br:only-child)]:hidden [&_.ql-ui]:hidden"
          dangerouslySetInnerHTML={{ __html: product.summary }}
        />
      )}

      <div className="mt-7">
        <p className="text-sm font-bold">Quantity</p>
        <div className="mt-4 flex h-10 w-32 items-center justify-between rounded-lg border">
          <Button
            className="size-10 rounded-lg"
            size="icon"
            variant="ghost"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          >
            <Minus className="size-4" />
          </Button>
          <span className="text-sm">{quantity}</span>
          <Button
            className="size-10 rounded-lg"
            size="icon"
            variant="ghost"
            onClick={() => setQuantity((q) => q + 1)}
          >
            <Plus className="size-4" />
          </Button>
        </div>
      </div>

      <motion.div whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.02 }}>
        <Button
          onClick={handleAddToCart}
          className={`mt-5 h-13 w-full rounded-lg text-white font-bold transition-all duration-300 ${isAdded ? "bg-emerald-600 hover:bg-emerald-700" : "bg-black hover:bg-black/85"
            }`}
        >
          {isAdded ? "Added to Cart! ✓" : "Add to Cart"}
          {!isAdded && <ShoppingCart className="size-4 ml-2 inline" />}
        </Button>
      </motion.div>

      <Separator className="mt-10" />
      <div className="mt-6 space-y-5 text-sm">
        <div className="flex items-center gap-4">
          <Truck className="size-5" />
          <span>Free shipping over £125</span>
        </div>
        <div className="flex items-center gap-4">
          <PackageCheck className="size-5" />
          <span>Discreet and secure packaging</span>
        </div>
        <div className="flex items-center gap-4">
          <LockKeyhole className="size-5" />
          <span>Secure checkout</span>
        </div>
      </div>

      <Separator className="mt-6" />
      <div className="mt-6">
        <p className="text-sm font-bold">We accept</p>
        <div className="mt-4 flex items-center gap-3">
          <Image
            src={masterCardImage}
            alt="Mastercard"
            width={75}
            height={45}
          />
          <Image src={visaImage} alt="Visa" width={75} height={45} />
        </div>
      </div>
    </div>
  );
}
