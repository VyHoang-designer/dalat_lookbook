import { createClient } from "../supabase/server";

export interface Banner {
  id: string;
  image_url: string;
  sort_order: number;
  created_at: string;
}

export async function getBanners(): Promise<Banner[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("banners")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching banners:", error);
    return [];
  }

  return data as Banner[];
}
