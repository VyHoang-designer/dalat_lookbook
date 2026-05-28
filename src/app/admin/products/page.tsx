import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Trash2, Eye, Search } from "lucide-react";
import { formatPrice, PRODUCT_STATUS_MAP } from "@/lib/utils";
import { getProducts } from "@/lib/db/products";

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Quản lý sản phẩm</h1>
          <p className="text-sm text-muted mt-1">
            {products.length} sản phẩm trong hệ thống
          </p>
        </div>
        <Link
          href="/admin/products/create"
          className="btn-primary flex items-center gap-2 text-sm"
        >
          <Plus className="w-4 h-4" />
          Thêm sản phẩm
        </Link>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-surface/50">
                <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-3">
                  Sản phẩm
                </th>
                <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-3">
                  Danh mục
                </th>
                <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-3">
                  Giá/ngày
                </th>
                <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-3">
                  Màu sắc
                </th>
                <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-3">
                  SL
                </th>
                <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-3">
                  Trạng thái
                </th>
                <th className="text-right text-xs font-semibold text-muted uppercase tracking-wider px-6 py-3">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-sm text-muted">
                    Chưa có sản phẩm nào
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const statusInfo = PRODUCT_STATUS_MAP[product.status];
                  return (
                    <tr key={product.id} className="hover:bg-surface/30 transition-colors">
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-surface overflow-hidden relative shrink-0">
                            {product.thumbnail_url ? (
                              <Image
                                src={product.thumbnail_url}
                                alt={product.name}
                                fill
                                className="object-cover"
                                sizes="40px"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xl">👗</div>
                            )}
                          </div>
                          <span className="text-sm font-medium text-foreground line-clamp-1">
                            {product.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-3.5 text-sm text-foreground/80">
                        {product.category_name}
                      </td>
                      <td className="px-6 py-3.5 text-sm font-medium text-primary">
                        {formatPrice(product.price_per_day)}
                      </td>
                      <td className="px-6 py-3.5 text-sm text-foreground/80">
                        {product.color || "—"}
                      </td>
                      <td className="px-6 py-3.5 text-sm text-foreground/80">
                        {product.quantity}
                      </td>
                      <td className="px-6 py-3.5">
                        <span className={`px-2.5 py-1 text-[11px] font-semibold rounded-full ${statusInfo?.color}`}>
                          {statusInfo?.label}
                        </span>
                      </td>
                      <td className="px-6 py-3.5">
                        <div className="flex items-center justify-end gap-1">
                          <Link href={`/products/${product.slug}`} className="p-2 hover:bg-surface rounded-lg transition-colors text-muted hover:text-foreground" title="Xem">
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link href={`/admin/products/${product.id}`} className="p-2 hover:bg-surface rounded-lg transition-colors text-muted hover:text-primary" title="Sửa">
                            <Pencil className="w-4 h-4" />
                          </Link>
                          <button className="p-2 hover:bg-red-50 rounded-lg transition-colors text-muted hover:text-red-500" title="Xóa">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
