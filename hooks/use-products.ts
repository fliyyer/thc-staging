"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchProducts,
  fetchProductBySlug,
  type GetProductsParams,
} from "@/lib/api/products-api";

export const productKeys = {
  all: ["products"] as const,
  list: (params?: GetProductsParams) => ["products", "list", params] as const,
  detail: (slug: string) => ["products", "detail", slug] as const,
};

export function useProducts(params?: GetProductsParams) {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => fetchProducts(params),
    staleTime: 60_000, // 1 minute
  });
}

export function useProductBySlug(slug: string) {
  return useQuery({
    queryKey: productKeys.detail(slug),
    queryFn: () => fetchProductBySlug(slug),
    staleTime: 60_000, // 1 minute
  });
}
