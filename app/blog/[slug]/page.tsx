import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Home, Mail } from "lucide-react";
import { notFound } from "next/navigation";

import { SiteFooter } from "@/components/home/footer";
import { SiteNavbar } from "@/components/home/navbar";
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
import { FreeShippingBar } from "@/components/free-shipping-bar";
import {
  blogPosts,
  getBlogPost,
  getReadAlsoPosts,
  type BlogPost,
} from "@/lib/blogs";
import { fetchBlogBySlug, fetchLatestBlogs, getBlogImageUrl, formatBlogDate, type ApiBlog } from "@/lib/api/blogs-api";
import blogImage from "@/assets/blog/blog.png";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type BlogDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  let post: any = null;

  try {
    const apiBlog = await fetchBlogBySlug(slug);
    if (apiBlog) {
      post = {
        slug: apiBlog.slug,
        title: apiBlog.title,
        excerpt: apiBlog.summary || "",
        heroAlt: apiBlog.title,
        image: getBlogImageUrl(apiBlog.imageUrl) || blogImage,
        author: apiBlog.author ? `${apiBlog.author.firstName} ${apiBlog.author.lastName}` : "Collabs",
        date: formatBlogDate(apiBlog.createdAt),
        readTime: `${apiBlog.readingTime} min read`,
        content: apiBlog.content,
        category: apiBlog.category,
      };
    }
  } catch (error) {
    console.warn(`Failed to fetch blog "${slug}" from API:`, error);
  }

  // Fallback to static mock blogs
  if (!post) {
    const staticPost = getBlogPost(slug);
    if (staticPost) {
      post = staticPost;
    }
  }

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white text-black">
      <FreeShippingBar />
      <div className="text-black [&_header]:text-black [&_header_button]:text-black [&_header_button]:hover:bg-black [&_header_button]:hover:text-white [&_header_a]:text-black">
        <SiteNavbar activeItem="Blog" variant="dark" />
      </div>

      <article className="px-4 pb-20 pt-6 sm:px-10 sm:pb-28 sm:pt-8 2xl:px-0">
        <div className="mx-auto max-w-7xl">
          <BlogBreadcrumb post={post} />
          <ArticleHero post={post} />
          <ArticleBody post={post} />
          <ShareBar />
          <ReadAlso currentSlug={post.slug} category={post.category || ""} />
        </div>
      </article>

      <SiteFooter />
    </main>
  );
}

function BlogBreadcrumb({ post }: { post: any }) {
  return (
    <Breadcrumb className="w-full min-w-0">
      <BreadcrumbList className="flex-nowrap whitespace-nowrap overflow-hidden w-full text-xs sm:text-sm gap-y-0">
        <BreadcrumbItem className="shrink-0">
          <BreadcrumbLink asChild>
            <Link href="/">
              <Home className="size-4" />
              <span className="sr-only">Home</span>
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="shrink-0" />
        <BreadcrumbItem className="shrink-0">
          <BreadcrumbLink asChild>
            <Link href="/blog">Blog</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="shrink-0" />
        <BreadcrumbItem className="min-w-0">
          <BreadcrumbPage className="truncate block max-w-[120px] sm:max-w-[300px] md:max-w-none">
            {post.title}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

function ArticleHero({ post }: { post: any }) {
  const isStaticImage = typeof post.image === "object";
  return (
    <section className="relative mt-8 min-h-[28rem] overflow-hidden rounded-lg sm:mt-12 sm:min-h-[660px]">
      <Image
        src={post.image}
        alt={post.heroAlt}
        fill
        priority
        sizes="(min-width: 1536px) 1440px, 100vw"
        className="object-cover"
        unoptimized={!isStaticImage}
      />
      <div className="absolute inset-0 bg-black/50" />
      <div className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-16">
        <h1 className="max-w-5xl font-satoshi text-2xl font-bold leading-tight tracking-normal sm:text-4xl lg:text-5xl">
          {post.title}
        </h1>
        <p className="mt-4 text-sm font-semibold leading-6 sm:mt-8 sm:text-base">
          By {post.author}
          <span className="px-2 sm:px-4">•</span>
          Posted on {post.date}
          <span className="px-2 sm:px-4">•</span>
          {post.readTime}
        </p>
      </div>
    </section>
  );
}

function ArticleBody({ post }: { post: any }) {
  if (typeof post.content === "string") {
    return (
      <div
        className="mt-10 text-sm leading-6 sm:mt-16 sm:text-base sm:leading-7 blog-content-html text-justify [&_p]:mb-4 sm:[&_p]:mb-5 [&_p:empty]:hidden [&_p:has(br:only-child)]:hidden [&_.ql-ui]:hidden [&_h2]:mt-8 [&_h2]:mb-4 [&_h2]:text-xl sm:[&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-left [&_h3]:mt-6 [&_h3]:mb-3 [&_h3]:text-lg sm:[&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-left [&_h4]:text-left [&_h5]:text-left [&_h6]:text-left [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-4 [&_li]:mb-1.5"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    );
  }

  return (
    <div className="mt-10 space-y-6 text-sm leading-6 sm:mt-16 sm:space-y-8 sm:text-base sm:leading-5">
      {post.content.map((section: any, index: number) =>
        section.title ? (
          <ArticleSection key={section.title} title={section.title}>
            {section.body.map((paragraph: string) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </ArticleSection>
        ) : (
          <div className="space-y-5" key={index}>
            {section.body.map((paragraph: string) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        ),
      )}
    </div>
  );
}

function ArticleSection({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  return (
    <section>
      <h2 className="text-xl font-bold sm:text-2xl">{title}</h2>
      <div className="mt-6 space-y-5">{children}</div>
    </section>
  );
}

function ShareBar() {
  const sharePlatforms = [
    { icon: FacebookIcon, label: "Share on Facebook" },
    { icon: TwitterIcon, label: "Share on Twitter" },
    { icon: Mail, label: "Share via Email" },
    { icon: InstagramIcon, label: "Share on Instagram" },
    { icon: LinkedinIcon, label: "Share on LinkedIn" },
  ];

  return (
    <div className="mx-auto mt-16 max-w-xs text-center sm:mt-24">
      <Separator className="mx-auto mb-6 w-16 bg-[#cfd4da] sm:mb-8" />
      <div className="flex flex-wrap justify-center gap-3 text-[#c7ccd3]">
        {sharePlatforms.map((item, index) => (
          <div className="group relative flex justify-center" key={index}>
            <Button
              aria-label={item.label}
              className="size-9 rounded-full border-[#d7dce2] bg-white p-0 text-[#c7ccd3] hover:bg-black hover:text-white transition-colors duration-200"
              size="icon"
              variant="outline"
            >
              <item.icon className="size-4" />
            </Button>
            <div className="pointer-events-none absolute bottom-full mb-2.5 z-50 flex flex-col items-center opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 ease-out origin-bottom">
              <div className="relative bg-black text-white text-xs px-2.5 py-1 rounded-md shadow-lg whitespace-nowrap font-medium font-satoshi">
                {item.label}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 -mt-[4px] w-2 h-2 bg-black rotate-45" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

async function ReadAlso({ currentSlug, category }: { currentSlug: string; category: string }) {
  let blogs: ApiBlog[] = [];

  if (category) {
    try {
      const response = await fetchLatestBlogs({ category, limit: 4 });
      blogs = (response.data || []).filter((b) => b.slug !== currentSlug).slice(0, 3);
    } catch (error) {
      console.warn("Failed to fetch related blogs from API:", error);
    }
  }

  // Fallback to static mock blogs
  if (blogs.length === 0) {
    const readAlso = getReadAlsoPosts(currentSlug);
    return (
      <section className="mt-16 sm:mt-24">
        <h2 className="text-3xl font-satoshi font-bold tracking-normal sm:text-4xl">
          Read Also
        </h2>
        <div className="-mx-4 mt-2 flex gap-4 overflow-x-auto p-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] sm:mx-0 sm:mt-8 sm:grid sm:grid-cols-3 sm:gap-6 sm:p-0 sm:overflow-visible">
          {readAlso.map((blog) => (
            <div key={blog.slug} className="w-[85%] shrink-0 snap-start sm:w-auto">
              <Link href={`/blog/${blog.slug}`} className="block h-full group">
              <Card
                className="relative h-full rounded-[5px] border-0 bg-white p-0 shadow-[0_0_10px_0_rgba(0,0,0,0.25)] transition-transform group-hover:scale-[1.02]"
              >
                <CardContent className="h-full flex flex-row items-center gap-4 p-4 sm:items-stretch sm:gap-6 sm:p-5">
                  <div className="relative size-24 shrink-0 overflow-hidden rounded-md sm:h-auto sm:w-[100px]">
                    <Image
                      src={blog.image}
                      alt={blog.heroAlt}
                      fill
                      sizes="(min-width: 640px) 100px, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col flex-1 justify-between mt-0">
                    <h3 className="text-sm font-satoshi font-bold leading-tight sm:text-lg sm:leading-6 line-clamp-2">
                      {blog.title}
                    </h3>
                    <div className="mt-2 sm:mt-4">
                      <p className="text-xs sm:text-sm text-black/60">
                        {blog.date} <span className="px-1.5">•</span> {blog.readTime}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              </Link>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mt-16 sm:mt-24">
      <h2 className="text-3xl font-satoshi font-bold tracking-normal sm:text-4xl">
        Read Also
      </h2>
      <div className="-mx-4 mt-2 flex gap-4 overflow-x-auto p-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] sm:mx-0 sm:mt-8 sm:grid sm:grid-cols-3 sm:gap-6 sm:p-0 sm:overflow-visible">
        {blogs.map((blog) => {
          const imageUrl = getBlogImageUrl(blog.imageUrl);
          return (
            <div key={blog.id} className="w-[85%] shrink-0 snap-start sm:w-auto">
              <Link href={`/blog/${blog.slug}`} className="block h-full group">
              <Card
                className="relative h-full rounded-[5px] border-0 bg-white p-0 shadow-[0_0_10px_0_rgba(0,0,0,0.25)] transition-transform group-hover:scale-[1.02]"
              >
                <CardContent className="h-full flex flex-row items-center gap-4 p-4 sm:items-stretch sm:gap-6 sm:p-5">
                  <div className="relative size-24 shrink-0 overflow-hidden rounded-md sm:h-auto sm:w-[100px] bg-gray-100">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={blog.title}
                        fill
                        sizes="(min-width: 640px) 100px, 100vw"
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <Image
                        src={blogImage}
                        alt={blog.title}
                        fill
                        sizes="(min-width: 640px) 100px, 100vw"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex flex-col flex-1 justify-between mt-0">
                    <h3 className="text-sm font-satoshi font-bold leading-tight sm:text-lg sm:leading-6 line-clamp-2">
                      {blog.title}
                    </h3>
                    <div className="mt-2 sm:mt-4">
                      <p className="text-xs sm:text-sm text-black/60">
                        {formatBlogDate(blog.createdAt)} <span className="px-1.5">•</span> {blog.readingTime} Min Read
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        height="17"
        rx="5"
        stroke="currentColor"
        strokeWidth="1.8"
        width="17"
        x="3.5"
        y="3.5"
      />
      <circle cx="12" cy="12" r="3.8" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.2" cy="6.8" fill="currentColor" r="1.1" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14 8.5h2V5h-2.4C10.9 5 9 6.8 9 9.5V12H7v3.5h2V21h3.8v-5.5h2.6L16 12h-3.2V9.8c0-.8.5-1.3 1.2-1.3Z"
        fill="currentColor"
      />
    </svg>
  );
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M21 6.3c-.7.3-1.4.5-2.2.6.8-.5 1.3-1.2 1.6-2.1-.7.4-1.5.8-2.4.9A3.7 3.7 0 0 0 11.6 9c0 .3 0 .6.1.8A10.5 10.5 0 0 1 4.1 6a3.7 3.7 0 0 0 1.1 5 3.6 3.6 0 0 1-1.7-.5v.1c0 1.8 1.3 3.3 3 3.7-.3.1-.7.1-1 .1-.2 0-.5 0-.7-.1.5 1.5 1.9 2.6 3.5 2.6A7.5 7.5 0 0 1 3 18.5 10.5 10.5 0 0 0 8.7 20c6.8 0 10.6-5.7 10.6-10.6v-.5c.7-.5 1.3-1.1 1.7-1.8Z"
        fill="currentColor"
      />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.5 9H3v12h3.5V9ZM4.8 7.4c1.1 0 1.9-.8 1.9-1.8s-.8-1.8-1.9-1.8S3 4.6 3 5.6s.7 1.8 1.8 1.8ZM21 14.2c0-3.2-1.7-5.4-4.5-5.4-1.8 0-2.9 1-3.4 1.9V9H9.7v12h3.5v-6.6c0-1.6.8-2.6 2.1-2.6 1.2 0 2.1.9 2.1 2.7V21H21v-6.8Z"
        fill="currentColor"
      />
    </svg>
  );
}
