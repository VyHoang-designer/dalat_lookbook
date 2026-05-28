"use server";

import { updateProduct } from "@/lib/db/products";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateProductAction(id: string, formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const category_id = formData.get("category_id") as string;
    const description = formData.get("description") as string;
    const price_per_day = parseInt(formData.get("price_per_day") as string);
    const deposit = parseInt(formData.get("deposit") as string) || 0;
    const color = formData.get("color") as string;
    const quantity = parseInt(formData.get("quantity") as string) || 1;
    const thumbnail_url = formData.get("thumbnail_url") as string;
    const productImages = formData.getAll("product_images") as string[];

    const updates = {
      name,
      category_id,
      description,
      price_per_day,
      deposit,
      color,
      quantity,
      thumbnail_url,
    };

    await updateProduct(id, updates);

    // Cập nhật album ảnh phụ
    const supabase = await createClient();
    
    // 1. Xóa ảnh cũ
    const { error: deleteError } = await supabase.from("product_images").delete().eq("product_id", id);
    if (deleteError) {
      console.error("Delete images error:", deleteError);
      throw new Error("Lỗi xóa ảnh cũ: " + deleteError.message);
    }
    
    // 2. Thêm ảnh mới
    const imagesToInsert = productImages
      .filter((url) => url.trim() !== "")
      .map((url, index) => ({
        product_id: id,
        image_url: url.trim(),
        sort_order: index + 1,
      }));

    if (imagesToInsert.length > 0) {
      const { error: insertError } = await supabase.from("product_images").insert(imagesToInsert);
      if (insertError) {
        console.error("Insert images error:", insertError);
        throw new Error("Lỗi thêm ảnh mới: " + insertError.message);
      }
    }

    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${id}`);
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
