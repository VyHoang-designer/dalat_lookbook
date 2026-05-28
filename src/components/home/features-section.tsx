import Image from "next/image";
import { Camera, Clock, ShieldCheck, Truck, Heart } from "lucide-react";

const FEATURES = [
  {
    num: "01",
    icon: Camera,
    title: "200+ mẫu trang phục",
    desc: "Đa dạng phong cách từ Vintage, Hàn Quốc đến Y2K, Công chúa",
  },
  {
    num: "02",
    icon: Clock,
    title: "Đặt trước tiện lợi",
    desc: "Xem mẫu, chọn size, đặt online trước khi đến Đà Lạt",
  },
  {
    num: "03",
    icon: ShieldCheck,
    title: "Đảm bảo chất lượng",
    desc: "Trang phục sạch sẽ, giặt ủi cẩn thận trước mỗi lần cho thuê",
  },
  {
    num: "04",
    icon: Truck,
    title: "Giao nhận linh hoạt",
    desc: "Nhận tại cửa hàng hoặc giao tận nơi nội thành Đà Lạt",
  },
];

export default function FeaturesSection() {
  return (
    <section className="relative py-20 lg:py-28 bg-[#FDFBF7] overflow-hidden">
      {/* Decorative leaf image on the left */}
      <div className="absolute top-1/2 -translate-y-1/2 left-0 w-[300px] h-[500px] lg:w-[450px] lg:h-[700px] opacity-40 pointer-events-none z-0">
        <Image
          src="https://foikyihnyuthrnlteudt.supabase.co/storage/v1/object/public/banner/banner_trangtri.png"
          alt="Decoration"
          fill
          className="object-contain object-left"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-16 items-center">
          {/* Left Side: Large Banner Card */}
          <div className="relative rounded-[2rem] bg-gradient-to-br from-[#F5EBE1] to-[#EBE0D3] p-8 lg:p-12 overflow-hidden shadow-sm h-full flex flex-col justify-center min-h-[450px]">
            {/* Background Dress Rack Image (Placeholder for the right side of the card) */}
            <div className="absolute right-0 bottom-0 top-0 w-1/2 opacity-30 md:opacity-100 mix-blend-multiply pointer-events-none" 
                 style={{ 
                   backgroundImage: 'url("https://images.unsplash.com/photo-1596783074918-c84cb06531ca?q=80&w=800")',
                   backgroundSize: 'cover',
                   backgroundPosition: 'center',
                   maskImage: 'linear-gradient(to right, transparent, black 40%)',
                   WebkitMaskImage: 'linear-gradient(to right, transparent, black 40%)'
                 }}>
            </div>

            <div className="relative z-10 max-w-[280px] sm:max-w-[320px]">
              <div className="text-2xl font-serif italic text-[#A67C52] mb-4 flex items-center gap-2">
                Trải nghiệm <span className="text-xl not-italic">✨</span>
              </div>
              <h3 className="text-3xl lg:text-[2.5rem] leading-tight font-bold text-[#3E2723] mb-6">
                Thuê outfit dễ dàng<br />Cho chuyến đi hoàn hảo
              </h3>
              <p className="text-[#6D5D55] text-sm leading-relaxed mb-10">
                Dalat Lookbook mang đến trải nghiệm thuê trang phục tiện lợi,
                nhanh chóng và chất lượng, giúp bạn tự tin tỏa sáng trong mọi
                khung hình tại Đà Lạt.
              </p>

              <div className="inline-flex items-center gap-4 bg-white/60 backdrop-blur-md px-5 py-3 rounded-full shadow-sm border border-white/50">
                <div className="w-10 h-10 rounded-full bg-[#8A6A45] flex items-center justify-center shrink-0 shadow-inner">
                  <Heart className="w-5 h-5 text-white fill-white" />
                </div>
                <p className="text-xs font-semibold text-[#5D4037]">
                  Hơn 10.000+ khách hàng tin tưởng<br />và lựa chọn Dalat Lookbook
                </p>
              </div>
            </div>
          </div>

          {/* Right Side: Features Grid */}
          <div>
            <div className="text-center lg:text-left mb-10">
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
                <span className="w-10 h-[1px] bg-[#A67C52]"></span>
                <span className="text-[#A67C52] text-sm">♡</span>
                <span className="w-10 h-[1px] bg-[#A67C52]"></span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#3E2723] mb-4">
                Vì sao chọn <span className="text-[#8B6F47]">Dalat Lookbook?</span>
              </h2>
              <p className="text-[#6D5D55]">
                Trải nghiệm thuê outfit tiện lợi, nhanh chóng và phù hợp cho chuyến đi Đà Lạt của bạn
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-5 lg:gap-6">
              {FEATURES.map((f, i) => (
                <div
                  key={i}
                  className="bg-white rounded-3xl p-7 border border-[#F0EBE1] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative group"
                >
                  <div className="w-14 h-14 rounded-full bg-[#F8F4EE] flex items-center justify-center mb-5 group-hover:bg-[#8B6F47] transition-colors duration-300">
                    <f.icon className="w-6 h-6 text-[#8B6F47] group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="text-base font-bold text-[#3E2723] mb-2">{f.title}</h3>
                  <p className="text-sm text-[#766A61] leading-relaxed mb-6">{f.desc}</p>
                  
                  {/* Number line at bottom right */}
                  <div className="absolute bottom-5 right-6 flex items-center gap-2 opacity-60">
                    <div className="w-8 h-[1px] bg-[#A67C52]"></div>
                    <span className="text-[#A67C52] font-semibold text-sm">{f.num}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
