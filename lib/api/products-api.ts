const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export interface ApiProduct {
  id: string;
  title: string;
  subtitle: string;
  slug: string;
  price: number;
  imageUrl?: string | null;
  imageUrls: string[];
  collectionTypes: string[];
  productType: string;
  flavourAndAroma?: string | null;
  effectProfile?: string | null;
  strainType?: string | null;
  description?: string | null;
  customSections?: { id?: string; title: string; content: string }[] | string | null;
  summary?: string | null;
  quantity: number;
  packSizes?: { label: string; price: number }[] | string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
  data: ApiProduct[];
}

export interface GetProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  collection?: string;
  type?: string;
}

export async function fetchProducts(
  params: GetProductsParams = {},
): Promise<ProductsResponse> {
  const { page = 1, limit = 10, search, collection, type } = params;

  const query = new URLSearchParams();
  query.set("page", String(page));
  query.set("limit", String(limit));
  if (search) query.set("search", search);
  if (collection) query.set("collection", collection);
  if (type) query.set("type", type);

  const response = await fetch(
    `${BASE_URL}/products?${query.toString()}`,
    { next: { revalidate: 60 } },
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.statusText}`);
  }

  return response.json();
}

export async function fetchProductBySlug(slug: string): Promise<ApiProduct> {
  const response = await fetch(`${BASE_URL}/products/detail/${slug}`, {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch product: ${response.statusText}`);
  }

  return response.json();
}

/** Build absolute image URL from a relative /uploads/... path. */
export function getProductImageUrl(imageUrl?: string | null): string | null {
  if (!imageUrl) return null;
  if (imageUrl.startsWith("data:")) return null;
  if (imageUrl.startsWith("http")) return imageUrl;
  
  const cleanPath = imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`;
  return `${BASE_URL}${cleanPath}`;
}
