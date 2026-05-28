"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Upload, Plus, X, Save } from "lucide-react";

export default function AdminCreateProductPage() {
  const [sizes, setSizes] = useState<string[]>(["M"]);
  const [images, setImages] = useState<string[]>([]);

  const toggleSize = (size: string) => {
    setSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
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
        Thêm sản phẩm mới
      </h1>

      <form className="max-w-3xl space-y-6">
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
              placeholder="Ví dụ: Váy hoa nhí Vintage Đà Lạt"
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">
              Danh mục *
            </label>
            <select className="input-field" required>
              <option value="">Chọn danh mục</option>
              <option>Vintage Đà Lạt</option>
              <option>Nàng thơ</option>
              <option>Hàn Quốc</option>
              <option>Y2K</option>
              <option>Picnic</option>
              <option>Couple</option>
              <option>Nhóm bạn</option>
              <option>Công chúa</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">
              Mô tả
            </label>
            <textarea
              placeholder="Mô tả chi tiết sản phẩm..."
              className="input-field min-h-[120px] resize-none"
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
                placeholder="120000"
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">
                Tiền cọc (VNĐ)
              </label>
              <input
                type="number"
                placeholder="200000"
                className="input-field"
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
                placeholder="Nâu, be, hồng..."
                className="input-field"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">
                Số lượng *
              </label>
              <input
                type="number"
                placeholder="1"
                className="input-field"
                min={1}
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
              Đường dẫn ảnh (URL) *
            </label>
            <input
              type="url"
              placeholder="https://foikyihnyuthrnlteudt.supabase.co/storage/v1/object/public/..."
              className="input-field"
              required
            />
          </div>
          <p className="text-xs text-muted">
            Vui lòng dán đường link (URL) hình ảnh của bạn vào đây.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="btn-primary flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Lưu sản phẩm
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
