import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Camera,
  Clock,
  ShieldCheck,
  Truck,
  Star,
  MapPin,
  Sparkles,
  CheckCircle,
  ChevronRight,
  Shirt,
  CalendarCheck,
  Package,
  RefreshCw,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { getCategories } from "@/lib/db/categories";
import { getHotProducts } from "@/lib/db/products";
import { getBanners } from "@/lib/db/banners";
import { BannerCarousel } from "@/components/ui/banner-carousel";
import CustomerReviews from "@/components/home/customer-reviews";
import FeaturesSection from "@/components/home/features-section";
import { RentButton } from "@/components/ui/rent-button";

/* ==========================================
   STATIC DATA
   ========================================== */

const LOCATIONS = [
  { name: "Hồ Xuân Hương", desc: "Outfit nhẹ nhàng, nàng thơ", image: "https://foikyihnyuthrnlteudt.supabase.co/storage/v1/object/public/banner/hoxuanhuong.png", styles: ["Nàng thơ", "Vintage"] },
  { name: "Đồi cỏ hồng", desc: "Váy trắng, pastel, bồng bềnh", image: "https://foikyihnyuthrnlteudt.supabase.co/storage/v1/object/public/banner/doicohong.png", styles: ["Công chúa", "Nàng thơ"] },
  { name: "Quán cà phê", desc: "Tone nâu, be, vintage retro", image: "https://foikyihnyuthrnlteudt.supabase.co/storage/v1/object/public/banner/coffeshop.png", styles: ["Vintage", "Hàn Quốc"] },
  { name: "Vườn hoa", desc: "Váy hoa, outfit picnic rực rỡ", image: "https://foikyihnyuthrnlteudt.supabase.co/storage/v1/object/public/banner/vuonhoa.png", styles: ["Picnic", "Vintage"] },
  { name: "Phố đêm", desc: "Y2K, cá tính, streetwear", image: "https://foikyihnyuthrnlteudt.supabase.co/storage/v1/object/public/banner/phodem.png", styles: ["Y2K", "Hàn Quốc"] },
  { name: "Hẻm check-in", desc: "Couple look, nhóm bạn", image: "https://foikyihnyuthrnlteudt.supabase.co/storage/v1/object/public/banner/hem.png", styles: ["Couple", "Nhóm bạn"] },
];

const STYLE_MAPPINGS: Record<string, { emoji: string; gradient: string; accent: string }> = {
  "vintage-da-lat": { emoji: "🌸", gradient: "from-amber-100 to-orange-50", accent: "text-amber-800" },
  "nang-tho": { emoji: "🦋", gradient: "from-pink-50 to-rose-50", accent: "text-pink-700" },
  "han-quoc": { emoji: "🇰🇷", gradient: "from-blue-50 to-indigo-50", accent: "text-blue-700" },
  "y2k-ca-tinh": { emoji: "✨", gradient: "from-purple-50 to-fuchsia-50", accent: "text-purple-700" },
  "couple-look": { emoji: "💕", gradient: "from-red-50 to-rose-50", accent: "text-red-600" },
  "picnic-look": { emoji: "🧺", gradient: "from-green-50 to-emerald-50", accent: "text-green-700" },
  "cong-chua-tieu-thu": { emoji: "👑", gradient: "from-yellow-50 to-amber-50", accent: "text-yellow-700" },
};

/* ==========================================
   PAGE
   ========================================== */

export default async function HomePage() {
  const [categories, hotProducts, banners] = await Promise.all([
    getCategories(),
    getHotProducts(8),
    getBanners(),
  ]);

  return (
    <div className="animate-fade-in">
      {/* ===== BANNER CAROUSEL ===== */}
      <section className="py-4 lg:py-6 bg-background px-4 sm:px-6 lg:px-8">
        <BannerCarousel banners={banners} />
      </section>

      {/* ===== CHỌN OUTFIT THEO ĐỊA ĐIỂM CHECK-IN ===== */}
      <section className="py-16 lg:py-24 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-[#A88860]" />
              <span className="text-sm font-semibold tracking-[0.2em] text-[#A88860] uppercase">Đà Lạt Lookbook</span>
            </div>
            <h2 className="text-3xl lg:text-[40px] font-bold text-[#4A3F35] mb-4">
              Chọn outfit theo <span className="text-[#A88860]">địa điểm check-in</span>
            </h2>
            <div className="flex items-center justify-center mb-4">
              <span className="text-[#E8B4B8] text-2xl">✿</span>
            </div>
            <p className="text-[#8C7E73] max-w-2xl mx-auto font-medium">
              Gợi ý outfit phù hợp với từng địa điểm chụp ảnh nổi tiếng tại Đà Lạt
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {LOCATIONS.map((loc, idx) => (
              <div key={idx} className="group relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300">
                <Image
                  src={loc.image}
                  alt={loc.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

                {/* Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <h3 className="text-2xl font-bold text-white mb-1 tracking-tight">
                    {loc.name}
                  </h3>
                  <p className="text-sm text-white/80 mb-4 line-clamp-1">
                    {loc.desc}
                  </p>
                  
                  <div className="flex items-center gap-2 mb-5">
                    {loc.styles.map(style => (
                      <span key={style} className="px-4 py-1.5 rounded-full border border-white/30 text-white text-[11px] font-medium backdrop-blur-sm bg-white/10 hover:bg-white/20 transition-colors cursor-pointer">
                        {style}
                      </span>
                    ))}
                  </div>

                  <Link href={`/lookbook`} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#A88860] hover:bg-[#8B6F47] text-white text-sm font-semibold transition-colors w-fit shadow-lg shadow-[#A88860]/30">
                    Xem outfit <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== OUTFIT HOT TUẦN NÀY ===== */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="section-divider mb-4" />
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
                Outfit <span className="text-primary">hot</span> tuần này
              </h2>
              <p className="text-muted">Những bộ trang phục được thuê nhiều nhất</p>
            </div>
            <Link
              href="/products"
              className="hidden sm:flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
            >
              Xem tất cả <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5">
            {hotProducts.map((product) => (
              <div key={product.id} className="product-card group bg-white rounded-2xl overflow-hidden border border-border">
                {/* Image */}
                <Link href={`/products/${product.slug}`} className="block relative aspect-[3/4] bg-gradient-to-br from-surface to-surface-hover overflow-hidden">
                  {product.thumbnail_url ? (
                    <Image
                      src={product.thumbnail_url}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-6xl lg:text-7xl">👗</span>
                    </div>
                  )}
                  {/* Style Badge */}
                  <div className="absolute top-3 left-3 style-badge">{product.category_name}</div>
                  {/* Status */}
                  {product.status === "available" && (
                    <div className="absolute top-3 right-3 px-2 py-0.5 bg-green-500/90 text-white text-[10px] font-semibold rounded-full flex items-center gap-0.5">
                      <CheckCircle className="w-2.5 h-2.5" /> Còn đồ
                    </div>
                  )}
                </Link>

                {/* Info */}
                <div className="p-4">
                  {product.color && (
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <span className="text-[10px] font-medium text-muted bg-surface px-1.5 py-0.5 rounded">{product.color}</span>
                    </div>
                  )}
                  <Link href={`/products/${product.slug}`}>
                    <h3 className="text-sm font-semibold text-foreground mb-1.5 group-hover:text-primary transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                  </Link>
                  <div className="flex items-baseline gap-1 mb-3">
                    <span className="text-base font-bold text-primary">{formatPrice(product.price_per_day)}</span>
                    <span className="text-[10px] text-muted">/ngày</span>
                  </div>
                  {/* CTA Buttons */}
                  <div className="flex gap-2">
                    <Link
                      href={`/products/${product.slug}`}
                      className="flex-1 text-center text-xs font-medium py-2 rounded-lg border border-border text-foreground/70 hover:border-primary hover:text-primary transition-colors"
                    >
                      Xem chi tiết
                    </Link>
                    <RentButton
                      productId={product.id}
                      className="flex-1 text-center text-xs font-semibold py-2 rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors"
                    >
                      Đặt thuê
                    </RentButton>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="sm:hidden text-center mt-6">
            <Link href="/products" className="btn-outline inline-flex items-center gap-1 text-sm">
              Xem tất cả outfit <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== QUY TRÌNH THUÊ ĐỒ ===== */}
      <section className="py-16 lg:py-24 bg-[#FAF8F5] relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-[url('https://foikyihnyuthrnlteudt.supabase.co/storage/v1/object/public/banner/leaf-left.png')] bg-contain bg-no-repeat opacity-20 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-[url('https://foikyihnyuthrnlteudt.supabase.co/storage/v1/object/public/banner/leaf-right.png')] bg-contain bg-no-repeat opacity-20 translate-x-1/3 translate-y-1/3" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-4">
              <span className="text-[#A88860] text-2xl">✦</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-[#4A3F35] mb-3">
              Thuê đồ chỉ với <span className="text-[#A88860]">4 bước</span>
            </h2>
            <p className="text-[#8C7E73] max-w-2xl mx-auto">Quy trình đơn giản, nhanh chóng — đặt trước online, nhận đồ khi đến Đà Lạt</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 relative">
            {/* Connecting line for desktop */}
            <div className="hidden lg:block absolute top-[120px] left-0 w-full h-[1px] border-t-2 border-dashed border-[#A88860]/20 -z-10" />

            {[
              { step: "01", title: "Chọn outfit", desc: "Duyệt qua các phong cách, lọc theo size, giá và style yêu thích", Icon: Shirt, iconBg: "bg-[#FDF6ED]", iconColor: "text-[#D4A373]" },
              { step: "02", title: "Đặt lịch online", desc: "Chọn ngày nhận, ngày trả, nhập thông tin liên hệ và gửi đơn", Icon: CalendarCheck, iconBg: "bg-[#FFF5F5]", iconColor: "text-[#E07A5F]" },
              { step: "03", title: "Nhận đồ", desc: "Nhận trang phục tại cửa hàng hoặc giao tận nơi nội thành Đà Lạt", Icon: Package, iconBg: "bg-[#F3F6F4]", iconColor: "text-[#819B86]" },
              { step: "04", title: "Trả đồ", desc: "Trả trang phục đúng hạn. Phụ thu 50% nếu trả trễ", Icon: RefreshCw, iconBg: "bg-[#F7F5FC]", iconColor: "text-[#9D8CB0]" },
            ].map((item, i) => (
              <div key={i} className="relative flex flex-col items-center text-center p-8 rounded-[24px] bg-white shadow-sm border border-[#E0D5C7]/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                
                {/* Arrow pointing to next step */}
                {i < 3 && (
                  <div className="hidden lg:flex absolute top-[104px] -right-4 translate-x-[50%] items-center justify-center w-8 h-8 rounded-full bg-[#FAF8F5] text-[#A88860]/50 z-10 border border-[#A88860]/10">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
                
                {/* Icon Container */}
                <div className={`w-20 h-20 rounded-[20px] ${item.iconBg} flex items-center justify-center mb-6 shadow-inner`}>
                  <item.Icon className={`w-10 h-10 ${item.iconColor}`} strokeWidth={1.25} />
                </div>
                
                {/* Step Number */}
                <div className="text-[32px] font-bold text-[#A88860] leading-none mb-3 font-serif">
                  {item.step}
                </div>
                
                <h3 className="text-lg font-bold text-[#4A3F35] mb-3">{item.title}</h3>
                
                {/* Small Diamond Separator */}
                <div className="flex justify-center mb-4">
                  <div className="w-1.5 h-1.5 bg-[#A88860]/40 rotate-45" />
                </div>
                
                <p className="text-sm text-[#8C7E73] leading-relaxed px-2">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* ===== VÌ SAO CHỌN DALAT LOOKBOOK ===== */}
      <FeaturesSection />

      {/* ===== FEEDBACK KHÁCH HÀNG ===== */}
      <CustomerReviews />

      {/* ===== CTA SECTION ===== */}
      <section className="py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-[#4A3A28] p-10 lg:p-16 text-center">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-rose/20 rounded-full blur-3xl" />
            <div className="relative">
              <div className="flex items-center justify-center gap-2 text-white/70 text-sm mb-4">
                <MapPin className="w-4 h-4" />
                Đà Lạt, Lâm Đồng
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Sẵn sàng cho chuyến đi Đà Lạt?
              </h2>
              <p className="text-white/70 max-w-xl mx-auto mb-8">
                Đặt thuê trang phục ngay hôm nay để có bộ ảnh đẹp nhất. Đa dạng phong cách, giá cả hợp lý!
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/products" className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-primary font-semibold rounded-full hover:bg-white/90 transition-colors shadow-lg">
                  Xem trang phục <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/register" className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-white/30 text-white font-semibold rounded-full hover:bg-white/10 transition-colors">
                  Đăng ký miễn phí
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
