import { type ClassValue, clsx } from "clsx";

// Simple cn utility without tailwind-merge (keeping deps minimal)
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const ORDER_STATUS_MAP: Record<string, { label: string; color: string }> = {
  awaiting_deposit: { label: "Chờ xác nhận cọc", color: "bg-orange-100 text-orange-800" },
  pending: { label: "Chờ xác nhận", color: "bg-yellow-100 text-yellow-800" },
  confirmed: { label: "Đã xác nhận", color: "bg-blue-100 text-blue-800" },
  renting: { label: "Đang thuê", color: "bg-purple-100 text-purple-800" },
  completed: { label: "Hoàn tất", color: "bg-green-100 text-green-800" },
  cancelled: { label: "Đã hủy", color: "bg-red-100 text-red-800" },
};

export const PRODUCT_STATUS_MAP: Record<string, { label: string; color: string }> = {
  available: { label: "Còn hàng", color: "bg-green-100 text-green-800" },
  rented: { label: "Đang thuê", color: "bg-orange-100 text-orange-800" },
  hidden: { label: "Đã ẩn", color: "bg-gray-100 text-gray-800" },
};
