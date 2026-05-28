import { createClient } from "@/lib/supabase/server";

export interface Product {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string | null;
  price_per_day: number;
  deposit: number;
  color: string | null;
  quantity: number;
  status: string;
  thumbnail_url: string | null;
  created_at: string;
  // Joined fields
  category_name?: string;
  category_slug?: string;
}

export interface ProductWithImages extends Product {
  images: { id: string; image_url: string; sort_order: number }[];
}

export interface ProductFilters {
  categorySlug?: string;
  search?: string;
  status?: string;
  sort?: "newest" | "price-asc" | "price-desc";
  limit?: number;
}

export async function getProducts(filters?: ProductFilters): Promise<Product[]> {
  const supabase = await createClient();

  let query = supabase
    .from("products")
    .select("*, categories!inner(name, slug)")
    .order("created_at", { ascending: false });

  // Filter by category slug
  if (filters?.categorySlug) {
    query = query.eq("categories.slug", filters.categorySlug);
  }

  // Filter by status
  if (filters?.status) {
    query = query.eq("status", filters.status);
  }

  // Search by name
  if (filters?.search) {
    query = query.ilike("name", `%${filters.search}%`);
  }

  // Sort
  if (filters?.sort === "price-asc") {
    query = query.order("price_per_day", { ascending: true });
  } else if (filters?.sort === "price-desc") {
    query = query.order("price_per_day", { ascending: false });
  }

  // Limit
  if (filters?.limit) {
    query = query.limit(filters.limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error("getProducts error:", error.message);
    return [];
  }

  return (data || []).map((p: any) => ({
    ...p,
    category_name: p.categories?.name || "",
    category_slug: p.categories?.slug || "",
    categories: undefined,
  }));
}

export async function getProductBySlug(slug: string): Promise<ProductWithImages | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select("*, categories(name, slug), product_images(id, image_url, sort_order)")
    .eq("slug", slug)
    .single();

  if (error) return null;

  return {
    ...data,
    category_name: (data as any).categories?.name || "",
    category_slug: (data as any).categories?.slug || "",
    images: ((data as any).product_images || []).sort(
      (a: any, b: any) => a.sort_order - b.sort_order
    ),
    categories: undefined,
    product_images: undefined,
  } as any;
}

export async function getHotProducts(limit: number = 8): Promise<Product[]> {
  return getProducts({ limit, status: "available" });
}

export async function getProductCount(): Promise<number> {
  const supabase = await createClient();
  const { count } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true });
  return count || 0;
}

export async function getProductById(id: string): Promise<ProductWithImages | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select("*, product_images(id, image_url, sort_order)")
    .eq("id", id)
    .single();

  if (error) return null;
  
  return {
    ...data,
    images: ((data as any).product_images || []).sort(
      (a: any, b: any) => a.sort_order - b.sort_order
    ),
    product_images: undefined,
  } as any;
}

export async function updateProduct(id: string, updates: Partial<Product>) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}
