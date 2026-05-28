import { Eye, Check, X, Clock } from "lucide-react";
import { formatPrice, formatDate, ORDER_STATUS_MAP } from "@/lib/utils";
import { getOrders, updateOrderStatus } from "@/lib/db/orders";
import { revalidatePath } from "next/cache";

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  async function handleUpdateStatus(formData: FormData) {
    "use server";
    const orderId = formData.get("orderId") as string;
    const status = formData.get("status") as string;
    await updateOrderStatus(orderId, status);
    revalidatePath("/admin/orders");
    revalidatePath("/admin");
  }

  async function handleConfirmDeposit(formData: FormData) {
    "use server";
    const orderId = formData.get("orderId") as string;
    const productId = formData.get("productId") as string;
    const { confirmDeposit } = await import("@/lib/db/orders");
    await confirmDeposit(orderId, productId);
    revalidatePath("/admin/orders");
    revalidatePath("/admin");
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Quản lý đơn thuê</h1>
        <p className="text-sm text-muted mt-1">
          {orders.length} đơn thuê · Duyệt, cập nhật trạng thái đơn thuê trang phục
        </p>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-surface/50">
                <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-5 py-3">Khách hàng</th>
                <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-5 py-3">Sản phẩm</th>
                <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-5 py-3">Ngày thuê</th>
                <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-5 py-3">Tổng</th>
                <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-5 py-3">Trạng thái</th>
                <th className="text-right text-xs font-semibold text-muted uppercase tracking-wider px-5 py-3">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-sm text-muted">
                    Chưa có đơn thuê nào
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const statusInfo = ORDER_STATUS_MAP[order.status];
                  return (
                    <tr key={order.id} className="hover:bg-surface/30 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="text-sm font-medium text-foreground">{order.customer_name}</div>
                        <div className="text-xs text-muted">{order.phone}</div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="text-sm font-medium text-foreground/90">{order.product_name}</div>
                        {order.delivery_address && (
                          <div className="mt-1.5 p-2 bg-surface/50 rounded-lg border border-border/50">
                            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-primary mb-1">
                              <span className="w-2 h-2 rounded-full bg-primary/70"></span>
                              Giao: {order.delivery_date ? formatDate(order.delivery_date) : "Chưa chọn"}
                            </div>
                            <div className="text-xs text-muted whitespace-pre-wrap leading-relaxed">
                              {order.delivery_address}
                            </div>
                          </div>
                        )}
                        {order.note && (
                          <div className="text-[11px] text-amber-700 mt-1 italic">
                            * Ghi chú: {order.note}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="text-sm text-foreground/80">{order.start_date} → {order.end_date}</div>
                        <div className="text-xs text-muted">{order.rental_days} ngày</div>
                      </td>
                      <td className="px-5 py-3.5 text-sm font-medium text-primary">{formatPrice(order.total_price)}</td>
                      <td className="px-5 py-3.5">
                        <span className={`px-2.5 py-1 text-[11px] font-semibold rounded-full ${statusInfo?.color}`}>
                          {statusInfo?.label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1">
                          {order.status === "awaiting_deposit" && (
                            <>
                              <form action={handleConfirmDeposit}>
                                <input type="hidden" name="orderId" value={order.id} />
                                <input type="hidden" name="productId" value={order.product_id} />
                                <button type="submit" className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors" title="Xác nhận đã nhận cọc">
                                  <Check className="w-3.5 h-3.5" /> Xác nhận cọc
                                </button>
                              </form>
                              <form action={handleUpdateStatus}>
                                <input type="hidden" name="orderId" value={order.id} />
                                <input type="hidden" name="status" value="cancelled" />
                                <button type="submit" className="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-red-500" title="Từ chối">
                                  <X className="w-4 h-4" />
                                </button>
                              </form>
                            </>
                          )}
                          {order.status === "pending" && (
                            <>
                              <form action={handleUpdateStatus}>
                                <input type="hidden" name="orderId" value={order.id} />
                                <input type="hidden" name="status" value="confirmed" />
                                <button type="submit" className="p-2 hover:bg-green-50 rounded-lg transition-colors text-green-600" title="Duyệt đơn">
                                  <Check className="w-4 h-4" />
                                </button>
                              </form>
                              <form action={handleUpdateStatus}>
                                <input type="hidden" name="orderId" value={order.id} />
                                <input type="hidden" name="status" value="cancelled" />
                                <button type="submit" className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-500" title="Từ chối">
                                  <X className="w-4 h-4" />
                                </button>
                              </form>
                            </>
                          )}
                          {order.status === "confirmed" && (
                            <form action={handleUpdateStatus}>
                              <input type="hidden" name="orderId" value={order.id} />
                              <input type="hidden" name="status" value="renting" />
                              <button type="submit" className="p-2 hover:bg-purple-50 rounded-lg transition-colors text-purple-600" title="Chuyển sang đang thuê">
                                <Clock className="w-4 h-4" />
                              </button>
                            </form>
                          )}
                          {order.status === "renting" && (
                            <form action={handleUpdateStatus}>
                              <input type="hidden" name="orderId" value={order.id} />
                              <input type="hidden" name="status" value="completed" />
                              <button type="submit" className="p-2 hover:bg-green-50 rounded-lg transition-colors text-green-600" title="Hoàn tất">
                                <Check className="w-4 h-4" />
                              </button>
                            </form>
                          )}
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
