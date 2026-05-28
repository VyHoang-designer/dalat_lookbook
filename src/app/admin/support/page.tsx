import { getConversations } from "@/lib/db/chat";
import AdminChatClient from "./admin-chat-client";

export default async function AdminSupportPage() {
  const initialConversations = await getConversations();

  return (
    <div className="h-[calc(100vh-6rem)] bg-white rounded-3xl border border-[#EFEBE4] shadow-sm overflow-hidden flex flex-col">
      <div className="p-6 border-b border-[#EFEBE4] shrink-0">
        <h1 className="text-2xl font-bold text-[#3E2723]">Hỗ trợ khách hàng</h1>
        <p className="text-sm text-muted mt-1">Phản hồi tin nhắn và yêu cầu từ khách hàng</p>
      </div>
      <div className="flex-1 min-h-0">
        <AdminChatClient initialConversations={initialConversations} />
      </div>
    </div>
  );
}
