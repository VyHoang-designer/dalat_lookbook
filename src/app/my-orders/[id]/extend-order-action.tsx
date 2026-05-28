"use client";

import { useState } from "react";
import ExtendOrderModal from "./extend-order-modal";
import { useRouter } from "next/navigation";

export default function ExtendOrderAction({ order, userId }: { order: any, userId: string }) {
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
        className="flex-1 flex justify-center items-center gap-2 px-4 py-2.5 rounded-xl bg-[#8B6F47] text-white text-xs font-semibold hover:bg-[#7A603D] transition-colors shadow-sm"
      >
        Gia hạn đơn hàng
      </button>

      {isOpen && (
        <ExtendOrderModal
          order={order}
          userId={userId}
          onClose={() => setIsOpen(false)}
          onSuccess={handleSuccess}
        />
      )}
    </>
  );
}
