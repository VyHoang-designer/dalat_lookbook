import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  FolderOpen,
  Settings,
  LogOut,
  ChevronRight,
  MessageCircle,
  Star
} from "lucide-react";

const ADMIN_NAV = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Sản phẩm", href: "/admin/products", icon: Package },
  { name: "Đơn thuê", href: "/admin/orders", icon: ShoppingBag },
  { name: "Danh mục", href: "/admin/categories", icon: FolderOpen },
  { name: "Khách hàng", href: "/admin/customers", icon: Users },
  { name: "Đánh giá", href: "/admin/reviews", icon: Star },
  { name: "Hỗ trợ", href: "/admin/support", icon: MessageCircle },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:top-16 bg-white border-r border-border z-40">
        <div className="flex flex-col flex-1 pt-6 pb-4 overflow-y-auto">
          {/* Admin Header */}
          <div className="px-6 mb-6">
            <h2 className="text-lg font-bold text-foreground">Quản trị</h2>
            <p className="text-xs text-muted mt-0.5">
              Dalat Lookbook Admin Panel
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 space-y-1">
            {ADMIN_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-foreground/70 hover:text-primary hover:bg-primary/5 rounded-xl transition-colors group"
              >
                <item.icon className="w-4.5 h-4.5 shrink-0" />
                <span>{item.name}</span>
                <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </nav>

          {/* Bottom */}
          <div className="px-3 mt-auto pt-4 border-t border-border mx-3">
            <button className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl transition-colors">
              <LogOut className="w-4.5 h-4.5" />
              Đăng xuất
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:pl-64">
        <div className="p-6 lg:p-8">{children}</div>
      </div>
    </div>
  );
}
