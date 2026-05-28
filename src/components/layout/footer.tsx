import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Globe,
  Camera,
  Heart,
} from "lucide-react";

const CATEGORIES = [
  { name: "Vintage Đà Lạt", slug: "vintage-da-lat" },
  { name: "Nàng thơ", slug: "nang-tho" },
  { name: "Hàn Quốc", slug: "han-quoc" },
  { name: "Y2K", slug: "y2k" },
  { name: "Picnic", slug: "picnic" },
  { name: "Couple", slug: "couple" },
  { name: "Nhóm bạn", slug: "nhom-ban" },
  { name: "Công chúa", slug: "cong-chua" },
];

export function Footer() {
  return (
    <footer className="bg-[#2C2420] text-white/80">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#C4A882] to-[#D4A574] flex items-center justify-center">
                <span className="text-white font-bold text-sm">DL</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-white tracking-tight leading-5">
                  Dalat
                </span>
                <span className="text-xs font-medium text-[#D4A574] tracking-widest uppercase leading-3">
                  Lookbook
                </span>
              </div>
            </div>
            <p className="text-sm text-white/60 leading-relaxed mb-4">
              Dịch vụ cho thuê trang phục trực tuyến dành cho giới trẻ khi du
              lịch Đà Lạt. Đa dạng phong cách, tiện lợi đặt trước.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Globe className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Camera className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Danh mục
            </h4>
            <ul className="space-y-2.5">
              {CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/categories/${cat.slug}`}
                    className="text-sm text-white/60 hover:text-[#D4A574] transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Liên kết
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/products"
                  className="text-sm text-white/60 hover:text-[#D4A574] transition-colors"
                >
                  Tất cả trang phục
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-sm text-white/60 hover:text-[#D4A574] transition-colors"
                >
                  Đăng nhập
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="text-sm text-white/60 hover:text-[#D4A574] transition-colors"
                >
                  Đăng ký
                </Link>
              </li>
              <li>
                <Link
                  href="/my-orders"
                  className="text-sm text-white/60 hover:text-[#D4A574] transition-colors"
                >
                  Đơn thuê của tôi
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Liên hệ
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-white/60">
                <MapPin className="w-4 h-4 mt-0.5 text-[#D4A574] shrink-0" />
                <span>Đường Phan Đình Phùng, TP. Đà Lạt, Lâm Đồng</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/60">
                <Phone className="w-4 h-4 text-[#D4A574] shrink-0" />
                <span>0909 123 456</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/60">
                <Mail className="w-4 h-4 text-[#D4A574] shrink-0" />
                <span>hello@dalatlookbook.vn</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/60">
                <Clock className="w-4 h-4 text-[#D4A574] shrink-0" />
                <span>8:00 — 21:00 hàng ngày</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-xs text-white/40">
              © 2025 Dalat Lookbook. Tất cả quyền được bảo lưu.
            </p>
            <p className="flex items-center gap-1 text-xs text-white/40">
              Được xây dựng với
              <Heart className="w-3 h-3 text-[#E8B4B8] fill-[#E8B4B8]" />
              tại Đà Lạt
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
