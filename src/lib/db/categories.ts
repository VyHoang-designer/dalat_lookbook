import { createClient } from "@/lib/supabase/server";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  created_at: string;
  product_count?: number;
}

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();

  // Lấy categories kèm count products
  const { data: categories, error } = await supabase
    .from("categories")
    .select("*, products(count)")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("getCategories error:", error.message);
    return [];
  }

  return (categories || []).map((cat: any) => ({
    ...cat,
    product_count: cat.products?.[0]?.count || 0,
    products: undefined,
  }));
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) return null;
  return data;
}
