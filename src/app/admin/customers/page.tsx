import { Shield, Users, Mail, Phone, Calendar } from "lucide-react";
import { getCustomers } from "@/lib/db/customers";
import { formatDate } from "@/lib/utils";

export default async function AdminCustomersPage() {
  const customers = await getCustomers();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Khách hàng</h1>
        <p className="text-sm text-muted mt-1">
          Quản lý danh sách khách hàng đã đăng ký
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-5 border border-border">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-purple-500 flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">
                {customers.length}
              </div>
              <div className="text-xs text-muted">Tổng khách hàng</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-border">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">
                {customers.filter((c) => c.order_count && c.order_count > 0).length}
              </div>
              <div className="text-xs text-muted">Có đơn thuê</div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Table */}
      <div className="bg-white rounded-2xl border border-border">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-base font-semibold text-foreground">
            Danh sách khách hàng
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-3">
                  Khách hàng
                </th>
                <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-3">
                  SĐT
                </th>
                <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-3">
                  Đơn thuê
                </th>
                <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-3">
                  Ngày tham gia
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-sm text-muted">
                    Chưa có khách hàng nào
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="hover:bg-surface/50 transition-colors"
                  >
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                          <span className="text-white text-xs font-bold">
                            {(customer.full_name || "?")[0]}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-foreground">
                          {customer.full_name || "Chưa đặt tên"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-1.5 text-sm text-foreground/70">
                        <Phone className="w-3.5 h-3.5" />
                        {customer.phone || "—"}
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-sm font-medium text-primary">
                      {customer.order_count || 0} đơn
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-1.5 text-sm text-muted">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(customer.created_at)}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
