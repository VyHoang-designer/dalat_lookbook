"use client";

import { useState } from "react";
import ReviewModal from "./review-modal";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";

export default function ReviewAction({ order, userId }: { order: any, userId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleSuccess = () => {
    setIsOpen(false);
    router.refresh();
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex-1 flex justify-center items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#EAE0D3] text-[#8B6F47] text-xs font-semibold hover:bg-[#FDFBF7] transition-colors shadow-sm"
      >
        <Star className="w-4 h-4" />
        Đánh giá đơn thuê
      </button>

      {isOpen && (
        <ReviewModal
          order={order}
          userId={userId}
          onClose={() => setIsOpen(false)}
          onSuccess={handleSuccess}
        />
      )}
    </>
  );
}
