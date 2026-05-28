"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, ArrowRight, MapPin, ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { Product } from "@/lib/db/products";

// Define the lookbooks without the hardcoded products
const LOOKBOOKS_DATA = [
  {
    id: "1",
    title: "Nàng thơ bên Hồ Xuân Hương",
    location: "Hồ Xuân Hương",
    filterGroup: "Hồ Xuân Hương",
    desc: "Váy trắng bồng bềnh, phong cách pastel nhẹ nhàng, phù hợp chụp với mặt hồ lung linh vào buổi sáng sớm hoặc hoàng hôn.",
    styles: ["Nàng thơ", "Công chúa"],
    image_url: "https://foikyihnyuthrnlteudt.supabase.co/storage/v1/object/public/banner/hoxuanhuong.png",
  },
  {
    id: "2",
    title: "Vintage hoài cổ tại quán cà phê",
    location: "Quán cà phê Đà Lạt",
    filterGroup: "Quán cà phê",
    desc: "Tone nâu, be, đồ len và váy hoa nhí. Rất hợp với concept cổ kính, quán cà phê retro và những bức tường rêu phong.",
    styles: ["Vintage Đà Lạt", "Hàn Quốc"],
    image_url: "https://foikyihnyuthrnlteudt.supabase.co/storage/v1/object/public/banner/coffeshop.png",
  },
  {
    id: "3",
    title: "Picnic vườn hoa rực rỡ",
    location: "Vườn hoa thành phố Đà Lạt",
    filterGroup: "Vườn hoa",
    desc: "Váy caro, mũ beret, túi cói — set picnic outdoor hoàn hảo giữa vườn hoa rực rỡ, mang lại vibe tươi sáng và trẻ trung.",
    styles: ["Picnic", "Vintage Đà Lạt"],
    image_url: "https://foikyihnyuthrnlteudt.supabase.co/storage/v1/object/public/banner/vuonhoa.png",
  },
  {
    id: "4",
    title: "Phố đêm cá tính",
    location: "Chợ đêm & Phố đi bộ Đà Lạt",
    filterGroup: "Phố đêm",
    desc: "Phong cách năng động, cá tính với tone tối, jacket, boots và phụ kiện nổi bật. Tỏa sáng giữa phố đêm Đà Lạt.",
    styles: ["Y2K", "Hàn Quốc"],
    image_url: "https://foikyihnyuthrnlteudt.supabase.co/storage/v1/object/public/banner/phodem.png",
  },
  {
    id: "5",
    title: "Couple check-in Hẻm",
    location: "Hẻm check-in",
    filterGroup: "Couple",
    desc: "Outfit cặp đôi đồng điệu cho concept chụp hẻm sống ảo cực chất tại Đà Lạt.",
    styles: ["Couple", "Nhóm bạn"],
    image_url: "https://foikyihnyuthrnlteudt.supabase.co/storage/v1/object/public/banner/hem.png",
  },
];

const FILTERS = ["Tất cả", "Hồ Xuân Hương", "Quán cà phê", "Vườn hoa", "Phố đêm", "Couple"];

export default function LookbookClientPage({ products }: { products: Product[] }) {
  const [activeFilter, setActiveFilter] = useState("Tất cả");

  const filteredLookbooks = LOOKBOOKS_DATA.filter(
    (lb) => activeFilter === "Tất cả" || lb.filterGroup === activeFilter
  );

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Header */}
      <div className="relative pt-12 pb-8 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <nav className="flex items-center gap-2 text-sm text-[#8C7E73] mb-6 justify-center">
            <Link href="/" className="hover:text-[#4A3F35] transition-colors">Trang chủ</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#4A3F35] font-medium">Lookbook</span>
          </nav>
          
          <h1 className="text-4xl lg:text-5xl font-bold text-[#4A3F35] mb-4 font-serif">
            Lookbook Đà Lạt <span className="text-[#A88860]">✦</span>
          </h1>
          <p className="text-[#8C7E73] max-w-xl mx-auto font-medium">
            Khám phá outfit theo từng địa điểm check-in nổi tiếng tại Đà Lạt
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="flex flex-wrap items-center justify-center gap-3">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 shadow-sm
                ${
                  activeFilter === filter
                    ? "bg-[#8B6F47] text-white border border-[#8B6F47]"
                    : "bg-white text-[#4A3F35] border border-[#E0D5C7] hover:border-[#8B6F47] hover:text-[#8B6F47]"
                }
              `}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="space-y-12">
          {filteredLookbooks.map((lb, idx) => {
            // Lọc sản phẩm thực tế từ DB dựa trên styles (danh mục) của lookbook
            const suggestedProducts = products.filter(p => lb.styles.includes(p.category_name || ""));
            // Lấy tối đa 2 sản phẩm hiển thị
            const displayProducts = suggestedProducts.slice(0, 2);

            return (
              <article key={lb.id} className="bg-white rounded-[24px] shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col md:flex-row border border-[#E0D5C7]/50 p-2 md:p-3">
                
                {/* Visual - alternated based on index */}
                <div className={`w-full md:w-[45%] lg:w-[40%] relative aspect-[4/3] md:aspect-auto md:min-h-[400px] rounded-[18px] overflow-hidden ${idx % 2 !== 0 ? 'md:order-last' : ''}`}>
                  <Image
                    src={lb.image_url}
                    alt={lb.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 40vw"
                  />
                </div>

                {/* Content */}
                <div className="w-full md:w-[55%] lg:w-[60%] p-6 md:p-8 lg:p-10 flex flex-col justify-center">
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {lb.styles.map((s) => (
                      <span key={s} className="px-3 py-1 rounded-full bg-[#A88860] text-white text-[10px] font-bold tracking-wide">
                        {s}
                      </span>
                    ))}
                  </div>

                  <h2 className="text-2xl lg:text-3xl font-bold text-[#4A3F35] mb-2">{lb.title}</h2>
                  
                  <div className="flex items-center gap-1.5 text-sm text-[#8C7E73] font-medium mb-4">
                    <MapPin className="w-4 h-4 text-[#A88860]" />
                    {lb.location}
                  </div>
                  
                  <p className="text-[15px] text-[#5C5046] leading-relaxed mb-6 max-w-xl">{lb.desc}</p>

                  <div className="text-[10px] font-bold text-[#8C7E73] uppercase tracking-widest mb-3">Outfit Gợi Ý</div>
                  
                  {displayProducts.length > 0 ? (
                    <div className="flex flex-wrap gap-4 mb-8">
                      {displayProducts.map((p) => (
                        <Link key={p.slug} href={`/products/${p.slug}`} className="flex items-center gap-3 p-2 pr-4 bg-[#FAF8F5] rounded-xl hover:bg-[#F5EFE7] transition-colors border border-[#E0D5C7]/30 min-w-[220px]">
                          <div className="w-14 h-14 relative rounded-lg overflow-hidden shrink-0 bg-surface">
                            {p.thumbnail_url ? (
                              <Image src={p.thumbnail_url} alt={p.name} fill className="object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xl">👗</div>
                            )}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-[#4A3F35] mb-1 line-clamp-1">{p.name}</div>
                            <div className="text-sm font-bold text-[#8B6F47]">{formatPrice(p.price_per_day)}<span className="text-[10px] font-medium text-[#8C7E73]">/ngày</span></div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-[#8C7E73] mb-8 italic">Chưa có sản phẩm nào thuộc phong cách này.</div>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-4 mt-auto pt-6 border-t border-dashed border-[#E0D5C7]">
                    <Link href={`/products`} className="inline-flex items-center gap-1.5 text-sm font-bold text-[#8B6F47] hover:text-[#4A3F35] transition-colors">
                      Xem full lookbook <ArrowRight className="w-4 h-4" />
                    </Link>
                    
                    <Link href="/products" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#8B6F47] hover:bg-[#6B5435] text-white text-sm font-bold transition-colors shadow-md shadow-[#8B6F47]/20">
                      <ShoppingBag className="w-4 h-4" />
                      Đặt outfit
                    </Link>
                  </div>

                </div>
              </article>
            );
          })}
          
          {filteredLookbooks.length === 0 && (
            <div className="text-center py-20 text-[#8C7E73]">
              Không tìm thấy lookbook nào cho địa điểm này.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
