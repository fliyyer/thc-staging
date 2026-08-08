"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useLatestBlogs } from "@/hooks/use-blogs";
import {
  formatBlogDate,
  getBlogImageUrl,
  type ApiBlog,
} from "@/lib/api/blogs-api";
import Image from "next/image";
import type { StaticImageData } from "next/image";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

import design1Icon from "@/assets/icons/design-1.svg";
import design2Icon from "@/assets/icons/design-2.svg";
import design3Icon from "@/assets/icons/design-3.svg";
import starsIcon from "@/assets/icons/stars.svg";

import blogImage from "@/assets/blog/blog.png";
import collection1Image from "@/assets/collection/col-1.png";
import collection2Image from "@/assets/collection/col-2.png";
import collection3Image from "@/assets/collection/col-3.png";
import collection4Image from "@/assets/collection/col-4.png";
import collection5Image from "@/assets/collection/col-5.png";
import heroImage from "@/assets/hero.png";
import philo1Image from "@/assets/philosophy/philo-1.png";
import philo2Image from "@/assets/philosophy/philo-2.png";
import philo3Image from "@/assets/philosophy/philo-3.png";
import { FeaturedProducts } from "@/components/home/featured-products";
import { HeroProductSlider } from "@/components/home/hero-product-slider";
import { SiteFooter } from "@/components/home/footer";
import { SiteNavbar } from "@/components/home/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import MarqueeStrip from "@/components/marquee-strip";

import { FreeShippingBar } from "@/components/free-shipping-bar";
import { PromotionBanner } from "@/components/promotion-banner";

const standards = [
  {
    title: "Deliberate Process",
    description:
      "Every detail is carefully considered from formulation to presentation.",
    icon: design1Icon,
  },
  {
    title: "Uncompromising Standards",
    description:
      "Focused on quality, consistency, and elevated product experience.",
    icon: design2Icon,
  },
  {
    title: "Calm & Future Focused",
    description:
      "A more refined and intentional perspective on modern plant culture.",
    icon: design3Icon,
  },
];

const collections = [
  {
    title: "V3 Live Resin Vapes",
    description: "Bigger, smoother, and built for serious flavour",
    image: collection1Image,
  },
  {
    title: "V2 Vape",
    description: "Refined hardware and smooth performance",
    image: collection2Image,
  },
  {
    title: "Gummies",
    description: "Delicious and perfectly balance",
    image: collection3Image,
  },
  {
    title: "Capsule",
    description: "Small Doses and Big Benefits",
    image: collection4Image,
  },
  {
    title: "Chocolate",
    description: "Delightful Plant-Based Bliss",
    image: collection5Image,
  },
];

const reviews = [
  {
    quote:
      "Very very good products, will definitely be exploring into more! Great for weekends, no anxiety kick, no smell, no side effects. 10/10",
    name: "Niko",
    date: "Feb 17, 2026",
  },
  {
    quote:
      "Fantastic, true high collabs have created something truly amazing. The product quality is top draw so is great value for money.",
    name: "Joe Gibney",
    date: "Jan 15, 2026",
  },
  {
    quote:
      "Fantastic product, first time ordering through True High but product and quality was perfect. Ordered and delivered, potent ingredients.",
    name: "James Bowyer",
    date: "Jan 15, 2026",
  },
];

// Removed static smallBlogs — now fetched from API

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-black">
      <HeroSection />
      <MarqueeStrip />
      <PhilosophySection />
      <StandardsSection />
      <FeaturedProducts />
      <CollectionsSection />
      <BlogSection />
      <ReviewsSection />
      <SiteFooter />
      <PromotionBanner />
    </main>
  );
}

function HeroSection() {
  return (
    <section className="relative min-h-[680px] overflow-hidden bg-black text-white sm:min-h-225">
      <Image
        src={heroImage}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/45" />

      <div className="relative z-10 flex min-h-[680px] flex-col sm:h-225 sm:min-h-0">
        <FreeShippingBar />

        <SiteNavbar />

        <div className="mx-auto flex flex-col w-full max-w-360 flex-1 justify-end gap-10 px-4 pb-10 pt-8 sm:px-10 sm:pb-16 sm:pt-12 lg:grid lg:grid-cols-[1fr_360px] lg:pb-20 2xl:px-0">
          {/* Mobile-only Top Row: Stars + Product Slider */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="flex w-full items-start justify-between gap-4 lg:hidden"
          >
            <div className="pt-4 sm:pt-8">
              <div className="flex gap-1 text-[#ffd500]">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star className="size-4 fill-current sm:size-5" key={index} />
                ))}
              </div>
              <p className="mt-2 text-sm font-semibold sm:text-base">
                Trusted by 7k+
              </p>
              <p className="mt-1 text-xs sm:text-sm text-white/80">
                Happy Costumers
              </p>
            </div>

            <div className="w-[170px] sm:w-[240px] shrink-0">
              <HeroProductSlider />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="max-w-3xl"
          >
            <h1 className="text-[28px] font-satoshi font-bold leading-tight tracking-normal sm:text-6xl lg:text-[64px]">
              Unlock The
              <br />
              Power Of Nature
              <br />
              With True High Collabs.
            </h1>
            <p className="mt-5 max-w-xl text-sm font-medium leading-6 sm:mt-6 sm:text-lg sm:leading-7">
              Founded in 2023, True High Collabs combines nature&apos;s most
              potent remedies to create exceptional products that truly stand
              out.
            </p>
            <Button
              asChild
              className="mt-8 sm:h-12 rounded-lg bg-white px-8 text-sm sm:text-lg text-black hover:bg-white/90 sm:mt-9 sm:w-auto"
            >
              <Link href="/shop">Shop Now</Link>
            </Button>

            {/* Desktop-only Rating */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
              className="mt-10 sm:mt-18 hidden lg:block"
            >
              <div className="flex gap-1 text-[#ffd500]">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star className="size-5 fill-current" key={index} />
                ))}
              </div>
              <p className="mt-2 text-base font-semibold">Trusted by 7k+</p>
              <p className="mt-1 text-sm">Happy Costumers</p>
            </motion.div>
          </motion.div>

          {/* Desktop-only Product Slider */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
            className="hidden lg:block"
          >
            <HeroProductSlider />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function SectionHeading({
  eyebrow,
  title,
  className,
}: {
  eyebrow: string;
  title: string;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className={className}
    >
      <p className="text-center text-xs sm:text-base font-medium uppercase">
        {eyebrow}
      </p>
      <h2 className="mx-auto mt-4 max-w-3xl font-satoshi text-center text-[22px] font-bold leading-tight tracking-normal sm:text-4xl lg:text-5xl">
        {title}
      </h2>
    </motion.div>
  );
}

function PhilosophySection() {
  const [activeTab, setActiveTab] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft } = scrollRef.current;
    const itemWidth =
      scrollRef.current.children[0]?.getBoundingClientRect().width || 1;
    const gap = 16;
    const index = Math.round(scrollLeft / (itemWidth + gap));
    setActiveTab(Math.min(2, Math.max(0, index)));
  };

  const scrollTo = (index: number) => {
    if (!scrollRef.current) return;
    const itemWidth =
      scrollRef.current.children[0]?.getBoundingClientRect().width || 0;
    const gap = 16;
    scrollRef.current.scrollTo({
      left: index * (itemWidth + gap),
      behavior: "smooth",
    });
    setActiveTab(index);
  };

  return (
    <section className="px-4 py-16 sm:px-10 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <p className="text-center text-xs font-medium uppercase sm:text-base">
            Our Philosophy
          </p>
          <h2 className="mx-auto mt-3 font-satoshi max-w-5xl text-center text-[22px] sm:text-3xl font-bold leading-tight tracking-normal md:text-5xl ">
            Premium Products Inspired By Cannabis Culture, Mushrooms, And Modern
            Rituals
          </h2>
        </motion.div>

        {/* Desktop-only grid */}
        <div className="mx-auto mt-10 hidden sm:grid max-w-6xl items-center gap-8 sm:mt-14 sm:grid-cols-3 sm:gap-12 lg:gap-18 relative z-0">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          >
            <ImageTile
              className="sm:mt-24"
              image={philo1Image}
              label="420"
              labelPosition="left"
              sublabel="Premium cannabis formulations."
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          >
            <ImageTile className="sm:-mt-10" image={philo2Image} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          >
            <ImageTile
              className="sm:mt-24"
              image={philo3Image}
              label="Mushrooms"
              labelPosition="right"
              sublabel="Ceremonial mushroom culture."
            />
          </motion.div>
        </div>

        {/* Mobile-only carousel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          className="sm:hidden mt-10 relative z-0"
        >
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
            <div className="w-[80vw] shrink-0 snap-center">
              <ImageTile
                image={philo1Image}
                label="420"
                labelPosition="left"
                sublabel="Premium cannabis formulations."
                isMobileCenter={true}
              />
            </div>
            <div className="w-[80vw] shrink-0 snap-center">
              <ImageTile image={philo2Image} />
            </div>
            <div className="w-[80vw] shrink-0 snap-center">
              <ImageTile
                image={philo3Image}
                label="Mushrooms"
                labelPosition="right"
                sublabel="Ceremonial mushroom culture."
                isMobileCenter={true}
              />
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-4">
            {[0, 1, 2].map((index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={`size-2.5 rounded-full transition-colors duration-200 ${
                  activeTab === index ? "bg-black" : "bg-black/20"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        >
          <p className="mx-auto mt-10 max-w-4xl text-center text-sm leading-7 sm:mt-12 sm:text-lg ">
            Thoughtfully developed for those who value quality, balance, and
            intention, True High Collabs brings a considered approach to
            plant-inspired lifestyle products. Designed to complement modern
            routines and elevated moments, our collections reflect a quieter,
            more refined take on familiar culture.
          </p>
          <div className="mt-8 text-center sm:mt-10">
            <Button
              asChild
              className="h-10 rounded-lg bg-black px-4 text-sm md:px-8 sm:text-lg text-white hover:bg-black/85 sm:h-13 sm:w-auto"
            >
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ImageTile({
  className,
  image,
  label,
  labelPosition = "left",
  sublabel,
  isMobileCenter = false,
}: {
  className?: string;
  image: StaticImageData;
  label?: string;
  labelPosition?: "left" | "right";
  sublabel?: string;
  isMobileCenter?: boolean;
}) {
  return (
    <div className={`relative aspect-square rounded-lg ${className ?? ""}`}>
      <div className="absolute inset-0 overflow-hidden rounded-lg">
        <Image
          src={image}
          alt=""
          fill
          sizes="(min-width: 768px) 30vw, 100vw"
          className="object-cover"
        />
      </div>
      {label ? (
        <Card
          className={`absolute z-10 w-[calc(100%-2rem)] max-w-40 gap-0 rounded-lg bg-white p-4 shadow-lg sm:top-1/2 sm:bottom-auto sm:w-40 sm:max-w-none sm:-translate-x-0 sm:-translate-y-1/2 ${
            isMobileCenter
              ? "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              : "bottom-4 left-1/2 -translate-x-1/2"
          } ${
            labelPosition === "right"
              ? "sm:left-auto sm:-right-16"
              : "sm:-left-16"
          }`}
        >
          <CardTitle className="text-xs sm:text-base font-bold">
            {label}
          </CardTitle>
          <CardDescription className="mt-2 text-xs sm:text-sm text-black">
            {sublabel}
          </CardDescription>
        </Card>
      ) : null}
    </div>
  );
}

function StandardsSection() {
  return (
    <section className="px-4 py-16 sm:px-10 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          className="max-w-145 mx-auto text-base"
          eyebrow="Our Standards"
          title="Designed With Intention In Every Detail"
        />
        <div className="mt-8 grid gap-4 sm:mt-10 sm:gap-6 md:grid-cols-3">
          {standards.map((item, index) => {
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: "easeOut",
                }}
                className="h-full"
              >
                <Card className="gap-0 rounded-lg p-5 shadow-md sm:p-6 h-full transition-shadow duration-300 hover:shadow-lg">
                  <div className="flex size-8 items-center justify-center rounded-md bg-black text-white">
                    <Image
                      src={item.icon}
                      alt=""
                      width={16}
                      height={16}
                      className="size-4"
                    />
                  </div>
                  <CardTitle className="mt-6 text-sm sm:text-lg font-semibold">
                    {item.title}
                  </CardTitle>
                  <CardDescription className="mt-3 max-w-84 text-sm sm:text-lg text-black">
                    {item.description}
                  </CardDescription>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CollectionsSection() {
  return (
    <section className="px-4 py-16 sm:px-10 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Our Collections"
          title="Crafted for Elevated Living"
        />
        <div className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 lg:grid-cols-5">
          {collections.map((item, index) => {
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                  ease: "easeOut",
                }}
                whileHover={{
                  y: -5,
                  scale: 1.02,
                  transition: { duration: 0.2 },
                }}
                className="h-full"
              >
                <Card
                  className="items-center gap-0 border-0 p-5 text-center sm:p-6 h-full transition-shadow duration-300"
                  style={{
                    borderRadius: "5px",
                    background:
                      "linear-gradient(137deg, var(--Primary-2, #FFF) 0%, rgba(210, 213, 219, 0.50) 49.9%, var(--Primary-2, #FFF) 99.79%)",
                    boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.25)",
                  }}
                >
                  <Image
                    alt={item.title}
                    className="h-26 w-auto"
                    height={104}
                    src={item.image}
                  />
                  <CardTitle className="mt-5 text-base sm:text-lg font-semibold">
                    {item.title}
                  </CardTitle>
                  <CardDescription className="mt-2 text-sm sm:text-base text-black">
                    {item.description}
                  </CardDescription>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function BlogCardSkeleton() {
  return (
    <div className="grid gap-4 rounded-lg p-4 shadow-md sm:grid-cols-[124px_1fr] sm:gap-6 sm:p-5 border border-gray-100 animate-pulse">
      <div className="min-h-48 rounded-md bg-gray-200 sm:min-h-23" />
      <div className="space-y-3">
        <div className="h-4 rounded bg-gray-200" />
        <div className="h-4 w-3/4 rounded bg-gray-200" />
        <div className="h-3 w-1/2 rounded bg-gray-100" />
      </div>
    </div>
  );
}

function FeaturedBlogSkeleton() {
  return (
    <div className="mt-8 grid items-start gap-6 sm:mt-10 sm:gap-8 lg:grid-cols-[minmax(0,600px)_1fr]">
      <div className="min-h-64 rounded-lg bg-gray-200 animate-pulse sm:min-h-86" />
      <div className="pt-1 space-y-4 animate-pulse lg:pt-2">
        <div className="h-8 rounded bg-gray-200" />
        <div className="h-6 w-3/4 rounded bg-gray-200" />
        <div className="h-3 w-1/3 rounded bg-gray-100" />
        <div className="h-20 rounded bg-gray-100" />
        <div className="h-10 w-32 rounded-lg bg-gray-200" />
      </div>
    </div>
  );
}

function BlogSmallCard({ blog }: { blog: ApiBlog }) {
  const imageUrl = getBlogImageUrl(blog.imageUrl);
  return (
    <Link
      href={`/blog/${blog.slug}`}
      className="block transition-transform hover:scale-[1.01]"
    >
      <Card className="grid gap-4 rounded-lg p-4 shadow-md sm:grid-cols-[124px_1fr] sm:gap-6 sm:p-5 h-full">
        <div className="relative min-h-48 overflow-hidden rounded-md sm:min-h-23 bg-gray-100">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={blog.title}
              fill
              sizes="(min-width: 640px) 124px, 100vw"
              className="object-cover"
              unoptimized
            />
          ) : (
            <Image
              src={blogImage}
              alt={blog.title}
              fill
              sizes="(min-width: 640px) 124px, 100vw"
              className="object-cover"
            />
          )}
        </div>
        <div>
          <h4 className="text-base font-satoshi font-bold leading-6 sm:text-lg line-clamp-2 text-black">
            {blog.title}
          </h4>
          <p className="mt-3 text-sm sm:mt-4 text-gray-500">
            {formatBlogDate(blog.createdAt)}
            <span className="px-2">•</span>
            {blog.readingTime} Min Read
          </p>
        </div>
      </Card>
    </Link>
  );
}

function BlogSmallCardMobile({ blog }: { blog: ApiBlog }) {
  const imageUrl = getBlogImageUrl(blog.imageUrl);
  return (
    <Link href={`/blog/${blog.slug}`} className="block">
      <Card className="grid grid-cols-[90px_1fr] gap-4 rounded-[5px] bg-white p-4 shadow-[0_0_10px_0_rgba(0,0,0,0.25)] border-none items-center min-h-[120px]">
        <div className="relative aspect-square overflow-hidden rounded-[5px] w-full bg-gray-100">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={blog.title}
              fill
              sizes="90px"
              className="object-cover"
              unoptimized
            />
          ) : (
            <Image
              src={blogImage}
              alt={blog.title}
              fill
              sizes="90px"
              className="object-cover"
            />
          )}
        </div>
        <div>
          <h4 className="text-sm font-satoshi font-bold leading-snug line-clamp-2 text-black">
            {blog.title}
          </h4>
          <p className="mt-2 text-xs text-black/60">
            {formatBlogDate(blog.createdAt)}
            <span className="px-1">•</span>
            {blog.readingTime}
          </p>
        </div>
      </Card>
    </Link>
  );
}

function BlogSection() {
  const [activeTab, setActiveTab] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useLatestBlogs({ page: 1, limit: 4 });

  const blogs = data?.data ?? [];
  const featuredBlog = blogs[0] ?? null;
  const smallBlogs = blogs.slice(1, 4);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft } = scrollRef.current;
    const itemWidth =
      scrollRef.current.children[0]?.getBoundingClientRect().width || 1;
    const gap = 16;
    const index = Math.round(scrollLeft / (itemWidth + gap));
    setActiveTab(Math.min(smallBlogs.length - 1, Math.max(0, index)));
  };

  const scrollTo = (index: number) => {
    if (!scrollRef.current) return;
    const itemWidth =
      scrollRef.current.children[0]?.getBoundingClientRect().width || 0;
    const gap = 16;
    scrollRef.current.scrollTo({
      left: index * (itemWidth + gap),
      behavior: "smooth",
    });
    setActiveTab(index);
  };

  const featuredImageUrl = featuredBlog
    ? getBlogImageUrl(featuredBlog.imageUrl)
    : null;

  return (
    <section className="px-4 py-16 sm:px-10 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col gap-5 sm:items-end sm:justify-between lg:flex-row lg:gap-6"
        >
          <div>
            <p className="text-xs font-medium uppercase sm:text-base">
              Our Recent Blogs
            </p>
            <h2 className="mt-3 text-[22px] font-satoshi font-bold tracking-normal sm:mt-5 sm:text-4xl lg:text-5xl">
              Rooted in Curiosity
            </h2>
          </div>
          <Button
            asChild
            className="h-10 w-fit rounded-lg bg-black px-6 text-sm md:px-8 sm:text-base text-white hover:bg-black/85 sm:h-13 sm:w-auto"
          >
            <Link href="/blog">View All Blogs</Link>
          </Button>
        </motion.div>

        {/* Featured post */}
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <FeaturedBlogSkeleton />
          </motion.div>
        ) : featuredBlog ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="mt-8 grid items-start gap-6 sm:mt-10 sm:gap-8 lg:grid-cols-[minmax(0,600px)_1fr]"
          >
            <div className="relative min-h-64 overflow-hidden rounded-lg sm:min-h-86.25 bg-gray-100">
              {featuredImageUrl ? (
                <Image
                  src={featuredImageUrl}
                  alt={featuredBlog.title}
                  fill
                  sizes="(min-width: 1024px) 600px, 100vw"
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <Image
                  src={blogImage}
                  alt={featuredBlog.title}
                  fill
                  sizes="(min-width: 1024px) 600px, 100vw"
                  className="object-cover"
                />
              )}
            </div>
            <div className="pt-1 lg:pt-2">
              <h3 className="max-w-3xl font-satoshi text-lg font-bold text-justify leading-tight tracking-normal sm:text-3xl lg:text-[40px]">
                {featuredBlog.title}
              </h3>
              <p className="mt-5 text-xs sm:mt-8 sm:text-sm">
                {formatBlogDate(featuredBlog.createdAt)}
                <span className="px-3">•</span>
                {featuredBlog.readingTime} Min Read
              </p>
              {featuredBlog.summary && (
                <p className="mt-5 max-w-4xl text-sm text-justify leading-6 sm:mt-8 sm:text-base sm:leading-5">
                  {featuredBlog.summary}
                </p>
              )}
              <Button
                asChild
                className="mt-6 rounded-lg bg-black px-6 text-xs py-3 text-white hover:bg-black/85 sm:mt-8 sm:w-auto sm:text-base sm:px-8 sm:py-5"
              >
                <Link href={`/blog/${featuredBlog.slug}`}>Read More</Link>
              </Button>
            </div>
          </motion.div>
        ) : null}

        {/* Desktop-only 3-column small cards */}
        <div className="mt-6 hidden sm:grid gap-4 sm:gap-6 md:grid-cols-3">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <BlogCardSkeleton key={i} />
              ))
            : smallBlogs.map((blog, index) => (
                <motion.div
                  key={blog.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                    ease: "easeOut",
                  }}
                >
                  <BlogSmallCard blog={blog} />
                </motion.div>
              ))}
        </div>

        {/* Mobile-only carousel */}
        {smallBlogs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="sm:hidden mt-2"
          >
            <style>{`
              .scrollbar-none::-webkit-scrollbar { display: none; }
              .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="flex gap-4 overflow-x-auto snap-x snap-mandatory p-4 scrollbar-none"
            >
              {smallBlogs.map((blog) => (
                <div className="w-[80vw] shrink-0 snap-start" key={blog.id}>
                  <BlogSmallCardMobile blog={blog} />
                </div>
              ))}
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 mt-4">
              {smallBlogs.map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollTo(index)}
                  className={`size-2.5 rounded-full transition-colors duration-200 ${
                    activeTab === index ? "bg-black" : "bg-black/20"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}

function ReviewsSection() {
  return (
    <section className="px-4 py-16 sm:px-10 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col gap-5 sm:items-end sm:justify-between lg:flex-row lg:gap-6"
        >
          <div>
            <p className="text-xs sm:text-base font-medium uppercase">
              Customer Experiences
            </p>
            <h2 className="mt-3 text-[22px] font-bold sm:mt-4 font-satoshi sm:text-5xl">
              What People Are Saying
            </h2>
          </div>
          <Button className="w-fit text-sm sm:text-base rounded-lg bg-black p-6 text-white hover:bg-black/85 sm:w-auto">
            View All Reviews
          </Button>
        </motion.div>

        <div className="mt-6 grid gap-4 sm:mt-8 sm:gap-5 md:grid-cols-3">
          {reviews.map((review, index) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: "easeOut",
              }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="h-full"
            >
              <Card className="gap-0 rounded-lg p-4 shadow-md h-full transition-shadow duration-300 hover:shadow-lg">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div
                      className="flex size-4 sm:size-5 items-center justify-center bg-black"
                      key={index}
                    >
                      <Image
                        src={starsIcon}
                        alt=""
                        width={14}
                        height={14}
                        className="size-3 sm:size-4"
                      />
                    </div>
                  ))}
                </div>
                <p className="mt-5 text-sm sm:text-base leading-5">
                  {review.quote}
                </p>
                <p className="mt-7 text-sm sm:text-base font-bold">
                  {review.name}
                </p>
                <p className="mt-1 text-xs">{review.date}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
