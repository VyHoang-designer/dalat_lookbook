"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice, formatDate, ORDER_STATUS_MAP } from "@/lib/utils";
import type { RentalOrder } from "@/lib/db/orders";
import { 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  Search, 
  ChevronDown, 
  Shirt,
  MapPin,
  Calendar,
  XCircle,
  Package,
  Eye
} from "lucide-react";

interface MyOrdersClientProps {
  orders: RentalOrder[];
}

const TABS = [
  { label: "Tất cả", value: "all" },
  { label: "Chờ xác nhận", value: "pending" },
  { label: "Đã xác nhận", value: "confirmed" },
  { label: "Đang thuê", value: "renting" },
  { label: "Hoàn tất", value: "completed" },
  { label: "Đã hủy", value: "cancelled" },
];

export default function MyOrdersClient({ orders }: MyOrdersClientProps) {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
  const [isSortOpen, setIsSortOpen] = useState(false);

  // Statistics
  const stats = useMemo(() => {
    return {
      total: orders.length,
      pending: orders.filter(o => o.status === "pending" || o.status === "awaiting_deposit").length,
      renting: orders.filter(o => o.status === "renting").length,
      completed: orders.filter(o => o.status === "completed").length,
    };
  }, [orders]);

  // Filter & Sort
  const filteredOrders = useMemo(() => {
    let result = [...orders];

    // Lọc theo Tab
    if (activeTab !== "all") {
      if (activeTab === "pending") {
        result = result.filter(o => o.status === "pending" || o.status === "awaiting_deposit");
      } else {
        result = result.filter(o => o.status === activeTab);
      }
    }

    // Lọc theo Search (mã đơn hoặc tên sản phẩm)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(o => 
        o.id.toLowerCase().includes(q) || 
        (o.product_name && o.product_name.toLowerCase().includes(q))
      );
    }

    // Sort
    result.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortBy === "newest" ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [orders, activeTab, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Banner Section */}
        <div className="relative rounded-[2rem] overflow-hidden bg-[#F3EBE0] mb-8 p-8 flex flex-col md:flex-row justify-between items-center min-h-[160px]">
          {/* Background Image Overlay (Right Side) */}
          <div className="absolute inset-y-0 right-0 w-[50%] md:w-[40%] z-0">
            <Image 
              src="https://foikyihnyuthrnlteudt.supabase.co/storage/v1/object/public/product_images/ChatGPT%20Image%2011_11_28%2028%20thg%205,%202026.png"
              alt="Banner"
              fill
              className="object-cover object-left opacity-90 [mask-image:linear-gradient(to_right,transparent,black_20%)]"
            />
          </div>

          {/* Banner Content */}
          <div className="relative z-10 flex items-center gap-4 w-full">
            <div className="w-16 h-16 rounded-2xl bg-[#A68A61] flex items-center justify-center shrink-0 shadow-md">
              <Package className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#3E2723]">Đơn thuê của tôi</h1>
              <p className="text-sm text-[#5D4037] mt-1 font-medium">Theo dõi trạng thái các đơn đặt thuê trang phục</p>
            </div>
          </div>
        </div>

        {/* Summary Cards (Overlapping Banner) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 -mt-16 relative z-20 px-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#EFEBE4] flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#F5F0E6] flex items-center justify-center shrink-0">
              <ShoppingBag className="w-5 h-5 text-[#8B6F47]" />
            </div>
            <div>
              <div className="text-xs font-semibold text-[#8B6F47] uppercase tracking-wider mb-0.5">Tổng đơn</div>
              <div className="text-2xl font-bold text-[#3E2723] leading-none">{stats.total}</div>
              <div className="text-[10px] text-muted mt-1">đơn hàng</div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#EFEBE4] flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <div className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-0.5">Chờ xác nhận</div>
              <div className="text-2xl font-bold text-[#3E2723] leading-none">{stats.pending}</div>
              <div className="text-[10px] text-muted mt-1">đơn hàng</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#EFEBE4] flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center shrink-0">
              <Shirt className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="text-xs font-semibold text-purple-700 uppercase tracking-wider mb-0.5">Đang thuê</div>
              <div className="text-2xl font-bold text-[#3E2723] leading-none">{stats.renting}</div>
              <div className="text-[10px] text-muted mt-1">đơn hàng</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#EFEBE4] flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-xs font-semibold text-green-700 uppercase tracking-wider mb-0.5">Hoàn tất</div>
              <div className="text-2xl font-bold text-[#3E2723] leading-none">{stats.completed}</div>
              <div className="text-[10px] text-muted mt-1">đơn hàng</div>
            </div>
          </div>
        </div>

        {/* Tabs Row */}
        <div className="mb-4">
          <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
            {TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                  activeTab === tab.value
                    ? "bg-[#8B6F47] text-white shadow-md shadow-[#8B6F47]/20"
                    : "bg-[#F3EBE0] text-[#5D4037] hover:bg-[#EAE0D3]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search & Sort Row */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
          <div className="relative w-full sm:w-[350px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input 
              type="text" 
              placeholder="Tìm theo mã đơn hoặc tên outfit"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white border border-[#EFEBE4] text-sm focus:outline-none focus:ring-2 focus:ring-[#8B6F47]/20 focus:border-[#8B6F47] transition-all placeholder:text-muted/70"
            />
          </div>
          
          <div className="relative shrink-0 self-end sm:self-auto">
            <button 
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white border border-[#EFEBE4] text-sm font-medium text-[#3E2723] hover:bg-surface transition-colors"
            >
              <div className="flex items-center gap-1.5">
                <span className="text-muted">⇅</span>
                {sortBy === "newest" ? "Mới nhất" : "Cũ nhất"}
              </div>
              <ChevronDown className="w-4 h-4 text-muted" />
            </button>

            {isSortOpen && (
              <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-xl shadow-lg border border-border overflow-hidden z-30">
                <button 
                  onClick={() => { setSortBy("newest"); setIsSortOpen(false); }}
                  className={`w-full text-left px-4 py-3 text-sm hover:bg-surface transition-colors ${sortBy === "newest" ? "font-semibold text-primary" : "text-foreground"}`}
                >
                  Mới nhất
                </button>
                <button 
                  onClick={() => { setSortBy("oldest"); setIsSortOpen(false); }}
                  className={`w-full text-left px-4 py-3 text-sm hover:bg-surface transition-colors ${sortBy === "oldest" ? "font-semibold text-primary" : "text-foreground"}`}
                >
                  Cũ nhất
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-[2rem] p-12 border border-[#EFEBE4] text-center flex flex-col items-center">
              <div className="w-24 h-24 bg-[#F5F0E6] rounded-full flex items-center justify-center mb-6">
                <ShoppingBag className="w-10 h-10 text-[#8B6F47]" />
              </div>
              <h3 className="text-xl font-bold text-[#3E2723] mb-2">Không tìm thấy đơn hàng</h3>
              <p className="text-[#5D4037] mb-8 max-w-sm">
                Bạn chưa có đơn đặt thuê nào phù hợp với bộ lọc hiện tại.
              </p>
              <Link href="/products" className="bg-[#8B6F47] hover:bg-[#7A603D] text-white px-8 py-3 rounded-full font-semibold transition-colors">
                Khám phá trang phục
              </Link>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function OrderCard({ order }: { order: RentalOrder }) {
  const shortId = order.id.split("-")[0].toUpperCase();
  
  // Progress Logic
  // Mốc: Chờ xác nhận (1) -> Đã xác nhận (2) -> Đang thuê (3) -> Hoàn tất (4)
  let currentStep = 0;
  if (order.status === "pending" || order.status === "awaiting_deposit") currentStep = 1;
  else if (order.status === "confirmed") currentStep = 2;
  else if (order.status === "renting") currentStep = 3;
  else if (order.status === "completed") currentStep = 4;
  else if (order.status === "cancelled") currentStep = 0; // Hủy

  const steps = [
    { label: "Đã xác nhận", isActive: currentStep >= 2, isCurrent: currentStep === 2, date: currentStep >= 2 ? order.created_at : null }, // Mock date
    { label: "Đang thuê", isActive: currentStep >= 3, isCurrent: currentStep === 3, date: currentStep >= 3 ? order.start_date : null },
    { label: "Hoàn tất", isActive: currentStep >= 4, isCurrent: currentStep === 4, date: currentStep >= 4 ? order.end_date : null }
  ];

  const statusMap = {
    pending: { label: "Chờ xác nhận", color: "bg-amber-100 text-amber-700" },
    awaiting_deposit: { label: "Chờ duyệt cọc", color: "bg-orange-100 text-orange-700" },
    confirmed: { label: "Đã xác nhận", color: "bg-blue-100 text-blue-700" },
    renting: { label: "Đang thuê", color: "bg-purple-100 text-purple-700" },
    completed: { label: "Hoàn tất", color: "bg-green-100 text-green-700" },
    cancelled: { label: "Đã hủy", color: "bg-red-100 text-red-700" },
  };

  const currentStatus = statusMap[order.status as keyof typeof statusMap] || statusMap.pending;

  return (
    <div className="bg-white rounded-[1.5rem] p-5 border border-[#EFEBE4] hover:shadow-lg hover:shadow-black/5 transition-all duration-300">
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Left: Product Info (approx 40%) */}
        <div className="flex items-start gap-4 lg:w-[40%]">
          <div className="w-[100px] h-[130px] rounded-2xl bg-surface overflow-hidden relative shrink-0 shadow-sm">
            {order.product_thumbnail ? (
              <Image src={order.product_thumbnail} alt={order.product_name || ""} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100"><Shirt className="w-8 h-8 text-gray-300"/></div>
            )}
          </div>
          
          <div className="flex flex-col justify-between py-1 h-full min-h-[130px]">
            <div>
              <h3 className="font-bold text-[#3E2723] text-[15px] line-clamp-2 leading-snug mb-1.5">
                {order.product_name}
              </h3>
              <div className="text-xs text-muted font-medium mb-3">
                Mã đơn: <span className="text-[#3E2723]">#DL{shortId}</span> <span className="mx-1.5">·</span> Size: Freesize
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs text-[#5D4037] font-medium">
                <Calendar className="w-3.5 h-3.5 text-muted" />
                <span>{formatDate(order.start_date)} → {formatDate(order.end_date)}</span>
                <span className="text-muted ml-1">({order.rental_days} ngày)</span>
              </div>
              <div className="flex items-center gap-4 text-xs font-semibold">
                <span className="text-[#3E2723] flex items-center gap-1"><span className="text-amber-500">💰</span> Giá thuê: {formatPrice(order.total_price)}</span>
                <span className="text-muted flex items-center gap-1"><span className="text-amber-500">🛡️</span> Cọc: {formatPrice(order.deposit_amount || 0)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Middle: Stepper (approx 40%) */}
        <div className="lg:w-[40%] flex items-center justify-center py-4 lg:py-0 px-4 lg:px-8 border-y lg:border-y-0 lg:border-x border-[#EFEBE4] border-dashed">
          {order.status === "cancelled" ? (
            <div className="flex flex-col items-center justify-center text-center w-full">
              <XCircle className="w-10 h-10 text-red-500 mb-2" />
              <div className="font-semibold text-red-600">Đơn hàng đã hủy</div>
              <div className="text-xs text-muted mt-1">Đơn hàng không được thực hiện.</div>
            </div>
          ) : (
            <div className="w-full relative flex items-center justify-between max-w-sm mx-auto">
              {/* Lines */}
              <div className="absolute left-6 right-6 top-4 h-0.5 bg-[#F5F0E6] -z-10"></div>
              <div 
                className="absolute left-6 top-4 h-0.5 bg-primary transition-all duration-500 -z-10" 
                style={{ 
                  width: currentStep >= 4 ? 'calc(100% - 3rem)' : currentStep >= 3 ? '50%' : '0%'
                }}
              ></div>

              {/* Step 1 */}
              <div className="flex flex-col items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 bg-white transition-colors duration-300 ${steps[0].isActive ? 'border-primary text-primary' : 'border-[#EFEBE4] text-muted'}`}>
                  {steps[0].isActive ? <CheckCircle2 className="w-5 h-5" /> : 1}
                </div>
                <div className="text-center">
                  <div className={`text-[11px] font-semibold ${steps[0].isCurrent ? 'text-primary' : steps[0].isActive ? 'text-[#3E2723]' : 'text-muted'}`}>{steps[0].label}</div>
                  {steps[0].date && <div className="text-[10px] text-muted/70">{formatDate(steps[0].date)}</div>}
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 bg-white transition-colors duration-300 ${steps[1].isActive ? 'border-primary text-primary' : steps[1].isCurrent ? 'border-purple-500 text-purple-500' : 'border-[#EFEBE4] text-muted'}`}>
                  {steps[1].isActive ? <CheckCircle2 className="w-5 h-5" /> : 2}
                </div>
                <div className="text-center">
                  <div className={`text-[11px] font-semibold ${steps[1].isCurrent ? 'text-purple-600' : steps[1].isActive ? 'text-[#3E2723]' : 'text-muted'}`}>{steps[1].label}</div>
                  {steps[1].date && <div className="text-[10px] text-muted/70">{formatDate(steps[1].date)}</div>}
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 bg-white transition-colors duration-300 ${steps[2].isActive ? 'border-green-500 text-green-500' : steps[2].isCurrent ? 'border-green-500 text-green-500' : 'border-[#EFEBE4] text-muted'}`}>
                  {steps[2].isActive ? <CheckCircle2 className="w-5 h-5" /> : 3}
                </div>
                <div className="text-center">
                  <div className={`text-[11px] font-semibold ${steps[2].isActive ? 'text-green-600' : 'text-muted'}`}>{steps[2].label}</div>
                  {steps[2].date && <div className="text-[10px] text-muted/70">{formatDate(steps[2].date)}</div>}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Actions (approx 20%) */}
        <div className="lg:w-[20%] flex flex-col justify-center gap-3 shrink-0">
          <div className="flex justify-center lg:justify-end mb-2">
            <span className={`px-4 py-1.5 rounded-full text-xs font-bold w-full text-center ${currentStatus.color}`}>
              {currentStatus.label}
            </span>
          </div>
          
          <Link href={`/my-orders/${order.id}`} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#EFEBE4] text-xs font-semibold text-[#5D4037] hover:bg-surface hover:text-[#3E2723] transition-colors">
            <Eye className="w-4 h-4" /> Xem chi tiết
          </Link>
          
          {order.status === "completed" || order.status === "cancelled" ? (
            <Link href={`/rental/${order.product_id}`} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#8B6F47] text-white text-xs font-semibold hover:bg-[#7A603D] transition-colors shadow-sm">
              <ShoppingBag className="w-4 h-4" /> Thuê lại
            </Link>
          ) : (
            <Link href="/lien-he" className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#F5F0E6] text-[#8B6F47] text-xs font-semibold hover:bg-[#EAE0D3] transition-colors">
              Liên hệ shop
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
