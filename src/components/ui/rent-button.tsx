"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { User } from "lucide-react";

export function RentButton({
  productId,
  className,
  disabled,
  children,
}: {
  productId: string;
  className?: string;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (loading) return;
    if (!user) {
      setShowModal(true);
    } else {
      router.push(`/rental/${productId}`);
    }
  };

  return (
    <>
      <button onClick={handleClick} className={className} disabled={disabled}>
        {children}
      </button>

      {/* Modal Yêu cầu đăng nhập */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95 fade-in duration-200">
            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-center text-[#3E2723] mb-2">
              Yêu cầu đăng nhập
            </h3>
            <p className="text-[#6D5D55] text-center text-sm mb-6 leading-relaxed">
              Bạn cần đăng nhập tài khoản trước khi thực hiện thao tác đặt thuê. Việc này giúp cửa hàng bảo vệ quyền lợi và hỗ trợ bạn tốt hơn.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => router.push(`/login?redirect=/rental/${productId}`)}
                className="w-full bg-[#8B6F47] hover:bg-[#6D5433] text-white py-3 rounded-xl font-semibold transition-colors"
              >
                Đăng nhập ngay
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="w-full bg-surface hover:bg-[#F5EBE1] text-[#6D5D55] py-3 rounded-xl font-semibold transition-colors"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
