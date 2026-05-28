import { Plus, Pencil, Trash2 } from "lucide-react";
import { getCategories } from "@/lib/db/categories";

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Quản lý danh mục</h1>
          <p className="text-sm text-muted mt-1">
            {categories.length} phong cách trang phục
          </p>
        </div>
        <button className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" />
          Thêm danh mục
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.length === 0 ? (
          <div className="col-span-full text-center py-8 text-sm text-muted">
            Chưa có danh mục nào
          </div>
        ) : (
          categories.map((cat) => (
            <div key={cat.id} className="bg-white rounded-2xl p-5 border border-border hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-foreground">{cat.name}</h3>
                  <p className="text-xs text-muted">{cat.slug}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-1.5 hover:bg-surface rounded-lg transition-colors text-muted hover:text-foreground" title="Sửa">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button className="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-muted hover:text-red-500" title="Xóa">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-foreground/70 mb-3 line-clamp-2">{cat.description}</p>
              <div className="text-xs text-muted">
                <span className="font-semibold text-primary">{cat.product_count || 0}</span> sản phẩm
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
