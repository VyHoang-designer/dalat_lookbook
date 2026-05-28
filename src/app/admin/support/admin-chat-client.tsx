"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Send, Image as ImageIcon, User, Loader2, Search, MessageCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { SupportMessage, ConversationSummary, getMessages, markAsRead, getUserProfile } from "@/lib/db/chat";
import { formatDate } from "@/lib/utils";

interface AdminChatClientProps {
  initialConversations: ConversationSummary[];
}

export default function AdminChatClient({ initialConversations }: AdminChatClientProps) {
  const [conversations, setConversations] = useState<ConversationSummary[]>(initialConversations);
  const [activeUser, setActiveUser] = useState<ConversationSummary | null>(null);
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const conversationsRef = useRef(conversations);
  const supabase = createClient();

  useEffect(() => {
    conversationsRef.current = conversations;
  }, [conversations]);

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

  // Load messages when selecting a user
  useEffect(() => {
    if (!activeUser) return;

    const loadMessages = async () => {
      setIsLoadingMessages(true);
      try {
        const msgs = await getMessages(activeUser.user_id);
        setMessages(msgs);
        
        // Mark as read
        if (activeUser.unread_count > 0) {
          await markAsRead(activeUser.user_id);
          setConversations(prev => prev.map(c => 
            c.user_id === activeUser.user_id ? { ...c, unread_count: 0 } : c
          ));
        }
      } catch (error) {
        console.error("Lỗi tải tin nhắn:", error);
      } finally {
        setIsLoadingMessages(false);
      }
    };

    loadMessages();
  }, [activeUser]);

  // Global Realtime Subscription for ALL messages
  useEffect(() => {
    const channel = supabase
      .channel('admin_chat_all')
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "support_messages"
        },
        async (payload) => {
          const newMessage = payload.new as SupportMessage;
          
          // Fetch profile if it's a new conversation
          const isNewConv = !conversationsRef.current.some(c => c.user_id === newMessage.user_id);
          let profile = null;
          if (isNewConv) {
            profile = await getUserProfile(newMessage.user_id);
          }
          
          // 1. Update Active Chat if it's the current user
          if (activeUser && newMessage.user_id === activeUser.user_id) {
            setMessages(prev => {
              if (prev.find(m => m.id === newMessage.id)) return prev;
              return [...prev, newMessage];
            });
            
            // If customer sent it while we are reading, mark as read immediately
            if (newMessage.sender_role === "customer") {
               await markAsRead(activeUser.user_id);
            }
          }

          // 2. Update Conversations List
          setConversations(prev => {
            const existingIdx = prev.findIndex(c => c.user_id === newMessage.user_id);
            
            let updatedConv: ConversationSummary;
            
            if (existingIdx >= 0) {
              const existing = prev[existingIdx];
              updatedConv = {
                ...existing,
                last_message: newMessage.content || (newMessage.image_url ? "[Hình ảnh]" : ""),
                last_message_at: newMessage.created_at,
                unread_count: (newMessage.sender_role === "customer" && (!activeUser || activeUser.user_id !== newMessage.user_id))
                  ? existing.unread_count + 1
                  : existing.unread_count
              };
              
              const newArr = [...prev];
              newArr.splice(existingIdx, 1);
              return [updatedConv, ...newArr];
            } else {
              // Use fetched profile
              updatedConv = {
                user_id: newMessage.user_id,
                full_name: profile?.full_name || "Khách hàng",
                avatar_url: profile?.avatar_url || null,
                last_message: newMessage.content || (newMessage.image_url ? "[Hình ảnh]" : ""),
                last_message_at: newMessage.created_at,
                unread_count: newMessage.sender_role === "customer" ? 1 : 0
              };
              return [updatedConv, ...prev];
            }
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, activeUser]);

  const handleSendMessage = async (content: string, imageUrl: string | null = null) => {
    if ((!content.trim() && !imageUrl) || !activeUser) return;
    setIsSending(true);

    try {
      const { error } = await supabase.from("support_messages").insert({
        user_id: activeUser.user_id,
        sender_role: "admin",
        content: content.trim(),
        image_url: imageUrl,
        is_read: true // admin messages don't need unread status for admin
      });

      if (error) throw error;
      setInputValue("");
    } catch (err) {
      console.error("Lỗi gửi tin nhắn:", err);
      alert("Không thể gửi tin nhắn. Vui lòng thử lại.");
    } finally {
      setIsSending(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeUser) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `admin-${Date.now()}.${fileExt}`;
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
    <div className="flex h-full divide-x divide-[#EFEBE4]">
      {/* Left Pane: Conversations */}
      <div className="w-[320px] flex flex-col h-full bg-[#FDFBF7]">
        <div className="p-4 border-b border-[#EFEBE4]">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input 
              type="text" 
              placeholder="Tìm kiếm khách hàng..." 
              className="w-full bg-white border border-[#EFEBE4] rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-[#8B6F47]"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-8 text-center text-muted text-sm">
              Chưa có cuộc trò chuyện nào.
            </div>
          ) : (
            <div className="divide-y divide-[#EFEBE4]">
              {conversations.map(conv => (
                <button
                  key={conv.user_id}
                  onClick={() => setActiveUser(conv)}
                  className={`w-full text-left p-4 flex items-center gap-3 hover:bg-surface transition-colors ${
                    activeUser?.user_id === conv.user_id ? 'bg-white' : ''
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center shrink-0 border border-border overflow-hidden relative">
                    {conv.avatar_url ? (
                      <Image src={conv.avatar_url} alt={conv.full_name} fill className="object-cover" />
                    ) : (
                      <User className="w-6 h-6 text-gray-400" />
                    )}
                    {conv.unread_count > 0 && (
                      <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className={`text-sm truncate ${conv.unread_count > 0 ? 'font-bold text-[#3E2723]' : 'font-semibold text-[#5D4037]'}`}>
                        {conv.full_name}
                      </h3>
                      <span className="text-[10px] text-muted shrink-0 ml-2">
                        {new Date(conv.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className={`text-xs truncate ${conv.unread_count > 0 ? 'font-medium text-[#3E2723]' : 'text-muted'}`}>
                      {conv.last_message}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Pane: Active Chat */}
      <div className="flex-1 flex flex-col h-full bg-surface relative">
        {!activeUser ? (
          <div className="flex-1 flex flex-col items-center justify-center text-muted">
            <MessageCircle className="w-16 h-16 text-[#EFEBE4] mb-4" />
            <p>Chọn một khách hàng để bắt đầu trò chuyện</p>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="p-4 bg-white border-b border-[#EFEBE4] flex items-center gap-3 shrink-0">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden relative border border-border">
                {activeUser.avatar_url ? (
                  <Image src={activeUser.avatar_url} alt={activeUser.full_name} fill className="object-cover" />
                ) : (
                  <User className="w-5 h-5 text-gray-400" />
                )}
              </div>
              <div>
                <h2 className="font-bold text-[#3E2723]">{activeUser.full_name}</h2>
                <p className="text-xs text-green-600 font-medium">Đang trực tuyến</p>
              </div>
            </div>

            {/* Chat Messages */}
            <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-6 space-y-6">
              {isLoadingMessages ? (
                <div className="h-full flex items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-[#8B6F47]" />
                </div>
              ) : messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-muted">
                  <p>Chưa có tin nhắn nào.</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isAdmin = msg.sender_role === "admin";
                  return (
                    <div key={msg.id} className={`flex gap-3 ${isAdmin ? "flex-row-reverse" : "flex-row"}`}>
                      <div className="w-8 h-8 rounded-full shrink-0 overflow-hidden bg-gray-100 flex items-center justify-center border border-border">
                        {isAdmin ? (
                          <span className="text-[#8B6F47] font-bold text-xs">DL</span>
                        ) : activeUser.avatar_url ? (
                          <Image src={activeUser.avatar_url} alt={activeUser.full_name} width={32} height={32} className="object-cover" />
                        ) : (
                          <User className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                      
                      <div className={`max-w-[70%] flex flex-col ${isAdmin ? "items-end" : "items-start"}`}>
                        <div className={`px-4 py-2.5 rounded-2xl ${
                          isAdmin 
                            ? "bg-[#8B6F47] text-white rounded-tr-sm" 
                            : "bg-white border border-[#EFEBE4] text-[#3E2723] rounded-tl-sm shadow-sm"
                        }`}>
                          {msg.content && <p className="text-sm whitespace-pre-wrap">{msg.content}</p>}
                          {msg.image_url && (
                            <div className={`relative w-64 h-64 mt-2 rounded-lg overflow-hidden ${msg.content ? '' : 'mt-0'}`}>
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

            {/* Chat Input */}
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
                    placeholder="Nhập tin nhắn để trả lời khách hàng..."
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
          </>
        )}
      </div>
    </div>
  );
}
