"use client";

import { useState } from "react";
import { Star, MessageSquare } from "lucide-react";
import { toggleReviewVisibility, toggleReviewFeatured } from "@/lib/db/reviews";
import { formatDate } from "@/lib/utils";

export default function ReviewsClient({ initialReviews }: { initialReviews: any[] }) {
  const [reviews, setReviews] = useState(initialReviews);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleToggleVisible = async (id: string, current: boolean) => {
    setLoadingId(id);
    try {
      await toggleReviewVisibility(id, !current);
      setReviews(reviews.map(r => r.id === id ? { ...r, is_visible: !current } : r));
    } catch (e) {
      console.error(e);
      alert("Lỗi khi cập nhật trạng thái");
    } finally {
      setLoadingId(null);
    }
  };

  const handleToggleFeatured = async (id: string, current: boolean) => {
    setLoadingId(id);
    try {
      await toggleReviewFeatured(id, !current);
      setReviews(reviews.map(r => r.id === id ? { ...r, is_featured: !current } : r));
    } catch (e) {
      console.error(e);
      alert("Lỗi khi cập nhật trạng thái");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="bg-white border border-border shadow-sm rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/30 text-muted-foreground uppercase text-xs">
            <tr>
              <th className="px-6 py-4 font-semibold whitespace-nowrap">Khách hàng</th>
              <th className="px-6 py-4 font-semibold">Đánh giá</th>
              <th className="px-6 py-4 font-semibold whitespace-nowrap">Trạng thái</th>
              <th className="px-6 py-4 font-semibold whitespace-nowrap text-right">Ngày</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {reviews.map((review) => (
              <tr key={review.id} className="hover:bg-muted/10 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-semibold text-foreground">{review.customer_name}</div>
                  <div className="text-xs text-muted max-w-[200px] truncate" title={review.products?.name}>
                    {review.products?.name}
                  </div>
                </td>
                <td className="px-6 py-4 max-w-xs">
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${i < review.rating ? "fill-amber-400 text-amber-400" : "text-border"}`}
                      />
                    ))}
                  </div>
                  <div className="text-muted leading-relaxed line-clamp-2" title={review.comment}>
                    {review.comment}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-3">
                    <label className="flex items-center gap-2 cursor-pointer w-fit">
                      <div className="relative">
                        <input 
                          type="checkbox" 
                          className="sr-only" 
                          checked={review.is_visible}
                          onChange={() => handleToggleVisible(review.id, review.is_visible)}
                          disabled={loadingId === review.id}
                          suppressHydrationWarning
                        />
                        <div className={`block w-10 h-6 rounded-full transition-colors ${review.is_visible ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                        <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${review.is_visible ? 'translate-x-4' : ''}`}></div>
                      </div>
                      <span className="text-xs font-medium min-w-[50px]">{review.is_visible ? 'Đã duyệt' : 'Đã ẩn'}</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer w-fit">
                      <div className="relative">
                        <input 
                          type="checkbox" 
                          className="sr-only" 
                          checked={review.is_featured}
                          onChange={() => handleToggleFeatured(review.id, review.is_featured)}
                          disabled={loadingId === review.id || !review.is_visible}
                          suppressHydrationWarning
                        />
                        <div className={`block w-10 h-6 rounded-full transition-colors ${review.is_featured ? 'bg-primary' : 'bg-slate-300'} ${!review.is_visible ? 'opacity-50' : ''}`}></div>
                        <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${review.is_featured ? 'translate-x-4' : ''}`}></div>
                      </div>
                      <span className="text-xs font-medium text-primary">Nổi bật (Trang chủ)</span>
                    </label>
                  </div>
                </td>
                <td className="px-6 py-4 text-right text-muted whitespace-nowrap">
                  {formatDate(review.created_at)}
                </td>
              </tr>
            ))}
            
            {reviews.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-muted">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <MessageSquare className="w-8 h-8 opacity-20" />
                    <p>Chưa có đánh giá nào</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
