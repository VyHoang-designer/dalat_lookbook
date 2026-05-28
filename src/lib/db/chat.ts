"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createBrowserClient } from "@supabase/supabase-js";

export interface SupportMessage {
  id: string;
  user_id: string;
  sender_role: "customer" | "admin";
  content: string;
  image_url: string | null;
  is_read: boolean;
  created_at: string;
}

export interface ConversationSummary {
  user_id: string;
  full_name: string;
  avatar_url: string | null;
  last_message: string;
  last_message_at: string;
  unread_count: number;
}

// Lấy danh sách tin nhắn của 1 người dùng
export async function getMessages(userId: string): Promise<SupportMessage[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("support_messages")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("getMessages error:", error.message);
    return [];
  }

  return data as SupportMessage[];
}

// Lấy thông tin user profile nhanh
export async function getUserProfile(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("profiles").select("full_name, avatar_url").eq("id", userId).single();
  return data;
}

// Admin lấy danh sách tất cả các cuộc trò chuyện
export async function getConversations(): Promise<ConversationSummary[]> {
  const supabase = await createClient();

  // Vì Supabase không hỗ trợ raw GROUP BY linh hoạt trong JS client,
  // ta sẽ fetch các tin nhắn gần nhất và xử lý trên server.
  const { data: profiles, error: pError } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url");

  if (pError) {
    console.error("getConversations error:", pError.message);
    return [];
  }

  const { data: messages, error: mError } = await supabase
    .from("support_messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (mError) {
    console.error("getConversations messages error:", mError.message);
    return [];
  }

  const conversations = new Map<string, ConversationSummary>();

  // Initialize all profiles that have at least one message
  messages?.forEach((msg: SupportMessage) => {
    if (!conversations.has(msg.user_id)) {
      const profile = profiles?.find((p) => p.id === msg.user_id);
      conversations.set(msg.user_id, {
        user_id: msg.user_id,
        full_name: profile?.full_name || "Khách hàng ẩn danh",
        avatar_url: profile?.avatar_url || null,
        last_message: msg.content || (msg.image_url ? "[Hình ảnh]" : ""),
        last_message_at: msg.created_at,
        unread_count: 0
      });
    }
    
    // Đếm số tin nhắn chưa đọc của customer (Admin chưa xem)
    if (msg.sender_role === "customer" && !msg.is_read) {
      const conv = conversations.get(msg.user_id)!;
      conv.unread_count++;
    }
  });

  return Array.from(conversations.values()).sort((a, b) => 
    new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime()
  );
}

// Gửi tin nhắn mới
export async function sendMessage(
  userId: string,
  content: string,
  imageUrl: string | null,
  senderRole: "customer" | "admin"
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("support_messages")
    .insert({
      user_id: userId,
      sender_role: senderRole,
      content: content,
      image_url: imageUrl,
      is_read: false
    });

  if (error) {
    console.error("sendMessage error:", error.message);
    throw new Error(error.message);
  }
}

// Đánh dấu tin nhắn đã đọc (Admin gọi khi xem chat của User)
export async function markAsRead(userId: string) {
  const supabase = await createClient();

  await supabase
    .from("support_messages")
    .update({ is_read: true })
    .eq("user_id", userId)
    .eq("sender_role", "customer")
    .eq("is_read", false);
}
