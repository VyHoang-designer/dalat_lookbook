import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getUserOrders } from "@/lib/db/orders";
import MyOrdersClient from "./my-orders-client";

export default async function MyOrdersPage() {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  const user = authData.user;

  // Nếu chưa đăng nhập, hiển thị thông báo
  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 bg-[#FDFBF7]">
        <div className="text-6xl mb-4">🔒</div>
        <h2 className="text-xl font-bold text-foreground mb-2">Bạn chưa đăng nhập</h2>
        <p className="text-muted mb-6 text-center max-w-md">
          Vui lòng đăng nhập để xem danh sách các đơn đặt thuê trang phục của bạn.
        </p>
        <Link href="/login" className="bg-[#8B6F47] text-white px-6 py-2.5 rounded-full font-semibold hover:bg-[#7A603D] transition-colors">
          Đăng nhập ngay
        </Link>
      </div>
    );
  }

  // Lấy đơn hàng (không lọc trên server nữa để Client Component có thể đếm tổng)
  const orders = await getUserOrders(user.id);

  return <MyOrdersClient orders={orders} />;
}
