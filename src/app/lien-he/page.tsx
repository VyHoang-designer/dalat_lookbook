import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getMessages } from "@/lib/db/chat";
import ChatClient from "./chat-client";

export default async function ContactPage() {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  const user = authData.user;

  // Nếu chưa đăng nhập, hiển thị thông báo
  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 bg-[#FDFBF7]">
        <div className="text-6xl mb-4">🔒</div>
        <h2 className="text-xl font-bold text-[#3E2723] mb-2">Bạn chưa đăng nhập</h2>
        <p className="text-muted mb-6 text-center max-w-md">
          Vui lòng đăng nhập để có thể trò chuyện trực tiếp và nhận hỗ trợ từ quản trị viên.
        </p>
        <Link href="/login" className="bg-[#8B6F47] text-white px-6 py-2.5 rounded-full font-semibold hover:bg-[#7A603D] transition-colors">
          Đăng nhập ngay
        </Link>
      </div>
    );
  }

  // Fetch initial messages
  const initialMessages = await getMessages(user.id);

  // Fetch profile to get name and avatar
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, avatar_url")
    .eq("id", user.id)
    .single();

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-[#3E2723] mb-8 text-center">Liên hệ hỗ trợ</h1>
        
        <div className="bg-white rounded-3xl border border-[#EFEBE4] shadow-sm overflow-hidden h-[70vh]">
          <ChatClient 
            userId={user.id} 
            initialMessages={initialMessages}
            userProfile={profile || { full_name: "Khách hàng", avatar_url: null }}
          />
        </div>
      </div>
    </div>
  );
}
