"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, CheckCircle, ChevronRight, X } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { RentButton } from "@/components/ui/rent-button";
import { Product } from "@/lib/db/products";

interface Category {
  id: string;
  name: string;
  slug: string;
  product_count: number;
}

export default function ProductsClient({ 
  initialProducts, 
  categories, 
  activeStyle 
}: { 
  initialProducts: Product[]; 
  categories: Category[]; 
  activeStyle: string; 
}) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // Client-side filtering
  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.category_name || "").toLowerCase().includes(q)
      );
    }

    if (sortBy === "price-asc") {
      result.sort((a, b) => a.price_per_day - b.price_per_day);
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.price_per_day - a.price_per_day);
    }

    return result;
  }, [initialProducts, searchQuery, sortBy]);

  const totalProducts = useMemo(() => {
    return categories.reduce((sum, c) => sum + c.product_count, 0);
  }, [categories]);

  const handleStyleClick = (slug: string) => {
    if (slug) {
      router.push(`/products?style=${slug}`);
    } else {
      router.push("/products");
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    router.push("/products");
  };

  const activeCategoryName = categories.find((c) => c.slug === activeStyle)?.name;
  const hasFilters = activeStyle || searchQuery.trim();

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb + Header */}
      <div className="bg-gradient-to-br from-surface via-background to-surface/50 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
          <nav className="flex items-center gap-2 text-sm text-muted mb-3">
            <Link href="/" className="hover:text-primary transition-colors">Trang chủ</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-foreground font-medium">
              {activeCategoryName || "Thuê trang phục"}
            </span>
          </nav>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-1">
            {activeCategoryName ? `Style: ${activeCategoryName}` : "Thuê outfit Đà Lạt"}
          </h1>
          <p className="text-sm text-muted">
            <span className="font-semibold text-primary">{filteredProducts.length}</span> mẫu trang phục
            {activeCategoryName && ` theo phong cách ${activeCategoryName}`}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-60 shrink-0">
            <div className="sticky top-36 space-y-6">
              {/* Search */}
              <div>
                <label className="text-sm font-semibold text-foreground block mb-2">Tìm kiếm</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tên trang phục..."
                    className="input-field !pl-10 text-sm"
                    suppressHydrationWarning
                  />
                </div>
              </div>

              {/* Style Filter */}
              <div>
                <label className="text-sm font-semibold text-foreground block mb-2">Phong cách</label>
                <div className="space-y-1">
                  <button
                    onClick={() => handleStyleClick("")}
                    className={`flex items-center justify-between w-full px-3 py-2 text-sm rounded-lg transition-colors ${
                      !activeStyle
                        ? "bg-primary/10 text-primary font-semibold"
                        : "hover:bg-primary/5 hover:text-primary text-foreground/75"
                    }`}
                  >
                    <span>Tất cả</span>
                    <span className={`text-xs ${!activeStyle ? "text-primary" : "text-muted"}`}>
                      {totalProducts}
                    </span>
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.slug}
                      onClick={() => handleStyleClick(cat.slug)}
                      className={`flex items-center justify-between w-full px-3 py-2 text-sm rounded-lg transition-colors ${
                        activeStyle === cat.slug
                          ? "bg-primary/10 text-primary font-semibold"
                          : "hover:bg-primary/5 hover:text-primary text-foreground/75"
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className={`text-xs ${activeStyle === cat.slug ? "text-primary" : "text-muted"}`}>
                        {cat.product_count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  Xoá bộ lọc
                </button>
              )}
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {/* Sort Header */}
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-muted">
                Hiển thị <span className="font-semibold text-foreground">{filteredProducts.length}</span> sản phẩm
              </p>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-field w-auto text-sm py-2 px-3"
                suppressHydrationWarning
              >
                <option value="newest">Mới nhất</option>
                <option value="price-asc">Giá thấp → cao</option>
                <option value="price-desc">Giá cao → thấp</option>
              </select>
            </div>

            {/* Products */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-surface/50 rounded-2xl">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Không tìm thấy sản phẩm</h3>
                <p className="text-sm text-muted mb-4">Thử thay đổi bộ lọc hoặc tìm kiếm khác</p>
                <button onClick={clearFilters} className="btn-primary text-sm px-6 py-2.5">
                  Xoá bộ lọc
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-5">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="product-card group bg-white rounded-2xl overflow-hidden border border-border">
                    {/* Image */}
                    <Link href={`/products/${product.slug}`} className="block relative aspect-[3/4] bg-gradient-to-br from-surface to-surface-hover overflow-hidden">
                      {product.thumbnail_url ? (
                        <Image
                          src={product.thumbnail_url}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-6xl lg:text-7xl">👗</span>
                        </div>
                      )}
                      {/* Status */}
                      {product.status === "rented" ? (
                        <div className="absolute top-3 right-3 px-2 py-0.5 bg-orange-500/90 text-white text-[10px] font-semibold rounded-full">
                          Đang thuê
                        </div>
                      ) : (
                        <div className="absolute top-3 right-3 px-2 py-0.5 bg-green-500/90 text-white text-[10px] font-semibold rounded-full flex items-center gap-0.5">
                          <CheckCircle className="w-2.5 h-2.5" /> Còn đồ
                        </div>
                      )}
                      {/* Style Badge */}
                      <div className="absolute top-3 left-3 style-badge">{product.category_name}</div>
                    </Link>

                    {/* Info */}
                    <div className="p-3.5">
                      {product.color && (
                        <div className="text-[9px] font-medium text-muted bg-surface px-1.5 py-0.5 rounded inline-block mb-1">
                          {product.color}
                        </div>
                      )}
                      <Link href={`/products/${product.slug}`}>
                        <h3 className="text-sm font-semibold text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-1">
                          {product.name}
                        </h3>
                      </Link>
                      <div className="flex items-baseline gap-1 mb-3">
                        <span className="text-base font-bold text-primary">{formatPrice(product.price_per_day)}</span>
                        <span className="text-[10px] text-muted">/ngày</span>
                      </div>
                      <div className="flex gap-2">
                        <Link
                          href={`/products/${product.slug}`}
                          className="flex-1 text-center text-xs font-medium py-2 rounded-lg border border-border text-foreground/70 hover:border-primary hover:text-primary transition-colors"
                        >
                          Xem chi tiết
                        </Link>
                        <RentButton
                          productId={product.id}
                          disabled={product.status === "rented"}
                          className={`flex-1 text-center text-xs font-semibold py-2 rounded-lg transition-colors ${
                            product.status === "rented"
                              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                              : "bg-primary text-white hover:bg-primary-dark"
                          }`}
                        >
                          {product.status === "rented" ? "Hết đồ" : "Đặt thuê"}
                        </RentButton>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
