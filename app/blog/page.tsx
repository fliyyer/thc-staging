"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

import heroBlogImage from "@/assets/blog/hero-blog.png";
import blogImage from "@/assets/blog/blog.png";
import { SiteFooter } from "@/components/home/footer";
import { SiteNavbar } from "@/components/home/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { useLatestBlogs, usePopularBlogs } from "@/hooks/use-blogs";
import {
  formatBlogDate,
  getBlogImageUrl,
  type ApiBlog,
} from "@/lib/api/blogs-api";

export default function BlogPage() {
  const [page, setPage] = useState(1);
  const limit = 6;

  const { data: popularData, isLoading: popularLoading } = usePopularBlogs();
  const { data: latestData, isLoading: latestLoading } = useLatestBlogs({
    page,
    limit,
  });

  const popularBlogs = popularData ?? [];
  const latestBlogs = latestData?.data ?? [];
  const totalPages = latestData?.meta?.totalPages || 1;

  return (
    <main className="min-h-screen bg-white text-black">
      <BlogHero />
      <MarqueeStrip />
      <PopularBlog popularBlogs={popularBlogs} isLoading={popularLoading} />
      <LatestBlog
        latestBlogs={latestBlogs}
        isLoading={latestLoading}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
      <SiteFooter />
    </main>
  );
}

function BlogHero() {
  return (
    <section className="relative min-h-[460px] sm:min-h-225 overflow-hidden bg-black text-white">
      <Image
        src={heroBlogImage}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/45" />

      <div className="relative z-10 flex min-h-[600px] sm:min-h-225 flex-col">
        <FreeShippingBar />

        <SiteNavbar activeItem="Blog" />

        <div className="mx-auto flex w-full max-w-360 flex-1 items-end px-4 pb-10 pt-8 sm:px-10 sm:pb-16 lg:pb-20 2xl:px-0">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="max-w-5xl"
          >
            <h1 className="text-[28px] sm:text-5xl lg:text-[64px] font-satoshi font-bold tracking-normal">
              Rooted In Curiosity
            </h1>
            <p className="max-w-4xl text-sm sm:text-lg lg:text-xl font-medium mt-3 sm:mt-4">
              True High Collabs is shaped by culture as much as it is by
              product. Our blog explores plant culture, emerging research,
              design perspectives, and responsible approaches to modern
              wellness.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function PopularBlogSkeleton() {
  return (
    <div className="mt-8 grid gap-4 sm:mt-10 sm:gap-6 lg:grid-cols-[minmax(0,850px)_1fr]">
      <Card className="rounded-[5px] border border-gray-100 bg-white p-0 shadow-md animate-pulse">
        <CardContent className="p-3 sm:p-6 space-y-4">
          <div className="min-h-48 sm:min-h-72 rounded-lg bg-gray-200" />
          <div className="h-6 w-3/4 rounded bg-gray-200" />
          <div className="h-4 w-1/3 rounded bg-gray-100" />
          <div className="h-10 w-28 rounded bg-gray-200" />
        </CardContent>
      </Card>
      <div className="grid gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card
            key={i}
            className="rounded-[5px] border border-gray-100 bg-white p-0 shadow-md animate-pulse"
          >
            <CardContent className="grid grid-cols-[109px_1fr] gap-4 p-3 sm:grid-cols-[150px_1fr] sm:gap-6 sm:p-5 items-center">
              <div className="h-[96px] w-[109px] sm:h-28 sm:w-28 rounded bg-gray-200 shrink-0" />
              <div className="space-y-3 flex-1">
                <div className="h-4 rounded bg-gray-200" />
                <div className="h-3 w-1/2 rounded bg-gray-100" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function PopularBlog({
  popularBlogs,
  isLoading,
}: {
  popularBlogs: ApiBlog[];
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <section className="px-4 pt-16 sm:px-10 sm:pt-28 2xl:px-0">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-medium uppercase sm:text-base">
            What We Do
          </p>
          <h2 className="mt-3 text-[22px] font-bold font-satoshi tracking-normal sm:text-5xl">
            Popular Blog
          </h2>
          <PopularBlogSkeleton />
        </div>
      </section>
    );
  }

  const primaryBlog = popularBlogs[0];
  const sideBlogs = popularBlogs.slice(1, 4);

  if (!primaryBlog) return null;

  const primaryImageUrl = getBlogImageUrl(primaryBlog.imageUrl);

  return (
    <section className="px-4 pt-16 sm:px-10 sm:pt-28 2xl:px-0">
      <div className="mx-auto max-w-7xl">
        <p className="text-xs font-medium uppercase sm:text-base">What We Do</p>
        <h2 className="mt-3 text-[22px] font-bold font-satoshi tracking-normal sm:text-5xl">
          Popular Blog
        </h2>

        <div className="mt-8 grid gap-4 sm:mt-10 sm:gap-6 lg:grid-cols-[minmax(0,850px)_1fr]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="flex flex-col h-full"
          >
            <Card className="rounded-[5px] border-0 bg-white p-0 shadow-[0_0_10px_0_rgba(0,0,0,0.25)] flex flex-col h-full hover:shadow-lg transition-shadow">
              <CardContent className="p-3 sm:p-6 flex flex-col flex-1 h-full">
                <div className="relative flex-1 min-h-[200px] sm:min-h-[280px] overflow-hidden rounded-lg bg-gray-100 mb-4 sm:mb-6">
                  {primaryImageUrl ? (
                    <Image
                      src={primaryImageUrl}
                      alt={primaryBlog.title}
                      fill
                      sizes="(min-width: 1024px) 650px, 100vw"
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <Image
                      src={blogImage}
                      alt={primaryBlog.title}
                      fill
                      sizes="(min-width: 1024px) 650px, 100vw"
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="shrink-0 pb-4 sm:pb-6">
                  <h3 className="max-w-xl text-base font-satoshi font-bold leading-tight sm:text-xl text-black">
                    {primaryBlog.title}
                  </h3>
                  <p className="mt-2 text-xs text-gray-400 sm:mt-3 sm:text-sm">
                    {formatBlogDate(primaryBlog.createdAt)}{" "}
                    <span className="px-3">•</span> {primaryBlog.readingTime}{" "}
                    Min Read
                  </p>
                  {primaryBlog.summary && (
                    <p className="mt-3 text-sm sm:text-base lg:text-lg text-black/60 line-clamp-3 leading-snug">
                      {primaryBlog.summary}
                    </p>
                  )}
                </div>
                <Button
                  asChild
                  className="mt-4 w-fit rounded-md bg-black px-8 text-sm text-white hover:bg-black/85 h-10 sm:h-11 sm:mt-6 sm:text-base shrink-0"
                >
                  <Link href={`/blog/${primaryBlog.slug}`}>Read More</Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid gap-6">
            {sideBlogs.map((blog) => (
              <SideBlogCard blog={blog} key={blog.id} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SideBlogCard({ blog }: { blog: ApiBlog }) {
  const imageUrl = getBlogImageUrl(blog.imageUrl);
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
    >
      <Link href={`/blog/${blog.slug}`} className="block group">
        <Card className="rounded-[5px] border-0 bg-white p-0 shadow-[0_0_10px_0_rgba(0,0,0,0.25)] transition-all group-hover:scale-[1.02] group-hover:shadow-lg h-full">
          <CardContent className="grid grid-cols-[109px_1fr] gap-4 p-3 sm:grid-cols-[150px_1fr] sm:gap-6 sm:p-5 items-stretch h-full">
            <div className="relative w-full h-full min-h-[96px] sm:min-h-[112px] overflow-hidden rounded-[5px] bg-gray-100">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={blog.title}
                  fill
                  sizes="(min-width: 640px) 150px, 109px"
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <Image
                  src={blogImage}
                  alt={blog.title}
                  fill
                  sizes="(min-width: 640px) 150px, 109px"
                  className="object-cover"
                />
              )}
            </div>
            <div>
              <h3 className="text-base sm:text-xl font-satoshi font-bold leading-snug sm:leading-6 line-clamp-2">
                {blog.title}
              </h3>
              <p className="mt-1 sm:mt-3 text-xs sm:text-sm sm:whitespace-nowrap text-gray-400">
                {formatBlogDate(blog.createdAt)} <span className="px-2">•</span>{" "}
                {blog.readingTime} Min Read
              </p>
              {blog.summary && (
                <p className="mt-1 sm:mt-2 text-sm sm:text-base text-black/60 line-clamp-2 leading-snug">
                  {blog.summary}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

function LatestBlogSkeleton() {
  return (
    <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card
          key={i}
          className="rounded-[5px] border border-gray-100 bg-white p-0 shadow-md animate-pulse"
        >
          <CardContent className="p-3 sm:p-6 space-y-4">
            <div className="h-24 sm:h-56 rounded-lg bg-gray-200" />
            <div className="h-4 rounded bg-gray-200" />
            <div className="h-3 w-1/2 rounded bg-gray-100" />
            <div className="h-3 w-full rounded bg-gray-100 mt-2" />
            <div className="h-3 w-2/3 rounded bg-gray-100" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function LatestBlog({
  latestBlogs,
  isLoading,
  page,
  totalPages,
  onPageChange,
}: {
  latestBlogs: ApiBlog[];
  isLoading: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <section className="px-4 py-16 sm:px-10 sm:py-28 2xl:px-0">
      <div className="mx-auto max-w-7xl">
        <p className="text-xs font-medium uppercase sm:text-base">What We Do</p>
        <h2 className="mt-3 text-[22px] font-satoshi font-bold tracking-normal sm:text-5xl">
          Latest Blog
        </h2>

        {isLoading ? (
          <LatestBlogSkeleton />
        ) : (
          <>
            <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
              {latestBlogs.map((blog) => {
                const imageUrl = getBlogImageUrl(blog.imageUrl);
                return (
                  <motion.div
                    key={blog.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5 }}
                    className="block group h-full"
                  >
                    <Link href={`/blog/${blog.slug}`} className="block h-full">
                      <Card className="rounded-[5px] border-0 bg-white p-0 shadow-[0_0_10px_0_rgba(0,0,0,0.25)] flex flex-col h-full transition-transform group-hover:scale-[1.01]">
                        <CardContent className="p-3 sm:p-6 flex flex-col flex-1 h-full">
                          <div className="relative flex-1 min-h-[140px] sm:min-h-[220px] overflow-hidden rounded-lg w-full bg-gray-100 mb-4 sm:mb-6">
                            {imageUrl ? (
                              <Image
                                src={imageUrl}
                                alt={blog.title}
                                fill
                                sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 167px"
                                className="object-cover"
                                unoptimized
                              />
                            ) : (
                              <Image
                                src={blogImage}
                                alt={blog.title}
                                fill
                                sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 167px"
                                className="object-cover"
                              />
                            )}
                          </div>
                          <div className="shrink-0 pb-4 sm:pb-6">
                            <h3 className="text-sm sm:text-lg font-satoshi font-bold leading-tight sm:leading-6 line-clamp-2">
                              <span className="hover:underline text-black">
                                {blog.title}
                              </span>
                            </h3>
                            <p className="mt-1 sm:mt-3 text-[10px] sm:text-sm text-gray-400">
                              {formatBlogDate(blog.createdAt)}{" "}
                              <span className="px-1 sm:px-3">•</span>{" "}
                              {blog.readingTime} Min Read
                            </p>
                            {blog.summary && (
                              <p className="mt-1.5 text-xs sm:text-base text-black/60 line-clamp-3 leading-snug">
                                {blog.summary}
                              </p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {totalPages > 1 && (
              <BlogPagination
                page={page}
                totalPages={totalPages}
                onPageChange={onPageChange}
              />
            )}
          </>
        )}
      </div>
    </section>
  );
}

function BlogPagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <Pagination className="mt-12 sm:mt-20">
      <PaginationContent className="flex justify-center gap-2">
        <PaginationItem>
          <PaginationPrevious
            className={
              page === 1
                ? "pointer-events-none opacity-40 cursor-not-allowed"
                : "cursor-pointer"
            }
            onClick={() => page > 1 && onPageChange(page - 1)}
          />
        </PaginationItem>
        {pages.map((p) => (
          <PaginationItem key={p}>
            <PaginationLink
              className={`cursor-pointer ${
                p === page
                  ? "bg-black text-white text-xs sm:text-base hover:bg-black/90 hover:text-white"
                  : ""
              }`}
              isActive={p === page}
              onClick={() => onPageChange(p)}
            >
              {p}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            className={
              page === totalPages
                ? "pointer-events-none opacity-40 cursor-not-allowed"
                : "cursor-pointer"
            }
            onClick={() => page < totalPages && onPageChange(page + 1)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
