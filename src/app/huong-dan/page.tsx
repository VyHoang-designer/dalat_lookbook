import Link from "next/link";
import {
  ChevronRight,
  ArrowRight,
  Search,
  CalendarCheck,
  PackageCheck,
  RotateCcw,
  AlertTriangle,
  CheckCircle,
  Phone,
  MapPin,
  Clock,
  CreditCard,
} from "lucide-react";

export default function HuongDanPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/8 via-surface/50 to-accent/5 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 text-center">
          <nav className="flex items-center gap-2 text-sm text-muted mb-4 justify-center">
            <Link href="/" className="hover:text-primary transition-colors">Trang chủ</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-foreground font-medium">Cách thuê</span>
          </nav>
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-3">
            Hướng dẫn <span className="text-primary">đặt thuê</span> trang phục
          </h1>
          <p className="text-muted max-w-xl mx-auto">
            Chỉ với 4 bước đơn giản, bạn đã có outfit xinh cho chuyến đi Đà Lạt
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 4 Steps */}
        <div className="space-y-8 mb-16">
          {[
            {
              step: 1, icon: Search, title: "Chọn trang phục yêu thích",
              color: "bg-amber-50 border-amber-200 text-amber-700",
              details: [
                "Duyệt trang phục theo phong cách: Vintage, Nàng thơ, Hàn Quốc, Y2K...",
                "Lọc theo size, màu sắc, giá thuê",
                "Xem chi tiết: ảnh thật, chất liệu, gợi ý phối đồ",
                "Kiểm tra tình trạng còn đồ hay đang được thuê",
              ],
            },
            {
              step: 2, icon: CalendarCheck, title: "Đặt lịch thuê online",
              color: "bg-blue-50 border-blue-200 text-blue-700",
              details: [
                "Chọn size phù hợp",
                "Chọn ngày nhận và ngày trả đồ",
                "Nhập thông tin: họ tên, số điện thoại",
                "Chọn phương thức nhận: tại cửa hàng hoặc giao tận nơi",
                "Gửi đơn đặt thuê — cửa hàng xác nhận trong 1–2 giờ",
              ],
            },
            {
              step: 3, icon: PackageCheck, title: "Nhận đồ & chụp ảnh",
              color: "bg-green-50 border-green-200 text-green-700",
              details: [
                "Nhận trang phục tại cửa hàng hoặc được giao tận nơi nội thành Đà Lạt",
                "Kiểm tra tình trạng trang phục khi nhận",
                "Thoải mái chụp ảnh, đi chơi, tham quan!",
              ],
            },
            {
              step: 4, icon: RotateCcw, title: "Trả đồ đúng hạn",
              color: "bg-purple-50 border-purple-200 text-purple-700",
              details: [
                "Trả trang phục đúng ngày đã đặt",
                "Trả tại cửa hàng hoặc hẹn shipper đến lấy",
                "Nhận lại tiền cọc sau khi kiểm tra tình trạng đồ",
                "⚠️ Phụ thu 50% giá thuê/ngày nếu trả trễ hạn",
              ],
            },
          ].map((item) => (
            <div key={item.step} className={`flex gap-5 p-6 rounded-2xl border ${item.color}`}>
              <div className="shrink-0">
                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center">
                  <item.icon className="w-6 h-6" />
                </div>
              </div>
              <div>
                <div className="text-xs font-bold opacity-50 mb-1">Bước {item.step}</div>
                <h3 className="text-lg font-bold text-foreground mb-3">{item.title}</h3>
                <ul className="space-y-2">
                  {item.details.map((d, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground/75">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Policies */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">Chính sách thuê đồ</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-border">
              <CreditCard className="w-5 h-5 text-primary mb-3" />
              <h3 className="text-sm font-bold text-foreground mb-2">Thanh toán & Tiền cọc</h3>
              <ul className="space-y-1.5 text-sm text-foreground/70">
                <li>• Cọc 50% khi xác nhận đơn</li>
                <li>• Thanh toán phần còn lại khi nhận đồ</li>
                <li>• Hoàn cọc sau khi trả đồ đúng hạn</li>
                <li>• Chấp nhận: chuyển khoản, tiền mặt</li>
              </ul>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-border">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mb-3" />
              <h3 className="text-sm font-bold text-foreground mb-2">Quy định trả trễ & Hư hỏng</h3>
              <ul className="space-y-1.5 text-sm text-foreground/70">
                <li>• Phụ thu 50% giá thuê/ngày khi trả trễ</li>
                <li>• Hư hỏng nhẹ: phụ thu 30% giá trị sản phẩm</li>
                <li>• Mất hoặc hư hỏng nặng: bồi thường 100%</li>
                <li>• Liên hệ trước nếu cần gia hạn</li>
              </ul>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-border">
              <Clock className="w-5 h-5 text-primary mb-3" />
              <h3 className="text-sm font-bold text-foreground mb-2">Thời gian thuê</h3>
              <ul className="space-y-1.5 text-sm text-foreground/70">
                <li>• Tối thiểu: 1 ngày</li>
                <li>• Tối đa: 7 ngày</li>
                <li>• Đặt trước ít nhất 1 ngày</li>
                <li>• Giờ nhận/trả: 8:00 – 21:00</li>
              </ul>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-border">
              <MapPin className="w-5 h-5 text-primary mb-3" />
              <h3 className="text-sm font-bold text-foreground mb-2">Giao nhận</h3>
              <ul className="space-y-1.5 text-sm text-foreground/70">
                <li>• Nhận tại cửa hàng: miễn phí</li>
                <li>• Giao nội thành Đà Lạt: 20.000đ</li>
                <li>• Không hỗ trợ giao liên tỉnh</li>
                <li>• Địa chỉ: Phan Đình Phùng, TP. Đà Lạt</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-primary/5 rounded-2xl p-8 text-center">
          <h2 className="text-xl font-bold text-foreground mb-2">Còn thắc mắc?</h2>
          <p className="text-sm text-muted mb-5">Liên hệ cửa hàng để được hỗ trợ nhanh nhất</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="tel:0909123456" className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-full hover:bg-primary-dark transition-colors text-sm">
              <Phone className="w-4 h-4" />
              Gọi 0909 123 456
            </a>
            <Link href="/products" className="flex items-center gap-2 px-6 py-3 border-2 border-primary text-primary font-semibold rounded-full hover:bg-primary hover:text-white transition-colors text-sm">
              Xem trang phục <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
