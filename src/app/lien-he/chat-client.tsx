"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Send, Image as ImageIcon, User, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { SupportMessage } from "@/lib/db/chat";
import { formatDate } from "@/lib/utils";

interface ChatClientProps {
  userId: string;
  initialMessages: SupportMessage[];
  userProfile: { full_name: string; avatar_url: string | null };
}

export default function ChatClient({ userId, initialMessages, userProfile }: ChatClientProps) {
  const [messages, setMessages] = useState<SupportMessage[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Subscribe to realtime updates
    const channel = supabase
      .channel(`chat_${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "support_messages",
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          const newMessage = payload.new as SupportMessage;
          // Avoid duplicate if we just sent it (optimistic update could be added, but here we just append)
          setMessages((prev) => {
            if (prev.find((m) => m.id === newMessage.id)) return prev;
            return [...prev, newMessage];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, userId]);

  const handleSendMessage = async (content: string, imageUrl: string | null = null) => {
    if (!content.trim() && !imageUrl) return;
    setIsSending(true);

    try {
      const { error } = await supabase.from("support_messages").insert({
        user_id: userId,
        sender_role: "customer",
        content: content.trim(),
        image_url: imageUrl,
        is_read: false
      });

      if (error) throw error;
      setInputValue("");

      // Auto-reply logic cho câu chào đầu tiên
      const text = content.trim().toLowerCase();
      const isGreeting = /^(hi|hello|helo|alo|chào|xin chào)/.test(text);
      
      // Nếu là lời chào, tự động phản hồi sau 1 giây cho chân thực
      if (isGreeting) {
        setTimeout(async () => {
          await supabase.from("support_messages").insert({
            user_id: userId,
            sender_role: "admin",
            content: "Chào bạn, bạn cần hỗ trợ gì ạ? 😊",
            image_url: null,
            is_read: false
          });
        }, 1000);
      }

    } catch (err) {
      console.error("Lỗi gửi tin nhắn:", err);
      alert("Không thể gửi tin nhắn. Vui lòng thử lại.");
    } finally {
      setIsSending(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `chat/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("product_images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("product_images")
        .getPublicUrl(filePath);

      await handleSendMessage("", data.publicUrl);
    } catch (err) {
      console.error("Lỗi upload ảnh:", err);
      alert("Không thể upload ảnh. Vui lòng thử lại.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col h-full bg-surface">
      {/* Header */}
      <div className="p-4 border-b border-[#EFEBE4] bg-white flex items-center gap-3 shrink-0">
        <div className="w-10 h-10 rounded-full bg-[#8B6F47] flex items-center justify-center shrink-0">
          <span className="text-white font-bold text-lg">DL</span>
        </div>
        <div>
          <h2 className="font-bold text-[#3E2723]">Dalat Lookbook Support</h2>
          <p className="text-xs text-muted">Thường trả lời trong vài phút</p>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-muted p-8">
            <div className="w-16 h-16 bg-[#F3EBE0] rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">👋</span>
            </div>
            <p>Xin chào! Chúng tôi có thể giúp gì cho bạn?</p>
            <p className="text-sm mt-2">Hãy gửi tin nhắn để bắt đầu trò chuyện.</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isCustomer = msg.sender_role === "customer";
            return (
              <div key={msg.id} className={`flex gap-3 ${isCustomer ? "flex-row-reverse" : "flex-row"}`}>
                <div className="w-8 h-8 rounded-full shrink-0 overflow-hidden bg-gray-100 flex items-center justify-center border border-border">
                  {isCustomer ? (
                    userProfile.avatar_url ? (
                      <Image src={userProfile.avatar_url} alt="User" width={32} height={32} className="object-cover" />
                    ) : (
                      <User className="w-4 h-4 text-gray-400" />
                    )
                  ) : (
                    <span className="text-[#8B6F47] font-bold text-xs">DL</span>
                  )}
                </div>
                
                <div className={`max-w-[75%] flex flex-col ${isCustomer ? "items-end" : "items-start"}`}>
                  <div className={`px-4 py-2.5 rounded-2xl ${
                    isCustomer 
                      ? "bg-[#8B6F47] text-white rounded-tr-sm" 
                      : "bg-white border border-[#EFEBE4] text-[#3E2723] rounded-tl-sm shadow-sm"
                  }`}>
                    {msg.content && <p className="text-sm whitespace-pre-wrap">{msg.content}</p>}
                    {msg.image_url && (
                      <div className={`relative w-48 h-48 mt-2 rounded-lg overflow-hidden ${msg.content ? '' : 'mt-0'}`}>
                        <Image src={msg.image_url} alt="Chat image" fill className="object-cover" />
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-muted mt-1 px-1">
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-[#EFEBE4] shrink-0">
        <form 
          className="flex items-end gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputValue);
          }}
        >
          <button 
            type="button" 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading || isSending}
            className="p-3 text-muted hover:text-[#8B6F47] hover:bg-surface rounded-full transition-colors shrink-0"
          >
            {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ImageIcon className="w-5 h-5" />}
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*"
            onChange={handleImageUpload}
          />
          
          <div className="flex-1 bg-surface rounded-3xl border border-[#EFEBE4] px-4 py-2.5">
            <input 
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Nhập tin nhắn..."
              disabled={isUploading || isSending}
              className="w-full bg-transparent border-none outline-none text-sm placeholder:text-muted"
            />
          </div>

          <button 
            type="submit"
            disabled={(!inputValue.trim() && !isUploading) || isSending}
            className="p-3 bg-[#8B6F47] text-white rounded-full hover:bg-[#7A603D] transition-colors disabled:opacity-50 shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
