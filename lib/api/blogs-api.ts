const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export interface ApiBlog {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  content?: string;
  imageUrl?: string;
  category: string;
  readingTime: string;
  isPopular: boolean;
  createdAt: string;
  author?: {
    firstName: string;
    lastName: string;
  };
}

export interface BlogsResponse {
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
  data: ApiBlog[];
}

export interface GetBlogsParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
}

export async function fetchLatestBlogs(
  params: GetBlogsParams = {},
): Promise<BlogsResponse> {
  const { page = 1, limit = 10, search, category } = params;

  const query = new URLSearchParams();
  query.set("page", String(page));
  query.set("limit", String(limit));
  if (search) query.set("search", search);
  if (category) query.set("category", category);

  const response = await fetch(
    `${BASE_URL}/blogs/latest?${query.toString()}`,
    { next: { revalidate: 60 } },
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch blogs: ${response.statusText}`);
  }

  return response.json();
}

export async function fetchPopularBlogs(): Promise<ApiBlog[]> {
  const response = await fetch(`${BASE_URL}/blogs/popular`, {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch popular blogs: ${response.statusText}`);
  }

  return response.json();
}

export async function fetchBlogBySlug(slug: string): Promise<ApiBlog> {
  const response = await fetch(`${BASE_URL}/blogs/${slug}`, {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch blog: ${response.statusText}`);
  }

  return response.json();
}

/** Format ISO date string to human-readable date (e.g. "January 28, 2026") */
export function formatBlogDate(isoDate: string): string {
  try {
    return new Date(isoDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return isoDate;
  }
}

/** Build absolute image URL from a relative /uploads/... path.
 * Returns null for data: URIs (not supported by next/image) and missing values. */
export function getBlogImageUrl(imageUrl?: string | null): string | null {
  if (!imageUrl) return null;
  // data: URIs are not supported by next/image — fall back to placeholder
  if (imageUrl.startsWith("data:")) return null;
  if (imageUrl.startsWith("http")) return imageUrl;
  
  const cleanPath = imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`;
  return `${BASE_URL}${cleanPath}`;
}
