import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, Package, Calendar, MapPin, Phone, CreditCard, ChevronRight, Clock, AlertTriangle, ShieldCheck, CheckCircle2, RefreshCcw, Receipt, ArrowLeft, Shirt, XCircle } from "lucide-react";
import ExtendOrderAction from "./extend-order-action";
import ReviewAction from "./review-action";
import { getOrderById } from "@/lib/db/orders";
import { getReviewByOrderId } from "@/lib/db/reviews";
import { formatPrice, formatDate } from "@/lib/utils";

const statusMap = {
  pending: { label: "Chờ xác nhận", color: "bg-amber-100 text-amber-700 border-amber-200" },
  awaiting_deposit: { label: "Chờ duyệt cọc", color: "bg-orange-100 text-orange-700 border-orange-200" },
  confirmed: { label: "Đã xác nhận", color: "bg-blue-100 text-blue-700 border-blue-200" },
  renting: { label: "Đang thuê", color: "bg-purple-100 text-purple-700 border-purple-200" },
  completed: { label: "Hoàn tất", color: "bg-green-100 text-green-700 border-green-200" },
  cancelled: { label: "Đã hủy", color: "bg-red-100 text-red-700 border-red-200" },
};

export default async function OrderDetailsPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const order = await getOrderById(params.id);
  const review = order?.status === "completed" ? await getReviewByOrderId(params.id) : null;

  if (!order) {
    notFound();
  }

  const shortId = order.id.split("-")[0].toUpperCase();
  const currentStatus = statusMap[order.status as keyof typeof statusMap] || statusMap.pending;

  // Stepper Logic
  let currentStep = 0;
  if (order.status === "pending" || order.status === "awaiting_deposit") currentStep = 1;
  else if (order.status === "confirmed") currentStep = 2;
  else if (order.status === "renting") currentStep = 3;
  else if (order.status === "completed") currentStep = 4;

  const steps = [
    { label: "Đã xác nhận", isActive: currentStep >= 2, isCurrent: currentStep === 2, date: currentStep >= 2 ? order.created_at : null },
    { label: "Đang thuê", isActive: currentStep >= 3, isCurrent: currentStep === 3, date: currentStep >= 3 ? order.start_date : null },
    { label: "Hoàn tất", isActive: currentStep >= 4, isCurrent: currentStep === 4, date: currentStep >= 4 ? order.end_date : null }
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/my-orders" className="inline-flex items-center gap-2 text-sm font-medium text-[#8B6F47] hover:text-[#7A603D] transition-colors">
            <ArrowLeft className="w-4 h-4" /> Quay lại danh sách
          </Link>
          <div className="text-sm font-medium text-muted">
            Mã đơn: <span className="text-[#3E2723]">#DL{shortId}</span>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] border border-[#EFEBE4] overflow-hidden shadow-sm">
          
          {/* Top Status Banner */}
          <div className="p-8 border-b border-[#EFEBE4] bg-[#F3EBE0]/30 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl font-bold text-[#3E2723] mb-2">Chi tiết đơn thuê</h1>
              <p className="text-sm text-[#5D4037]">Ngày đặt: {formatDate(order.created_at)}</p>
            </div>
            <div className={`px-5 py-2 rounded-full border text-sm font-bold ${currentStatus.color}`}>
              {currentStatus.label}
            </div>
          </div>

          <div className="p-8 space-y-8">
            
            {/* Stepper (Only show if not cancelled) */}
            {order.status !== "cancelled" && (
              <div className="py-6 mb-4">
                <div className="w-full relative flex items-center justify-between max-w-2xl mx-auto">
                  {/* Lines */}
                  <div className="absolute left-10 right-10 top-5 h-1 bg-[#F5F0E6] -z-10 rounded-full"></div>
                  <div 
                    className="absolute left-10 top-5 h-1 bg-primary transition-all duration-500 -z-10 rounded-full" 
                    style={{ 
                      width: currentStep >= 4 ? 'calc(100% - 5rem)' : currentStep >= 3 ? '50%' : '0%'
                    }}
                  ></div>

                  {/* Step 1 */}
                  <div className="flex flex-col items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-base font-bold border-4 bg-white transition-colors duration-300 ${steps[0].isActive ? 'border-primary text-primary' : 'border-[#EFEBE4] text-muted'}`}>
                      {steps[0].isActive ? <CheckCircle2 className="w-6 h-6" /> : 1}
                    </div>
                    <div className="text-center">
                      <div className={`text-sm font-semibold ${steps[0].isCurrent ? 'text-primary' : steps[0].isActive ? 'text-[#3E2723]' : 'text-muted'}`}>{steps[0].label}</div>
                      {steps[0].date && <div className="text-xs text-muted/70 mt-0.5">{formatDate(steps[0].date)}</div>}
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex flex-col items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-base font-bold border-4 bg-white transition-colors duration-300 ${steps[1].isActive ? 'border-primary text-primary' : steps[1].isCurrent ? 'border-purple-500 text-purple-500' : 'border-[#EFEBE4] text-muted'}`}>
                      {steps[1].isActive ? <CheckCircle2 className="w-6 h-6" /> : 2}
                    </div>
                    <div className="text-center">
                      <div className={`text-sm font-semibold ${steps[1].isCurrent ? 'text-purple-600' : steps[1].isActive ? 'text-[#3E2723]' : 'text-muted'}`}>{steps[1].label}</div>
                      {steps[1].date && <div className="text-xs text-muted/70 mt-0.5">{formatDate(steps[1].date)}</div>}
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex flex-col items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-base font-bold border-4 bg-white transition-colors duration-300 ${steps[2].isActive ? 'border-green-500 text-green-500' : steps[2].isCurrent ? 'border-green-500 text-green-500' : 'border-[#EFEBE4] text-muted'}`}>
                      {steps[2].isActive ? <CheckCircle2 className="w-6 h-6" /> : 3}
                    </div>
                    <div className="text-center">
                      <div className={`text-sm font-semibold ${steps[2].isActive ? 'text-green-600' : 'text-muted'}`}>{steps[2].label}</div>
                      {steps[2].date && <div className="text-xs text-muted/70 mt-0.5">{formatDate(steps[2].date)}</div>}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {order.status === "cancelled" && (
              <div className="bg-red-50 border border-red-100 rounded-2xl p-6 flex items-start gap-4">
                <XCircle className="w-6 h-6 text-red-500 shrink-0" />
                <div>
                  <h3 className="font-semibold text-red-700">Đơn hàng đã bị hủy</h3>
                  <p className="text-sm text-red-600/80 mt-1">Đơn hàng này không còn hiệu lực. Vui lòng liên hệ với shop nếu bạn cần hỗ trợ thêm.</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Left Column: Product & Rental Info */}
              <div className="space-y-6">
                
                <section>
                  <h3 className="text-sm font-bold text-[#3E2723] uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Shirt className="w-4 h-4 text-[#8B6F47]" /> Sản phẩm thuê
                  </h3>
                  <div className="flex gap-4 p-4 rounded-2xl bg-surface/50 border border-border/50">
                    <div className="w-20 h-28 rounded-xl bg-surface overflow-hidden relative shrink-0">
                      {order.product_thumbnail ? (
                        <Image src={order.product_thumbnail} alt={order.product_name || ""} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100"><Shirt className="w-6 h-6 text-gray-300"/></div>
                      )}
                    </div>
                    <div className="flex flex-col py-1">
                      <h4 className="font-semibold text-[#3E2723] leading-snug mb-2">{order.product_name}</h4>
                      <div className="text-sm text-muted">Size: Freesize</div>
                      <div className="mt-auto">
                        <Link href={`/rental/${order.product_id}`} className="text-xs font-semibold text-primary hover:underline">Xem sản phẩm →</Link>
                      </div>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-sm font-bold text-[#3E2723] uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#8B6F47]" /> Thời gian thuê
                  </h3>
                  <div className="bg-[#F5F0E6] rounded-2xl p-5 border border-[#EFEBE4]">
                    <div className="flex justify-between items-center mb-3">
                      <div className="text-sm font-medium text-[#5D4037]">Ngày nhận:</div>
                      <div className="text-sm font-bold text-[#3E2723]">{formatDate(order.start_date)}</div>
                    </div>
                    <div className="flex justify-between items-center mb-3">
                      <div className="text-sm font-medium text-[#5D4037]">Ngày trả:</div>
                      <div className="text-sm font-bold text-[#3E2723]">{formatDate(order.end_date)}</div>
                    </div>
                    <div className="pt-3 border-t border-[#EFEBE4] flex justify-between items-center">
                      <div className="text-sm font-medium text-[#5D4037]">Tổng thời gian:</div>
                      <div className="text-sm font-bold text-primary">{order.rental_days} ngày</div>
                    </div>
                  </div>
                </section>

              </div>

              {/* Right Column: Customer & Payment Info */}
              <div className="space-y-6">
                
                <section>
                  <h3 className="text-sm font-bold text-[#3E2723] uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Package className="w-4 h-4 text-[#8B6F47]" /> Thông tin nhận & trả
                  </h3>
                  <div className="bg-white rounded-2xl p-5 border border-[#EFEBE4] space-y-4 shadow-sm">
                    {/* Receive Info */}
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-50 border border-green-100 flex items-center justify-center shrink-0 mt-0.5">
                        <Package className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-[#3E2723] mb-3">Thông tin nhận đồ</div>
                        <div className="grid grid-cols-[100px_1fr] gap-y-2 gap-x-2 text-xs">
                          <div className="text-muted font-medium">Thời gian nhận</div>
                          <div className="text-[#3E2723]">{formatDate(order.start_date)} - 09:00 AM</div>
                          <div className="text-muted font-medium">Địa điểm nhận</div>
                          <div className="text-[#3E2723]">
                            {order.delivery_address 
                              ? `Giao tận nơi: ${order.delivery_address}`
                              : "Dalat Lookbook - 45 Phan Đình Phùng, Phường 2, Đà Lạt"}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Return Info */}
                    <div className="flex items-start gap-3 pt-5 border-t border-border/50">
                      <div className="w-8 h-8 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0 mt-0.5">
                        <Clock className="w-4 h-4 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-[#3E2723] mb-3">Thông tin trả đồ</div>
                        <div className="grid grid-cols-[100px_1fr] gap-y-2 gap-x-2 text-xs">
                          <div className="text-muted font-medium">Thời gian trả dự kiến</div>
                          <div className="text-[#3E2723]">{formatDate(order.end_date)} - 09:00 AM</div>
                          <div className="text-muted font-medium">Địa điểm trả</div>
                          <div className="text-[#3E2723]">Dalat Lookbook - 45 Phan Đình Phùng, Phường 2, Đà Lạt</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-5">
                      <Link href="/lien-he" className="flex-1 flex justify-center items-center gap-2 px-4 py-2.5 rounded-xl border border-[#EFEBE4] text-xs font-semibold text-[#5D4037] hover:bg-surface transition-colors">
                        Liên hệ shop
                      </Link>
                      {['confirmed', 'renting'].includes(order.status) && (
                        <ExtendOrderAction order={order} userId={order.user_id} />
                      )}
                      {order.status === 'completed' && !review && (
                        <ReviewAction order={order} userId={order.user_id} />
                      )}
                      {review && (
                        <div className="flex-1 flex justify-center items-center gap-1 px-4 py-2.5 rounded-xl border border-green-200 bg-green-50 text-green-700 text-xs font-semibold">
                          <CheckCircle2 className="w-4 h-4" />
                          Đã đánh giá {review.rating} sao
                        </div>
                      )}
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-sm font-bold text-[#3E2723] uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-[#8B6F47]" /> Thanh toán
                  </h3>
                  <div className="bg-[#F5F0E6]/50 rounded-2xl p-5 border border-[#EFEBE4]">
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted">Tổng tiền thuê ({order.rental_days} ngày)</span>
                        <span className="font-semibold text-[#3E2723]">{formatPrice(order.total_price)}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted">Tiền cọc trang phục</span>
                        <span className="font-semibold text-[#3E2723]">{formatPrice(order.deposit_amount || 0)}</span>
                      </div>
                      {(order.extra_fee || 0) > 0 && (
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted">Phí gia hạn (đã bao gồm)</span>
                          <span className="font-semibold text-[#3E2723]">{formatPrice(order.extra_fee || 0)}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="pt-4 border-t border-[#EAE0D3] flex justify-between items-center">
                      <span className="font-bold text-[#3E2723]">Cần thanh toán</span>
                      <span className="text-xl font-bold text-primary">{formatPrice(order.total_price + (order.deposit_amount || 0))}</span>
                    </div>
                  </div>
                </section>

              </div>
            </div>

            {/* Cancellation Policy */}
            <section className="pt-6">
              <h3 className="text-sm font-bold text-[#3E2723] uppercase tracking-wider mb-4 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#8B6F47]" /> Chính sách hủy đơn
              </h3>
              <div className="bg-[#FDFBF7] rounded-2xl p-6 border border-[#EFEBE4]">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-[#EFEBE4]">
                  <div className="flex flex-col pt-4 md:pt-0 md:pr-6 first:pt-0">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <h4 className="font-semibold text-[#3E2723] text-sm">Hủy trước 24h</h4>
                    </div>
                    <p className="text-xs text-muted leading-relaxed">Hoàn 100% tiền cọc<br/>Không mất phí hủy</p>
                  </div>
                  
                  <div className="flex flex-col pt-4 md:pt-0 md:px-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-amber-600" />
                      <h4 className="font-semibold text-[#3E2723] text-sm">Hủy trong vòng 24h</h4>
                    </div>
                    <p className="text-xs text-muted leading-relaxed">Mất 50% tiền cọc<br/>Phí hủy: 50% giá trị đơn</p>
                  </div>

                  <div className="flex flex-col pt-4 md:pt-0 md:pl-6">
                    <div className="flex items-center gap-2 mb-2">
                      <XCircle className="w-4 h-4 text-red-600" />
                      <h4 className="font-semibold text-[#3E2723] text-sm">Không hủy / Trễ hẹn</h4>
                    </div>
                    <p className="text-xs text-muted leading-relaxed">Mất 100% tiền cọc<br/>Tính phí phát sinh (nếu có)</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
