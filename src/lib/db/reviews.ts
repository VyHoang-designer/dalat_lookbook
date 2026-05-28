"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface ReviewData {
  orderId: string;
  productId: string;
  rating: number;
  comment: string;
  locationName?: string;
  imageUrl?: string;
}

export async function createReview(data: ReviewData, userId: string, customerName: string) {
  const supabase = await createClient();

  // Check if review already exists for this order
  const { data: existingReview } = await supabase
    .from("reviews")
    .select("id")
    .eq("order_id", data.orderId)
    .single();

  if (existingReview) {
    throw new Error("Bạn đã đánh giá đơn hàng này rồi.");
  }

  const { error } = await supabase
    .from("reviews")
    .insert({
      user_id: userId,
      order_id: data.orderId,
      product_id: data.productId,
      customer_name: customerName,
      rating: data.rating,
      comment: data.comment,
      location_name: data.locationName,
      image_url: data.imageUrl,
    });

  if (error) {
    console.error("Lỗi khi gửi đánh giá:", error.message);
    throw new Error("Đã có lỗi xảy ra. Vui lòng thử lại sau.");
  }

  revalidatePath("/my-orders/" + data.orderId);
  revalidatePath("/");
  
  return { success: true };
}

export async function getFeaturedReviews() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("reviews")
    .select(`
      id,
      customer_name,
      rating,
      comment,
      image_url,
      location_name,
      created_at,
      products (
        name
      )
    `)
    .eq("is_visible", true)
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(6);

  if (error) {
    console.error("Lỗi lấy danh sách đánh giá:", error.message);
    return [];
  }

  return data.map((review: any) => ({
    id: review.id,
    name: review.customer_name,
    rating: review.rating,
    comment: review.comment,
    imageUrl: review.image_url,
    location: review.location_name,
    date: review.created_at,
    outfit: review.products?.name || "Outift Lookbook",
  }));
}

export async function getReviewByOrderId(orderId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("order_id", orderId)
    .maybeSingle();

  if (error) {
    console.error("Lỗi kiểm tra đánh giá:", error.message);
    return null;
  }

  return data;
}

export async function getAllReviews() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("reviews")
    .select(`
      *,
      products ( name )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Lỗi lấy danh sách đánh giá (Admin):", error.message);
    return [];
  }

  return data;
}

export async function toggleReviewVisibility(reviewId: string, isVisible: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("reviews")
    .update({ is_visible: isVisible })
    .eq("id", reviewId);

  if (error) {
    throw new Error(error.message);
  }
  revalidatePath("/admin/reviews");
  revalidatePath("/");
  return { success: true };
}

export async function toggleReviewFeatured(reviewId: string, isFeatured: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("reviews")
    .update({ is_featured: isFeatured })
    .eq("id", reviewId);

  if (error) {
    throw new Error(error.message);
  }
  revalidatePath("/admin/reviews");
  revalidatePath("/");
  return { success: true };
}
