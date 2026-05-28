"use client";

import Link from "next/link";
import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  User,
  Phone,
  MapPin,
  FileText,
  Truck,
  Store,
  ShoppingBag,
  X,
  CheckCircle,
  Clock,
  QrCode,
  CreditCard,
  Shield,
  Copy,
  Check,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

// ===== CẤU HÌNH NGÂN HÀNG =====
const BANK_CONFIG = {
  bankName: "MB Bank",
  bankCode: "MB", // Mã ngân hàng cho VietQR
  accountNumber: "0363514115", // Số tài khoản
  accountName: "PHAN HA HOANG VY", // Tên chủ tài khoản
};

interface RentalFormProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price_per_day: number;
    deposit: number;
    thumbnail_url: string | null;
  };
}

export default function RentalForm({ product }: RentalFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [deliveryMethod, setDeliveryMethod] = useState<"pickup" | "delivery">("pickup");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Payment modal state
  const [showPayment, setShowPayment] = useState(false);
  const [countdown, setCountdown] = useState(900); // 15 phút = 900 giây
  const [copied, setCopied] = useState<string | null>(null);

  const rentalDays =
    startDate && endDate
      ? Math.max(
          1,
          Math.ceil(
            (new Date(endDate).getTime() - new Date(startDate).getTime()) /
              (1000 * 60 * 60 * 24)
          )
        )
      : 0;

  const totalPrice = rentalDays * product.price_per_day;
  const depositAmount = product.deposit;

  // Nội dung chuyển khoản
  const transferContent = `DATCOC ${product.name.replace(/\s+/g, "").slice(0, 10).toUpperCase()} ${phone.replace(/\s+/g, "")}`;

  // VietQR URL
  const qrUrl = `https://img.vietqr.io/image/${BANK_CONFIG.bankCode}-${BANK_CONFIG.accountNumber}-compact2.png?amount=${depositAmount}&addInfo=${encodeURIComponent(transferContent)}&accountName=${encodeURIComponent(BANK_CONFIG.accountName)}`;

  // Countdown timer
  useEffect(() => {
    if (!showPayment) return;
    if (countdown <= 0) {
      setShowPayment(false);
      setErrorMsg("Hết thời gian thanh toán. Vui lòng thử lại.");
      return;
    }
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [showPayment, countdown]);

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  // Bước 1: Validate form & mở modal thanh toán
  const handleOpenPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (rentalDays <= 0) return;
    if (!customerName.trim() || !phone.trim()) return;
    if (deliveryMethod === "delivery") {
      if (!address.trim()) return;
      if (!deliveryDate) {
        setErrorMsg("Vui lòng chọn ngày giao hàng");
        return;
      }
    }
    setErrorMsg("");
    setCountdown(900);
    setShowPayment(true);
  };

  // Bước 2: Xác nhận đã thanh toán → tạo đơn với trạng thái "chờ xác nhận cọc"
  const handleConfirmPayment = async () => {
    setErrorMsg("");
    const supabase = createClient();

    startTransition(async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id || null;

      const orderData: Record<string, any> = {
        product_id: product.id,
        start_date: startDate,
        end_date: endDate,
        rental_days: rentalDays,
        total_price: totalPrice,
        deposit_amount: depositAmount,
        customer_name: customerName,
        phone: phone,
        delivery_method: deliveryMethod,
        delivery_address: deliveryMethod === "delivery" ? address : null,
        delivery_date: deliveryMethod === "delivery" ? deliveryDate : null,
        note: note || null,
        status: "awaiting_deposit",      // Chờ xác nhận cọc
        deposit_status: "pending",       // Admin chưa xác nhận
      };

      if (userId) {
        orderData.user_id = userId;
      }

      const { error } = await supabase.from("rental_orders").insert(orderData);

      if (error) {
        console.error("Order error:", error);
        setErrorMsg(`Lỗi tạo đơn: ${error.message || "Vui lòng thử lại."}`);
        setShowPayment(false);
        return;
      }

      // KHÔNG giảm số lượng ở đây - chỉ giảm khi admin xác nhận đã nhận cọc

      setShowPayment(false);
      router.push("/my-orders");
      router.refresh();
    });
  };

  return (
    <>
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleOpenPayment} className="space-y-6">
            {errorMsg && (
              <div className="bg-red-50 text-red-500 p-4 rounded-xl text-sm font-medium">
                {errorMsg}
              </div>
            )}
            
            {/* Product Summary */}
            <div className="bg-white rounded-2xl p-6 border border-border">
              <h2 className="text-sm font-semibold text-foreground mb-4">
                Sản phẩm đặt thuê
              </h2>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-xl bg-surface flex items-center justify-center overflow-hidden relative shrink-0">
                  {product.thumbnail_url ? (
                    <Image src={product.thumbnail_url} alt={product.name} fill className="object-cover" />
                  ) : (
                    <span className="text-4xl">👗</span>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    {product.name}
                  </h3>
                  <p className="text-sm text-primary font-bold mt-1">
                    {formatPrice(product.price_per_day)}/ngày
                  </p>
                </div>
              </div>
            </div>

            {/* Dates */}
            <div className="bg-white rounded-2xl p-6 border border-border space-y-5">
              <h2 className="text-sm font-semibold text-foreground">
                Thời gian thuê
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">
                    Ngày nhận
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="input-field !pl-10"
                      min={new Date().toISOString().split("T")[0]}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">
                    Ngày trả
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="input-field !pl-10"
                      min={startDate || new Date().toISOString().split("T")[0]}
                      required
                    />
                  </div>
                </div>
              </div>

              {rentalDays > 0 && (
                <div className="bg-primary/5 rounded-xl p-3 text-sm text-primary font-medium text-center">
                  Thuê {rentalDays} ngày
                </div>
              )}
            </div>

            {/* Customer Info */}
            <div className="bg-white rounded-2xl p-6 border border-border space-y-5">
              <h2 className="text-sm font-semibold text-foreground">
                Thông tin liên hệ & Giao nhận
              </h2>

              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">
                  Họ tên
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Họ và tên"
                    className="input-field !pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">
                  Số điện thoại
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0909 123 456"
                    className="input-field !pl-10"
                    required
                  />
                </div>
              </div>

              {/* Delivery Method */}
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  Phương thức nhận
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod("pickup")}
                    className={`flex items-center gap-2 p-4 rounded-xl border-2 text-sm font-medium transition-all ${
                      deliveryMethod === "pickup"
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border text-foreground/70 hover:border-primary/30"
                    }`}
                  >
                    <Store className="w-4 h-4" />
                    Nhận tại cửa hàng
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod("delivery")}
                    className={`flex items-center gap-2 p-4 rounded-xl border-2 text-sm font-medium transition-all ${
                      deliveryMethod === "delivery"
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border text-foreground/70 hover:border-primary/30"
                    }`}
                  >
                    <Truck className="w-4 h-4" />
                    Giao tận nơi
                  </button>
                </div>
              </div>

              {deliveryMethod === "delivery" && (
                <div className="space-y-4 border-t border-border/50 pt-4 mt-2">
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1.5">
                      Ngày shipper giao hàng
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                      <input
                        type="date"
                        value={deliveryDate}
                        onChange={(e) => setDeliveryDate(e.target.value)}
                        className="input-field !pl-10"
                        min={startDate || new Date().toISOString().split("T")[0]}
                        max={endDate || undefined}
                        required
                      />
                    </div>
                    <p className="text-[11px] text-muted mt-1.5 leading-tight">
                      * Ngày nhận hàng phải nằm trong khoảng thời gian bạn đã chọn thuê. Shipper sẽ giao đến địa chỉ bên dưới vào ngày này.
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1.5">
                      Địa chỉ nhận hàng (Nội thành Đà Lạt)
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted" />
                      <textarea
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Số nhà, đường, phường/xã, TP. Đà Lạt"
                        className="input-field !pl-10 min-h-[80px] resize-none"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">
                  Ghi chú
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 w-4 h-4 text-muted" />
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Yêu cầu thêm (ví dụ: cần phụ kiện kèm, giờ giao cụ thể...)"
                    className="input-field !pl-10 min-h-[80px] resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Submit (mobile) */}
            <div className="lg:hidden">
              <button
                type="submit"
                disabled={isPending || rentalDays === 0}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <CreditCard className="w-4 h-4" />
                {isPending ? "Đang xử lý..." : `Đặt cọc & Xác nhận (${formatPrice(depositAmount)})`}
              </button>
            </div>
          </form>
        </div>

        {/* Order Summary Sidebar */}
        <div className="hidden lg:block">
          <div className="sticky top-24 bg-white rounded-2xl p-6 border border-border space-y-4">
            <h2 className="text-sm font-semibold text-foreground">
              Tóm tắt đơn thuê
            </h2>

            <div className="flex items-center gap-3 pb-4 border-b border-border">
              <div className="w-16 h-16 rounded-xl bg-surface flex items-center justify-center overflow-hidden relative shrink-0">
                {product.thumbnail_url ? (
                  <Image src={product.thumbnail_url} alt={product.name} fill className="object-cover" />
                ) : (
                  <span className="text-3xl">👗</span>
                )}
              </div>
              <div>
                <h3 className="text-sm font-medium text-foreground line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-xs text-muted mt-1">Freesize</p>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Giá thuê/ngày</span>
                <span className="text-foreground">
                  {formatPrice(product.price_per_day)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Số ngày thuê</span>
                <span className="text-foreground">
                  {rentalDays > 0 ? `${rentalDays} ngày` : "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Tổng tiền thuê</span>
                <span className="text-foreground">
                  {rentalDays > 0 ? formatPrice(totalPrice) : "—"}
                </span>
              </div>
              <div className="border-t border-border pt-2 flex justify-between">
                <span className="font-semibold text-foreground flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-primary" />
                  Tiền đặt cọc
                </span>
                <span className="font-bold text-primary text-lg">
                  {formatPrice(depositAmount)}
                </span>
              </div>
            </div>

            <div className="bg-amber-50 rounded-xl p-3 text-xs text-amber-800 leading-relaxed">
              <strong>Lưu ý:</strong> Bạn cần thanh toán tiền đặt cọc <strong>{formatPrice(depositAmount)}</strong> trước khi đơn thuê được xác nhận. Tiền cọc sẽ được hoàn trả khi trả đồ đúng hạn.
            </div>

            <button
              onClick={handleOpenPayment}
              disabled={isPending || rentalDays === 0 || !customerName.trim() || !phone.trim()}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60 mt-4"
            >
              <CreditCard className="w-4 h-4" />
              {isPending ? "Đang xử lý..." : `Đặt cọc ${formatPrice(depositAmount)}`}
            </button>

            <p className="text-[11px] text-muted text-center">
              Thanh toán qua chuyển khoản ngân hàng
            </p>
          </div>
        </div>
      </div>

      {/* ===== PAYMENT MODAL ===== */}
      {showPayment && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowPayment(false)}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl animate-slide-down">
            {/* Header */}
            <div className="sticky top-0 bg-white rounded-t-2xl border-b border-border px-6 py-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <QrCode className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">Thanh toán đặt cọc</h3>
                  <div className="flex items-center gap-1.5 text-xs text-muted">
                    <Clock className="w-3 h-3" />
                    <span>Còn lại: <strong className={countdown < 60 ? "text-red-500" : "text-foreground"}>{formatCountdown(countdown)}</strong></span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowPayment(false)}
                className="p-2 rounded-lg hover:bg-surface transition-colors"
              >
                <X className="w-5 h-5 text-muted" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5">
              {/* Số tiền cần thanh toán */}
              <div className="text-center bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-5">
                <p className="text-xs text-muted mb-1">Số tiền đặt cọc</p>
                <p className="text-3xl font-extrabold text-primary">
                  {formatPrice(depositAmount)}
                </p>
                <p className="text-xs text-muted mt-2">
                  Cho đơn thuê: <strong>{product.name}</strong>
                </p>
              </div>

              {/* QR Code */}
              <div className="flex flex-col items-center">
                <div className="bg-white rounded-2xl border-2 border-primary/20 p-3 shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={qrUrl}
                    alt="QR Chuyển khoản"
                    width={240}
                    height={240}
                    className="rounded-xl"
                  />
                </div>
                <p className="text-xs text-muted mt-3 text-center">
                  Quét mã QR bằng app ngân hàng để chuyển khoản
                </p>
              </div>

              {/* Bank Info */}
              <div className="bg-surface rounded-xl p-4 space-y-3">
                <h4 className="text-xs font-semibold text-muted uppercase tracking-wider">
                  Thông tin chuyển khoản
                </h4>

                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[11px] text-muted">Ngân hàng</p>
                      <p className="text-sm font-semibold text-foreground">{BANK_CONFIG.bankName}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[11px] text-muted">Số tài khoản</p>
                      <p className="text-sm font-semibold text-foreground font-mono">{BANK_CONFIG.accountNumber}</p>
                    </div>
                    <button
                      onClick={() => handleCopy(BANK_CONFIG.accountNumber, "account")}
                      className="p-1.5 rounded-lg hover:bg-white transition-colors text-muted hover:text-primary"
                      title="Sao chép"
                    >
                      {copied === "account" ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[11px] text-muted">Chủ tài khoản</p>
                      <p className="text-sm font-semibold text-foreground">{BANK_CONFIG.accountName}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[11px] text-muted">Số tiền</p>
                      <p className="text-sm font-bold text-primary">{formatPrice(depositAmount)}</p>
                    </div>
                    <button
                      onClick={() => handleCopy(depositAmount.toString(), "amount")}
                      className="p-1.5 rounded-lg hover:bg-white transition-colors text-muted hover:text-primary"
                      title="Sao chép"
                    >
                      {copied === "amount" ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] text-muted">Nội dung CK</p>
                      <p className="text-sm font-semibold text-foreground truncate">{transferContent}</p>
                    </div>
                    <button
                      onClick={() => handleCopy(transferContent, "content")}
                      className="p-1.5 rounded-lg hover:bg-white transition-colors text-muted hover:text-primary shrink-0"
                      title="Sao chép"
                    >
                      {copied === "content" ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Warning */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 leading-relaxed">
                ⚠️ Vui lòng chuyển <strong>đúng số tiền</strong> và <strong>đúng nội dung</strong> để đơn hàng được xử lý nhanh nhất. Đơn thuê sẽ được xác nhận trong vòng <strong>1-2 giờ</strong> sau khi nhận được thanh toán.
              </div>

              {/* Confirm Button */}
              <button
                onClick={handleConfirmPayment}
                disabled={isPending}
                className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 text-base disabled:opacity-60"
              >
                {isPending ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Tôi đã chuyển khoản xong
                  </>
                )}
              </button>

              <p className="text-[10px] text-muted text-center leading-relaxed">
                Bấm xác nhận sau khi bạn đã hoàn tất chuyển khoản.
                <br />
                Cửa hàng sẽ kiểm tra và xác nhận đơn thuê qua điện thoại.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
