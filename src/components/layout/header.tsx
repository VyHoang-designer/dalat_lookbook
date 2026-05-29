"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import {
  Menu,
  X,
  ShoppingBag,
  User,
  LogIn,
  LogOut,
  ChevronDown,
  Search,
  MapPin,
  Phone,
  Clock,
  AlertTriangle,
  Shield,
} from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const CATEGORIES = [
  { name: "Vintage Đà Lạt", slug: "vintage-da-lat", emoji: "🌸" },
  { name: "Nàng thơ", slug: "nang-tho", emoji: "🦋" },
  { name: "Hàn Quốc", slug: "han-quoc", emoji: "🇰🇷" },
  { name: "Y2K", slug: "y2k", emoji: "✨" },
  { name: "Picnic", slug: "picnic", emoji: "🧺" },
  { name: "Couple", slug: "couple", emoji: "💕" },
  { name: "Nhóm bạn", slug: "nhom-ban", emoji: "👯" },
  { name: "Công chúa", slug: "cong-chua", emoji: "👑" },
];

const NAV_ITEMS = [
  { name: "Trang chủ", href: "/" },
  { name: "Thuê trang phục", href: "/products" },
  { name: "Style", href: "#", hasDropdown: true },
  { name: "Lookbook", href: "/lookbook" },
  { name: "Cách thuê", href: "/huong-dan" },
  { name: "Liên hệ hỗ trợ", href: "/lien-he" },
];

export function Header() {
  const router = useRouter();
  const { user, loading, refreshUser } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    await refreshUser();
    setUserMenuOpen(false);
    setMobileOpen(false);
    router.push("/");
    router.refresh();
  };
  const [styleDropdownOpen, setStyleDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!searchQuery.trim()) {
        setSuggestions([]);
        return;
      }
      const supabase = createClient();
      const { data } = await supabase
        .from("products")
        .select("id, name, slug, thumbnail_url, price_per_day")
        .ilike("name", `%${searchQuery}%`)
        .limit(5);
      
      setSuggestions(data || []);
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      setSearchOpen(false);
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const isAdmin = user?.role === "admin";

  return (
    <>
      {/* ===== TOP BAR ===== */}
      <div className="bg-[#2C2420] text-white/90 text-xs py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="hidden sm:flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Phone className="w-3 h-3 text-accent" />
              Hotline: <strong>0909 123 456</strong>
            </span>
            <span className="hidden md:flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-accent" />
              Giờ mở cửa: <strong>8:00 – 21:00</strong>
            </span>
          </div>
          <div className="flex items-center gap-1.5 mx-auto sm:mx-0">
            <AlertTriangle className="w-3 h-3 text-yellow-400" />
            <span>Phụ thu <strong>50%</strong> mỗi ngày trả trễ hạn</span>
          </div>
        </div>
      </div>

      {/* ===== MAIN HEADER ===== */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-[68px]">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group shrink-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                <span className="text-white font-extrabold text-sm tracking-tight">DL</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-extrabold text-primary tracking-tight leading-5">Dalat</span>
                <span className="text-[10px] font-semibold text-accent tracking-[0.2em] uppercase leading-3">Lookbook</span>
              </div>
            </Link>

            {/* Desktop Search */}
            <div className="hidden lg:flex flex-1 max-w-md mx-8" ref={searchRef}>
              <form onSubmit={handleSearchSubmit} className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder="Tìm trang phục, style, outfit..."
                  className="w-full pl-4 pr-12 py-2.5 text-sm border-2 border-border rounded-full bg-surface/50 focus:bg-white focus:border-primary/50 focus:outline-none transition-all placeholder:text-muted"
                  suppressHydrationWarning
                />
                <button type="submit" className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 bg-primary rounded-full flex items-center justify-center hover:bg-primary-dark transition-colors">
                  <Search className="w-3.5 h-3.5 text-white" />
                </button>

                {/* Suggestions Dropdown */}
                {showSuggestions && searchQuery.trim() !== "" && (
                  <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-xl border border-border/50 overflow-hidden animate-slide-down z-50">
                    {suggestions.length > 0 ? (
                      <div className="py-2">
                        <div className="px-4 py-2 text-xs font-semibold text-muted uppercase tracking-wider bg-surface/30">
                          Sản phẩm gợi ý
                        </div>
                        {suggestions.map((item) => (
                          <Link
                            key={item.id}
                            href={`/products/${item.slug}`}
                            onClick={() => {
                              setShowSuggestions(false);
                              setSearchQuery("");
                            }}
                            className="flex items-center gap-3 px-4 py-2 hover:bg-surface transition-colors"
                          >
                            <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center overflow-hidden shrink-0 relative">
                              {item.thumbnail_url ? (
                                <Image src={item.thumbnail_url} alt={item.name} fill className="object-cover" />
                              ) : (
                                <span className="text-xl">👗</span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium text-foreground truncate">{item.name}</h4>
                              <p className="text-xs font-bold text-primary">{formatPrice(item.price_per_day)}/ngày</p>
                            </div>
                          </Link>
                        ))}
                        <button
                          type="submit"
                          className="w-full text-center py-2.5 text-xs font-medium text-primary hover:bg-primary/5 transition-colors border-t border-border/50 mt-1"
                        >
                          Xem tất cả kết quả cho "{searchQuery}"
                        </button>
                      </div>
                    ) : (
                      <div className="p-4 text-center text-sm text-muted">
                        Không tìm thấy sản phẩm nào
                      </div>
                    )}
                  </div>
                )}
              </form>
            </div>

            {/* Desktop Right Actions */}
            <div className="hidden lg:flex items-center gap-3 shrink-0">
              {/* Address */}
              <div className="hidden xl:flex items-center gap-1.5 text-xs text-muted mr-2">
                <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="max-w-[140px] truncate">Phan Đình Phùng, Đà Lạt</span>
              </div>
              <div className="hidden xl:block w-px h-6 bg-border" />

              {/* My Orders */}
              <Link
                href="/my-orders"
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-foreground/70 hover:text-primary transition-colors rounded-lg hover:bg-surface"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden xl:inline">Đơn thuê</span>
              </Link>

              {/* User Menu */}
              {loading ? (
                <div className="w-8 h-8 rounded-full bg-surface animate-pulse" />
              ) : user ? (
                <div className="relative"
                  onMouseEnter={() => setUserMenuOpen(true)}
                  onMouseLeave={() => setUserMenuOpen(false)}
                >
                  <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-surface transition-colors">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {user.fullName?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                      </span>
                    </div>
                    <div className="hidden xl:block text-left">
                      <div className="text-sm font-medium text-foreground leading-4 max-w-[120px] truncate">
                        {user.fullName || user.email.split("@")[0]}
                      </div>
                      <div className="text-[10px] text-muted leading-3">
                        {isAdmin ? "Quản trị viên" : "Khách hàng"}
                      </div>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-muted" />
                  </button>

                  {/* Dropdown */}
                  {userMenuOpen && (
                    <div className="absolute top-full right-0 mt-1 w-52 bg-white rounded-xl shadow-xl border border-border/50 py-2 animate-slide-down z-50">
                      <div className="px-4 py-2 border-b border-border/50">
                        <div className="text-sm font-medium text-foreground truncate">
                          {user.fullName || "Chưa đặt tên"}
                        </div>
                        <div className="text-xs text-muted truncate">{user.email}</div>
                        {isAdmin && (
                          <div className="flex items-center gap-1 mt-1 text-[10px] font-semibold text-amber-700 bg-amber-50 rounded-full px-2 py-0.5 w-fit">
                            <Shield className="w-3 h-3" /> Admin
                          </div>
                        )}
                      </div>

                      {isAdmin && (
                        <Link
                          href="/admin"
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground/80 hover:text-primary hover:bg-primary/5 transition-colors"
                        >
                          <Shield className="w-4 h-4" />
                          Trang quản trị
                        </Link>
                      )}

                      <Link
                        href="/my-orders"
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground/80 hover:text-primary hover:bg-primary/5 transition-colors"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        Đơn thuê của tôi
                      </Link>

                      <div className="border-t border-border/50 mt-1 pt-1">
                        <button
                          onClick={handleSignOut}
                          className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Đăng xuất
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/login" className="flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold btn-primary">
                  <LogIn className="w-4 h-4" />
                  <span>Đăng nhập</span>
                </Link>
              )}
            </div>

            {/* Mobile Actions */}
            <div className="flex lg:hidden items-center gap-2">
              <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 rounded-lg hover:bg-surface transition-colors" aria-label="Tìm kiếm">
                <Search className="w-5 h-5 text-foreground/70" />
              </button>
              <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded-lg hover:bg-surface transition-colors" aria-label="Menu">
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          {searchOpen && (
            <div className="lg:hidden pb-3 animate-slide-down">
              <div className="relative">
                <input type="text" placeholder="Tìm trang phục, style, outfit..." className="w-full pl-4 pr-12 py-3 text-sm border-2 border-border rounded-xl bg-surface/50 focus:bg-white focus:border-primary/50 focus:outline-none transition-all" autoFocus suppressHydrationWarning />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Search className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ===== NAVIGATION BAR ===== */}
        <div className="hidden lg:block border-t border-border/50 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-0">
              {NAV_ITEMS.map((item) => (
                <div key={item.name} className="relative"
                  onMouseEnter={() => item.hasDropdown && setStyleDropdownOpen(true)}
                  onMouseLeave={() => item.hasDropdown && setStyleDropdownOpen(false)}
                >
                  {item.hasDropdown ? (
                    <button className="flex items-center gap-1 px-4 py-3 text-sm font-medium text-foreground/75 hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary">
                      {item.name}
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <Link href={item.href} className="block px-4 py-3 text-sm font-medium text-foreground/75 hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary">
                      {item.name}
                    </Link>
                  )}
                  {item.hasDropdown && styleDropdownOpen && (
                    <div className="absolute top-full left-0 mt-0 w-64 py-2 bg-white rounded-b-xl shadow-xl border border-border/50 animate-slide-down z-50">
                      {CATEGORIES.map((cat) => (
                        <Link key={cat.slug} href={`/products?style=${cat.slug}`} className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground/80 hover:text-primary hover:bg-primary/5 transition-colors">
                          <span className="text-lg">{cat.emoji}</span>
                          <span>{cat.name}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>

        {/* ===== MOBILE MENU ===== */}
        {mobileOpen && (
          <div className="lg:hidden bg-white border-t border-border animate-slide-down max-h-[80vh] overflow-y-auto">
            <div className="px-4 py-4 space-y-1">
              {/* User Info (mobile) */}
              {user && (
                <div className="flex items-center gap-3 px-4 py-3 mb-2 bg-surface rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <span className="text-white font-bold">
                      {user.fullName?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground">
                      {user.fullName || user.email.split("@")[0]}
                    </div>
                    <div className="text-xs text-muted">
                      {isAdmin ? "👑 Quản trị viên" : "Khách hàng"}
                    </div>
                  </div>
                </div>
              )}

              <Link href="/" className="block px-4 py-3 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-surface rounded-xl transition-colors" onClick={() => setMobileOpen(false)}>
                🏠 Trang chủ
              </Link>
              <Link href="/products" className="block px-4 py-3 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-surface rounded-xl transition-colors" onClick={() => setMobileOpen(false)}>
                👗 Thuê trang phục
              </Link>
              <Link href="/lookbook" className="block px-4 py-3 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-surface rounded-xl transition-colors" onClick={() => setMobileOpen(false)}>
                📸 Lookbook
              </Link>
              <Link href="/huong-dan" className="block px-4 py-3 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-surface rounded-xl transition-colors" onClick={() => setMobileOpen(false)}>
                📋 Cách thuê
              </Link>

              {/* Style categories */}
              <div className="pt-2">
                <div className="px-4 py-2 text-xs font-semibold text-muted uppercase tracking-wider">Chọn theo Style</div>
                <div className="grid grid-cols-2 gap-1.5 px-2">
                  {CATEGORIES.map((cat) => (
                    <Link key={cat.slug} href={`/products?style=${cat.slug}`} className="flex items-center gap-2 px-3 py-2.5 text-sm text-foreground/70 hover:text-primary hover:bg-primary/5 rounded-xl transition-colors" onClick={() => setMobileOpen(false)}>
                      <span>{cat.emoji}</span><span>{cat.name}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Bottom actions */}
              <div className="border-t border-border mt-3 pt-3 space-y-1">
                {user ? (
                  <>
                    {isAdmin && (
                      <Link href="/admin" className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-xl transition-colors" onClick={() => setMobileOpen(false)}>
                        <Shield className="w-4 h-4" /> Trang quản trị
                      </Link>
                    )}
                    <Link href="/my-orders" className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-surface rounded-xl transition-colors" onClick={() => setMobileOpen(false)}>
                      <ShoppingBag className="w-4 h-4" /> Đơn thuê của tôi
                    </Link>
                    <button onClick={handleSignOut} className="flex items-center gap-2 w-full px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                      <LogOut className="w-4 h-4" /> Đăng xuất
                    </button>
                  </>
                ) : (
                  <Link href="/login" className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-primary hover:bg-primary/5 rounded-xl transition-colors" onClick={() => setMobileOpen(false)}>
                    <LogIn className="w-4 h-4" /> Đăng nhập / Đăng ký
                  </Link>
                )}
              </div>

              {/* Store info */}
              <div className="border-t border-border mt-3 pt-3 px-4 space-y-2">
                <div className="flex items-center gap-2 text-xs text-muted"><MapPin className="w-3.5 h-3.5 text-primary" />Phan Đình Phùng, TP. Đà Lạt</div>
                <div className="flex items-center gap-2 text-xs text-muted"><Phone className="w-3.5 h-3.5 text-primary" />0909 123 456</div>
                <div className="flex items-center gap-2 text-xs text-muted"><Clock className="w-3.5 h-3.5 text-primary" />8:00 – 21:00 hàng ngày</div>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
