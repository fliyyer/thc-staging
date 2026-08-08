"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchLatestBlogs,
  fetchPopularBlogs,
  type GetBlogsParams,
} from "@/lib/api/blogs-api";

export const blogKeys = {
  all: ["blogs"] as const,
  latest: (params?: GetBlogsParams) => ["blogs", "latest", params] as const,
  popular: () => ["blogs", "popular"] as const,
};

export function useLatestBlogs(params?: GetBlogsParams) {
  return useQuery({
    queryKey: blogKeys.latest(params),
    queryFn: () => fetchLatestBlogs(params),
    staleTime: 60_000, // 1 minute
  });
}

export function usePopularBlogs() {
  return useQuery({
    queryKey: blogKeys.popular(),
    queryFn: () => fetchPopularBlogs(),
    staleTime: 60_000, // 1 minute
  });
}
