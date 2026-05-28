"use client";

import { useState } from "react";
import { Star, X, Loader2 } from "lucide-react";
import { createReview } from "@/lib/db/reviews";

interface ReviewModalProps {
  order: any;
  userId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ReviewModal({ order, userId, onClose, onSuccess }: ReviewModalProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [locationName, setLocationName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError("Vui lòng nhập cảm nhận của bạn.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await createReview(
        {
          orderId: order.id,
          productId: order.product_id,
          rating,
          comment,
          locationName,
        },
        userId,
        order.customer_name
      );
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Đã có lỗi xảy ra. Vui lòng thử lại.");
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-xl animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-6 border-b border-[#EFEBE4]">
          <h2 className="text-xl font-bold text-[#3E2723]">Đánh giá đơn thuê</h2>
          <button
            onClick={onClose}
            className="p-2 text-muted hover:text-[#3E2723] hover:bg-surface rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="bg-surface rounded-xl p-4 border border-[#EFEBE4] mb-2">
            <p className="text-sm font-semibold text-[#3E2723] mb-1">{order.product_name}</p>
            <p className="text-xs text-muted">Mã đơn: {order.id.split('-')[0]}</p>
          </div>

          <div>
            <label className="mb-3 block text-sm font-medium text-[#2f2924]">
              Chấm điểm trải nghiệm
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star
                    size={32}
                    className={star <= rating ? "fill-[#d6a23d] text-[#d6a23d]" : "text-[#EFEBE4] fill-transparent"}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#2f2924]">
              Cảm nhận của bạn <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Bạn thấy outfit, chất lượng đồ và dịch vụ như thế nào?"
              className="w-full rounded-2xl border border-[#EFEBE4] bg-[#FDFBF7] px-4 py-3 text-sm outline-none focus:border-[#8B6F47] focus:ring-1 focus:ring-[#8B6F47] transition-all"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#2f2924]">
              Địa điểm chụp ảnh (Không bắt buộc)
            </label>
            <input
              type="text"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              placeholder="Ví dụ: Hồ Xuân Hương, Đồi cỏ hồng..."
              className="w-full rounded-2xl border border-[#EFEBE4] bg-[#FDFBF7] px-4 py-3 text-sm outline-none focus:border-[#8B6F47] focus:ring-1 focus:ring-[#8B6F47] transition-all"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">
              {error}
            </div>
          )}

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 py-3 text-sm font-bold text-[#5D4037] border border-[#EFEBE4] rounded-xl hover:bg-surface transition-colors disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-3 flex justify-center items-center gap-2 text-sm font-bold text-white bg-[#8B6F47] rounded-xl hover:bg-[#7A603D] transition-colors disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Gửi đánh giá"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
