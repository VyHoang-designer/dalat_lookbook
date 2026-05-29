import { getProducts } from "@/lib/db/products";
import { createClient } from "@/lib/supabase/server";
import ProductsClient from "./client-page";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ style?: string; search?: string }>;
}) {
  const params = await searchParams;
  const activeStyle = params.style || "";
  const activeSearch = params.search || "";

  // Server-side fetch
  const products = await getProducts(activeStyle ? { categorySlug: activeStyle } : undefined);
  
  const supabase = await createClient();
  const { data: cats } = await supabase
    .from("categories")
    .select("id, name, slug, products(count)")
    .order("sort_order");

  const categories = (cats || []).map((c: any) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    product_count: c.products?.[0]?.count || 0,
  }));

  return (
    <ProductsClient
      initialProducts={products}
      categories={categories}
      activeStyle={activeStyle}
      initialSearch={activeSearch}
    />
  );
}
