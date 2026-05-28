"use client";

import { useState } from "react";
import { X, Calendar, Loader2 } from "lucide-react";
import { extendOrder } from "@/lib/db/orders";
import { formatPrice, formatDate } from "@/lib/utils";

interface ExtendOrderModalProps {
  order: any;
  userId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ExtendOrderModal({ order, userId, onClose, onSuccess }: ExtendOrderModalProps) {
  const [newEndDate, setNewEndDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const oldEndDateObj = new Date(order.end_date);
  
  let extraDays = 0;
  let extraAmount = 0;

  if (newEndDate) {
    const newEndDateObj = new Date(newEndDate);
    if (newEndDateObj > oldEndDateObj) {
      const diffTime = Math.abs(newEndDateObj.getTime() - oldEndDateObj.getTime());
      extraDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      extraAmount = extraDays * (order.product_price || 0);
    }
  }

  const handleExtend = async () => {
    if (!newEndDate) {
      setError("Vui lòng chọn ngày trả mới");
      return;
    }
    
    if (new Date(newEndDate) <= oldEndDateObj) {
      setError("Ngày trả mới phải sau ngày trả hiện tại");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await extendOrder(order.id, newEndDate, userId);
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Đã có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  // Get tomorrow relative to end_date to set min date for input
  const minDateObj = new Date(oldEndDateObj);
  minDateObj.setDate(minDateObj.getDate() + 1);
  const minDateStr = minDateObj.toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-xl animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-6 border-b border-[#EFEBE4]">
          <h2 className="text-xl font-bold text-[#3E2723]">Gia hạn đơn thuê</h2>
          <button 
            onClick={onClose}
            className="p-2 text-muted hover:text-[#3E2723] hover:bg-surface rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="bg-surface rounded-xl p-4 border border-[#EFEBE4]">
            <p className="text-sm font-semibold text-[#3E2723] mb-1">{order.product_name}</p>
            <p className="text-xs text-muted mb-3">
              Ngày trả hiện tại: <span className="font-medium text-[#3E2723]">{formatDate(order.end_date)}</span>
            </p>
            <p className="text-xs text-muted">
              Giá thuê/ngày: <span className="font-medium text-[#8B6F47]">{formatPrice(order.product_price || 0)}</span>
            </p>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-semibold text-[#3E2723]">Chọn ngày trả mới</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted pointer-events-none" />
              <input
                type="date"
                min={minDateStr}
                value={newEndDate}
                onChange={(e) => {
                  setNewEndDate(e.target.value);
                  setError(null);
                }}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#EFEBE4] text-sm focus:outline-none focus:border-[#8B6F47] focus:ring-1 focus:ring-[#8B6F47]"
              />
            </div>
          </div>

          {extraDays > 0 && (
            <div className="bg-[#FDFBF7] border border-[#EAE0D3] rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted">Số ngày gia hạn</span>
                <span className="font-medium text-[#3E2723]">{extraDays} ngày</span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-[#EAE0D3]/50">
                <span className="font-semibold text-[#3E2723]">Phí gia hạn</span>
                <span className="font-bold text-primary">{formatPrice(extraAmount)}</span>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">
              {error}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-[#EFEBE4] flex gap-3">
          <button 
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-3 text-sm font-bold text-[#5D4037] border border-[#EFEBE4] rounded-xl hover:bg-surface transition-colors disabled:opacity-50"
          >
            Hủy
          </button>
          <button 
            onClick={handleExtend}
            disabled={isLoading || !newEndDate || new Date(newEndDate) <= oldEndDateObj}
            className="flex-1 py-3 flex justify-center items-center gap-2 text-sm font-bold text-white bg-[#8B6F47] rounded-xl hover:bg-[#7A603D] transition-colors disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Xác nhận gia hạn"}
          </button>
        </div>
      </div>
    </div>
  );
}
