"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Save, Plus, X } from "lucide-react";
import { updateProductAction } from "./actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Product } from "@/lib/db/products";
import { Category } from "@/lib/db/categories";

export default function EditProductForm({ product, categories }: { product: any, categories: Category[] }) {
  const router = useRouter();
  const [sizes, setSizes] = useState<string[]>(["M"]); // Assuming size M as default if not implemented in db
  const [loading, setLoading] = useState(false);
  const [additionalImages, setAdditionalImages] = useState<string[]>(
    product.images ? product.images.map((img: any) => img.image_url) : []
  );

  const toggleSize = (size: string) => {
    setSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const result = await updateProductAction(product.id, formData);
    
    setLoading(false);
    
    if (result.success) {
      toast.success("Cập nhật sản phẩm thành công!");
      router.push("/admin/products");
    } else {
      toast.error("Lỗi cập nhật: " + result.error);
    }
  };

  return (
    <div>
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-primary transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Quay lại danh sách
      </Link>

      <h1 className="text-2xl font-bold text-foreground mb-8">
        Cập nhật sản phẩm
      </h1>

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-2xl p-6 border border-border space-y-5">
          <h2 className="text-sm font-semibold text-foreground">
            Thông tin cơ bản
          </h2>

          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">
              Tên sản phẩm *
            </label>
            <input
              type="text"
              name="name"
              placeholder="Ví dụ: Váy hoa nhí Vintage Đà Lạt"
              className="input-field"
              defaultValue={product.name}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">
              Danh mục *
            </label>
            <select name="category_id" className="input-field" required defaultValue={product.category_id}>
              <option value="">Chọn danh mục</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">
              Mô tả
            </label>
            <textarea
              name="description"
              placeholder="Mô tả chi tiết sản phẩm..."
              className="input-field min-h-[120px] resize-none"
              defaultValue={product.description || ""}
            />
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-2xl p-6 border border-border space-y-5">
          <h2 className="text-sm font-semibold text-foreground">
            Giá & Kích thước
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">
                Giá thuê/ngày (VNĐ) *
              </label>
              <input
                type="number"
                name="price_per_day"
                placeholder="120000"
                className="input-field"
                defaultValue={product.price_per_day}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">
                Tiền cọc (VNĐ)
              </label>
              <input
                type="number"
                name="deposit"
                placeholder="200000"
                className="input-field"
                defaultValue={product.deposit}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">
                Màu sắc
              </label>
              <input
                type="text"
                name="color"
                placeholder="Nâu, be, hồng..."
                className="input-field"
                defaultValue={product.color || ""}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">
                Số lượng *
              </label>
              <input
                type="number"
                name="quantity"
                placeholder="1"
                className="input-field"
                min={1}
                defaultValue={product.quantity}
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Size *
            </label>
            <div className="flex gap-3">
              {["S", "M", "L", "XL", "Freesize"].map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleSize(size)}
                  className={`px-4 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                    sizes.includes(size)
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border text-foreground/70 hover:border-primary/30"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-2xl p-6 border border-border space-y-5">
          <h2 className="text-sm font-semibold text-foreground">
            Hình ảnh sản phẩm
          </h2>

          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">
              Ảnh đại diện (URL) *
            </label>
            <input
              type="url"
              name="thumbnail_url"
              placeholder="https://foikyihnyuthrnlteudt.supabase.co/storage/v1/object/public/..."
              className="input-field"
              defaultValue={product.thumbnail_url || ""}
              required
            />
            <p className="text-[11px] text-muted mt-1.5">
              Hình ảnh này sẽ hiển thị ở trang chủ và danh sách sản phẩm.
            </p>
          </div>

          <div className="pt-4 border-t border-border">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-foreground">
                Ảnh chi tiết khác (URL)
              </label>
              <button 
                type="button" 
                onClick={() => setAdditionalImages([...additionalImages, ""])}
                className="text-xs font-semibold text-primary hover:text-primary-dark transition-colors flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                Thêm ảnh
              </button>
            </div>
            
            <div className="space-y-3">
              {additionalImages.map((url, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="url"
                    name="product_images"
                    placeholder="https://..."
                    className="input-field flex-1"
                    value={url}
                    onChange={(e) => {
                      const newImages = [...additionalImages];
                      newImages[idx] = e.target.value;
                      setAdditionalImages(newImages);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newImages = [...additionalImages];
                      newImages.splice(idx, 1);
                      setAdditionalImages(newImages);
                    }}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                    title="Xóa ảnh này"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {additionalImages.length === 0 && (
                <p className="text-[11px] text-muted italic">Chưa có ảnh chi tiết nào. Các ảnh thêm ở đây sẽ hiển thị bên dưới ảnh đại diện khi khách hàng xem chi tiết sản phẩm.</p>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {loading ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
          <Link
            href="/admin/products"
            className="btn-outline"
          >
            Hủy
          </Link>
        </div>
      </form>
    </div>
  );
}
