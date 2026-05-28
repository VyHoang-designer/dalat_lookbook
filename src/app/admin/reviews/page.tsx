import { Star, Eye, EyeOff } from "lucide-react";
import { getAllReviews } from "@/lib/db/reviews";
import ReviewsClient from "./reviews-client";

export default async function AdminReviewsPage() {
  const reviews = await getAllReviews();
  
  const totalReviews = reviews.length;
  const visibleReviews = reviews.filter(r => r.is_visible).length;
  const featuredReviews = reviews.filter(r => r.is_featured).length;
  
  const avgRating = totalReviews > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
    : "0.0";

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Quản lý Đánh giá</h1>
          <p className="text-muted text-sm mt-1">Quản lý nội dung đánh giá và hiển thị trên trang chủ</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-border shadow-sm">
          <div className="text-muted text-xs font-semibold uppercase tracking-wider mb-2">Tổng đánh giá</div>
          <div className="text-2xl font-bold text-foreground">{totalReviews}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-border shadow-sm">
          <div className="text-muted text-xs font-semibold uppercase tracking-wider mb-2">Điểm trung bình</div>
          <div className="text-2xl font-bold text-amber-500 flex items-center gap-1">
            {avgRating} <Star className="w-5 h-5 fill-amber-500" />
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-border shadow-sm">
          <div className="text-muted text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" /> Đã duyệt
          </div>
          <div className="text-2xl font-bold text-green-600">{visibleReviews}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-border shadow-sm">
          <div className="text-muted text-xs font-semibold uppercase tracking-wider mb-2">Nổi bật (Trang chủ)</div>
          <div className="text-2xl font-bold text-primary">{featuredReviews}</div>
        </div>
      </div>

      <ReviewsClient initialReviews={reviews} />
    </div>
  );
}
