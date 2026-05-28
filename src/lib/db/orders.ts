"use server";

import { createClient } from "@/lib/supabase/server";

export interface RentalOrder {
  id: string;
  user_id: string;
  product_id: string;
  start_date: string;
  end_date: string;
  rental_days: number;
  total_price: number;
  customer_name: string;
  phone: string;
  delivery_address: string | null;
  delivery_date: string | null;
  note: string | null;
  status: string;
  deposit_status?: string;
  deposit_amount?: number;
  extension_count?: number;
  original_end_date?: string | null;
  extra_fee?: number;
  created_at: string;
  // Joined
  product_name?: string;
  product_thumbnail?: string;
  product_price?: number;
}

export async function getOrders(statusFilter?: string): Promise<RentalOrder[]> {
  const supabase = await createClient();

  let query = supabase
    .from("rental_orders")
    .select("*, products(name, thumbnail_url, price_per_day)")
    .order("created_at", { ascending: false });

  if (statusFilter && statusFilter !== "all") {
    query = query.eq("status", statusFilter);
  }

  const { data, error } = await query;

  if (error) {
    console.error("getOrders error:", error.message);
    return [];
  }

  return (data || []).map((o: any) => ({
    ...o,
    product_name: o.products?.name || "",
    product_thumbnail: o.products?.thumbnail_url || "",
    products: undefined,
  }));
}

export async function getUserOrders(userId: string): Promise<RentalOrder[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("rental_orders")
    .select("*, products(name, thumbnail_url, price_per_day)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getUserOrders error:", error.message);
    return [];
  }

  return (data || []).map((o: any) => ({
    ...o,
    product_name: o.products?.name || "",
    product_thumbnail: o.products?.thumbnail_url || "",
    products: undefined,
  }));
}

export async function getOrderById(orderId: string): Promise<RentalOrder | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("rental_orders")
    .select("*, products(name, thumbnail_url, price_per_day)")
    .eq("id", orderId)
    .single();

  if (error || !data) {
    console.error("getOrderById error:", error?.message);
    return null;
  }

  return {
    ...data,
    product_name: data.products?.name || "",
    product_thumbnail: data.products?.thumbnail_url || "",
    product_price: data.products?.price_per_day || 0,
    products: undefined,
  };
}

export async function updateOrderStatus(orderId: string, status: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("rental_orders")
    .update({ status })
    .eq("id", orderId);

  if (error) {
    console.error("updateOrderStatus error:", error.message);
    return { error: error.message };
  }
  return { success: true };
}

export async function confirmDeposit(orderId: string, productId: string) {
  const supabase = await createClient();

  // Update order status
  const { error } = await supabase
    .from("rental_orders")
    .update({ 
      deposit_status: "confirmed",
      status: "pending" // Chuyển về trạng thái chờ duyệt đơn sau khi đã cọc
    })
    .eq("id", orderId);

  if (error) {
    console.error("confirmDeposit error:", error.message);
    return { error: error.message };
  }

  // Giảm số lượng sản phẩm
  await supabase.rpc("decrement_product_quantity", { p_id: productId });

  return { success: true };
}
export async function getOrderStats() {
  const supabase = await createClient();

  const { count: totalOrders } = await supabase
    .from("rental_orders")
    .select("*", { count: "exact", head: true });

  const { count: pendingOrders } = await supabase
    .from("rental_orders")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending");

  const { count: rentingOrders } = await supabase
    .from("rental_orders")
    .select("*", { count: "exact", head: true })
    .eq("status", "renting");

  // Revenue = tổng total_price của đơn completed + renting + confirmed
  const { data: revenueData } = await supabase
    .from("rental_orders")
    .select("total_price")
    .in("status", ["completed", "renting", "confirmed"]);

  const revenue = (revenueData || []).reduce((sum: number, o: any) => sum + (o.total_price || 0), 0);
  return {
    totalOrders: totalOrders || 0,
    pendingOrders: pendingOrders || 0,
    rentingOrders: rentingOrders || 0,
    revenue,
  };
}

export async function checkRentalConflict({
  productId,
  currentOrderId,
  oldEndDate,
  newEndDate,
}: {
  productId: string;
  currentOrderId: string;
  oldEndDate: string;
  newEndDate: string;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("rental_orders")
    .select("id")
    .eq("product_id", productId)
    .neq("id", currentOrderId)
    .in("status", ["pending", "confirmed", "renting"])
    .lt("start_date", newEndDate)
    .gt("end_date", oldEndDate);

  if (error) {
    console.error("checkRentalConflict error:", error.message);
    throw new Error("Lỗi khi kiểm tra lịch thuê");
  }

  return data && data.length > 0;
}

export async function extendOrder(orderId: string, newEndDate: string, userId: string) {
  const order = await getOrderById(orderId);

  if (!order) {
    throw new Error("Không tìm thấy đơn hàng");
  }

  if (order.user_id !== userId) {
    throw new Error("Bạn không có quyền gia hạn đơn này");
  }

  if (!["confirmed", "renting"].includes(order.status)) {
    throw new Error("Đơn hàng hiện không thể gia hạn");
  }

  if (new Date(newEndDate) <= new Date(order.end_date)) {
    throw new Error("Ngày trả mới phải sau ngày trả hiện tại");
  }

  const isConflict = await checkRentalConflict({
    productId: order.product_id,
    currentOrderId: order.id,
    oldEndDate: order.end_date,
    newEndDate,
  });

  if (isConflict) {
    throw new Error("Sản phẩm đã có khách khác đặt trong thời gian này");
  }

  const diffTime = Math.abs(new Date(newEndDate).getTime() - new Date(order.end_date).getTime());
  const extraDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const extraAmount = extraDays * (order.product_price || 0);

  const supabase = await createClient();

  // Cập nhật đơn hàng
  const { error: updateError } = await supabase
    .from("rental_orders")
    .update({
      end_date: newEndDate,
      total_price: Number(order.total_price) + extraAmount,
      extra_fee: Number(order.extra_fee || 0) + extraAmount,
      extension_count: Number(order.extension_count || 0) + 1,
      original_end_date: order.original_end_date || order.end_date,
      rental_days: Number(order.rental_days || 1) + extraDays,
    })
    .eq("id", order.id);

  if (updateError) {
    throw new Error("Lỗi khi cập nhật đơn hàng: " + updateError.message);
  }

  // Lưu lịch sử gia hạn
  const { error: extError } = await supabase
    .from("order_extensions")
    .insert({
      order_id: order.id,
      user_id: userId,
      old_end_date: order.end_date,
      new_end_date: newEndDate,
      extra_days: extraDays,
      extra_amount: extraAmount,
      status: "approved",
    });
    
  if (extError) {
    console.error("Order extension history log error:", extError.message);
  }
  
  const { revalidatePath } = require("next/cache");
  revalidatePath("/my-orders/" + order.id);
  revalidatePath("/my-orders");

  return {
    success: true,
    message: "Gia hạn đơn hàng thành công",
    extraDays,
    extraAmount,
    newEndDate,
  };
}
