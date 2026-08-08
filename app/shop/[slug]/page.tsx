import { notFound } from "next/navigation";

import { ProductDetailPage } from "@/components/product/product-detail-page";
import { fetchProductBySlug, fetchProducts } from "@/lib/api/products-api";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  try {
    const res = await fetchProducts({ limit: 100 });
    return res.data.map((product) => ({
      slug: product.slug,
    }));
  } catch (err) {
    console.error("Failed to generate static params for products:", err);
    return [];
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  try {
    const product = await fetchProductBySlug(slug);
    if (!product) {
      notFound();
    }
    return <ProductDetailPage product={product} />;
  } catch (err) {
    console.error(`Failed to fetch product details for slug: ${slug}`, err);
    notFound();
  }
}
