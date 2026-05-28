import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  ShoppingBag,
  Heart,
  Share2,
  Info,
  MapPin,
  CheckCircle,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { getProductBySlug, getProducts } from "@/lib/db/products";
import ProductDetailClient from "./client-page";

const FAQ_ITEMS = [
  {
    q: "Làm sao để đặt thuê trang phục online?",
    a: "Bạn chọn outfit yêu thích → chọn ngày nhận, ngày trả → nhập thông tin liên hệ → gửi đơn. Cửa hàng sẽ xác nhận qua điện thoại trong vòng 1-2 giờ.",
  },
  {
    q: "Quy định thanh toán và tiền cọc như thế nào?",
    a: "Bạn cần đặt cọc một phần giá trị trang phục. Thanh toán tiền thuê khi nhận đồ. Tiền cọc sẽ được hoàn trả sau khi trả đồ đúng hạn và đúng tình trạng.",
  },
  {
    q: "Nếu trả đồ trễ thì sao?",
    a: "Phụ thu 50% giá thuê/ngày cho mỗi ngày trả trễ. Vui lòng liên hệ cửa hàng trước nếu cần gia hạn.",
  },
  {
    q: "Có được đổi đồ sau khi đặt không?",
    a: "Có thể đổi nếu đơn chưa được xác nhận. Sau khi xác nhận, vui lòng liên hệ hotline 0909 123 456 để được hỗ trợ.",
  },
];

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Fetch related products (same category)
  const relatedProductsRaw = await getProducts({
    categorySlug: product.category_slug,
    limit: 5, // fetch 5 to filter out current product
  });
  
  const relatedProducts = relatedProductsRaw
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted mb-6">
          <Link href="/" className="hover:text-primary transition-colors">Trang chủ</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-primary transition-colors">Thuê trang phục</Link>
          <span>/</span>
          <Link href={`/products?style=${product.category_slug}`} className="hover:text-primary transition-colors">
            {product.category_name}
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium truncate max-w-[200px]">{product.name}</span>
        </nav>

        {/* Product Detail */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left - Images (Client Component) */}
          <ProductDetailClient images={product.images} thumbnailUrl={product.thumbnail_url} />

          {/* Right - Info */}
          <div className="lg:py-2">
            <Link href={`/products?style=${product.category_slug}`} className="style-badge inline-block mb-3">
              {product.category_name}
            </Link>

            <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">{product.name}</h1>

            {/* Status */}
            <div className="flex items-center gap-2 mb-4">
              {product.status === "available" ? (
                <>
                  <span className="flex items-center gap-1 text-sm font-medium text-green-600">
                    <CheckCircle className="w-4 h-4" /> Còn hàng
                  </span>
                  <span className="text-sm text-muted">· {product.quantity} bộ có sẵn</span>
                </>
              ) : (
                <span className="flex items-center gap-1 text-sm font-medium text-orange-500">
                  <AlertTriangle className="w-4 h-4" /> Đang được thuê
                </span>
              )}
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2 mb-5 pb-5 border-b border-border">
              <span className="text-3xl font-extrabold text-primary">{formatPrice(product.price_per_day)}</span>
              <span className="text-muted text-sm">/ngày</span>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="bg-surface rounded-xl p-3.5">
                <div className="text-[11px] text-muted mb-0.5">Tiền cọc</div>
                <div className="text-sm font-semibold text-foreground">{formatPrice(product.deposit)}</div>
              </div>
              <div className="bg-surface rounded-xl p-3.5">
                <div className="text-[11px] text-muted mb-0.5">Màu sắc</div>
                <div className="text-sm font-semibold text-foreground">{product.color || "—"}</div>
              </div>
              <div className="bg-surface rounded-xl p-3.5">
                <div className="text-[11px] text-muted mb-0.5">Kích cỡ</div>
                <div className="text-sm font-semibold text-foreground">Freesize</div>
              </div>
              <div className="bg-surface rounded-xl p-3.5">
                <div className="text-[11px] text-muted mb-0.5">Chất liệu</div>
                <div className="text-sm font-semibold text-foreground">Thoáng mát</div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-5 pb-5 border-b border-border">
              <h3 className="text-sm font-semibold text-foreground mb-2">Mô tả sản phẩm</h3>
              <p className="text-sm text-foreground/75 leading-relaxed">{product.description}</p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              <Link
                href={`/rental/${product.id}`}
                className={`btn-primary flex-1 flex items-center justify-center gap-2 text-center text-base ${
                  product.status === "rented" ? "opacity-50 cursor-not-allowed pointer-events-none" : ""
                }`}
              >
                <ShoppingBag className="w-5 h-5" />
                {product.status === "rented" ? "Hết đồ" : "Đặt thuê ngay"}
              </Link>
              <button className="btn-outline flex items-center justify-center gap-2">
                <Heart className="w-4 h-4" />
                Yêu thích
              </button>
              <button className="btn-outline flex items-center justify-center gap-2 px-4">
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            {/* Policies */}
            <div className="bg-primary/5 rounded-xl p-4 space-y-2.5">
              <div className="flex items-start gap-2 text-sm text-foreground/80">
                <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span>Nhận tại cửa hàng hoặc giao trong nội thành Đà Lạt</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-foreground/80">
                <Info className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span>Đặt trước ít nhất 1 ngày để đảm bảo trang phục sẵn sàng</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-foreground/80">
                <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 shrink-0" />
                <span>Phụ thu 50% giá thuê/ngày nếu trả trễ hạn</span>
              </div>
            </div>
          </div>
        </div>

        {/* ===== FAQ ===== */}
        {/* Skipping interactive FAQ for simplicity in server component, or we can move it to client */}
        <section className="mt-12 lg:mt-16">
          <h2 className="text-xl font-bold text-foreground mb-6">Câu hỏi thường gặp</h2>
          <div className="max-w-3xl space-y-3">
            {FAQ_ITEMS.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl border border-border overflow-hidden">
                <div className="w-full flex items-center justify-between px-5 py-4 text-left">
                  <span className="text-sm font-semibold text-foreground pr-4">{faq.q}</span>
                </div>
                <div className="px-5 pb-4 text-sm text-foreground/70 leading-relaxed">
                  {faq.a}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== RELATED PRODUCTS ===== */}
        {relatedProducts.length > 0 && (
          <section className="mt-12 lg:mt-16">
            <h2 className="text-xl font-bold text-foreground mb-6">Sản phẩm liên quan</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-5">
              {relatedProducts.map((p) => (
                <div key={p.id} className="product-card group bg-white rounded-2xl overflow-hidden border border-border">
                  <Link href={`/products/${p.slug}`} className="block relative aspect-[3/4] bg-gradient-to-br from-surface to-surface-hover overflow-hidden">
                    {p.thumbnail_url ? (
                      <Image
                        src={p.thumbnail_url}
                        alt={p.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-5xl lg:text-6xl">👗</span>
                      </div>
                    )}
                    <div className="absolute top-3 left-3 style-badge">{p.category_name}</div>
                  </Link>
                  <div className="p-3.5">
                    {p.color && (
                      <div className="flex items-center gap-1 mb-1">
                        <span className="text-[9px] font-medium text-muted bg-surface px-1.5 py-0.5 rounded">{p.color}</span>
                      </div>
                    )}
                    <Link href={`/products/${p.slug}`}>
                      <h3 className="text-sm font-semibold text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-1">
                        {p.name}
                      </h3>
                    </Link>
                    <div className="flex items-baseline gap-1 mb-2.5">
                      <span className="text-sm font-bold text-primary">{formatPrice(p.price_per_day)}</span>
                      <span className="text-[10px] text-muted">/ngày</span>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/products/${p.slug}`} className="flex-1 text-center text-[11px] font-medium py-1.5 rounded-lg border border-border text-foreground/70 hover:border-primary hover:text-primary transition-colors">
                        Chi tiết
                      </Link>
                      <Link href={`/rental/${p.id}`} className="flex-1 text-center text-[11px] font-semibold py-1.5 rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors">
                        Đặt thuê
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
