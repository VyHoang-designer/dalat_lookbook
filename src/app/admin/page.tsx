import {
  Package,
  ShoppingBag,
  Users,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";
import { formatPrice, ORDER_STATUS_MAP } from "@/lib/utils";
import { getProducts } from "@/lib/db/products";
import { getOrders, getOrderStats } from "@/lib/db/orders";
import { getCustomerCount } from "@/lib/db/customers";

const STATUS_MAP: Record<string, { label: string; color: string }> = ORDER_STATUS_MAP;

export default async function AdminDashboard() {
  const [products, recentOrders, stats, customerCount] = await Promise.all([
    getProducts(),
    getOrders(),
    getOrderStats(),
    getCustomerCount(),
  ]);

  const STATS = [
    {
      label: "Tổng sản phẩm",
      value: String(products.length),
      change: `${products.filter((p) => p.status === "available").length} còn hàng`,
      icon: Package,
      color: "bg-blue-500",
    },
    {
      label: "Đơn thuê",
      value: String(stats.totalOrders),
      change: `${stats.pendingOrders} chờ duyệt`,
      icon: ShoppingBag,
      color: "bg-green-500",
    },
    {
      label: "Khách hàng",
      value: String(customerCount),
      change: "Đã đăng ký",
      icon: Users,
      color: "bg-purple-500",
    },
    {
      label: "Doanh thu",
      value: formatPrice(stats.revenue),
      change: `${stats.rentingOrders} đang thuê`,
      icon: TrendingUp,
      color: "bg-amber-500",
    },
  ];

  const top5Orders = recentOrders.slice(0, 5);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted mt-1">
          Tổng quan hoạt động Dalat Lookbook
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STATS.map((stat, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-5 border border-border hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center`}
              >
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-[11px] text-green-600 font-medium flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" />
                {stat.change}
              </span>
            </div>
            <div className="text-2xl font-bold text-foreground mb-0.5">
              {stat.value}
            </div>
            <div className="text-xs text-muted">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-border">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Đơn thuê gần đây
            </h2>
            <p className="text-xs text-muted mt-0.5">
              Các đơn thuê mới nhất cần xử lý
            </p>
          </div>
          <a
            href="/admin/orders"
            className="text-xs font-medium text-primary hover:underline"
          >
            Xem tất cả →
          </a>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-3">
                  Khách hàng
                </th>
                <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-3">
                  Sản phẩm
                </th>
                <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-3">
                  Tổng tiền
                </th>
                <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-3">
                  Trạng thái
                </th>
                <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-3">
                  Ngày thuê
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {top5Orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sm text-muted">
                    Chưa có đơn thuê nào
                  </td>
                </tr>
              ) : (
                top5Orders.map((order) => {
                  const statusInfo = STATUS_MAP[order.status];
                  return (
                    <tr key={order.id} className="hover:bg-surface/50 transition-colors">
                      <td className="px-6 py-3.5">
                        <div className="text-sm font-medium text-foreground">{order.customer_name}</div>
                        <div className="text-xs text-muted">{order.phone}</div>
                      </td>
                      <td className="px-6 py-3.5 text-sm text-foreground/80">
                        {order.product_name}
                      </td>
                      <td className="px-6 py-3.5 text-sm font-medium text-primary">
                        {formatPrice(order.total_price)}
                      </td>
                      <td className="px-6 py-3.5">
                        <span
                          className={`inline-block px-2.5 py-1 text-[11px] font-semibold rounded-full ${statusInfo?.color}`}
                        >
                          {statusInfo?.label}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-sm text-muted">
                        {order.start_date} → {order.end_date}
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
