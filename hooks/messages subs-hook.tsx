'use client'
import { useEffect, useState, useCallback } from "react";
import { pusherClient } from "@/lib/pusher-client";

interface Message {
  id: string;
  chat_room_id: string;
  tender_id: string | null;
  content: string;
  created_at: string;
  tender_request_id: string | null;
  pdf_url: string | null;
  sender_company_profile_id: string;
  receiver_company_profile_id: string;
  read_status: string;
  sender_name?: string;
  sender_avatar?: string | null;
  company_title?: string | null;
  company_image?: string | null;
}

export const useSubscribeToChat = (chatRoomId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);

  const handleNewMessage = useCallback((message: Message) => {
    console.log("📩 New message received:", message);
    setMessages(prev => [...prev, message]);
  }, []);

  useEffect(() => {
    // Subscribe to this chat room channel
    const channel = pusherClient.subscribe(`chat-${chatRoomId}`);
    channel.bind("new-message", handleNewMessage);

    console.log(`🟢 Subscribed to chat-${chatRoomId}`);

    return () => {
      console.log(`🔴 Unsubscribed from chat-${chatRoomId}`);
      channel.unbind("new-message", handleNewMessage);
      pusherClient.unsubscribe(`chat-${chatRoomId}`);
    };
  }, [chatRoomId, handleNewMessage]);

  return messages;
};
