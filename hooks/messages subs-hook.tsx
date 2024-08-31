'use client'
import { createClient } from '@/lib/utils/supabase/client';
import { useState, useEffect, useCallback } from 'react';

const supabase = createClient()

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

  const handleNewMessage = useCallback(async (payload: any) => {
    console.log('New message received:', payload);
    
    const { data: senderData, error: senderError } = await supabase
      .from('company_profiles')
      .select('company_title, profile_image')
      .eq('company_profile_id', payload.new.sender_company_profile_id)
      .single();

    console.log('Sender data:', senderData);
    if (senderError) {
      console.error('Error fetching sender data:', senderError);
      return;
    }

    const newMessageData: Message = {
      id: payload.new.id,
      chat_room_id: chatRoomId,
      sender_company_profile_id: payload.new.sender_company_profile_id,
      receiver_company_profile_id: payload.new.receiver_company_profile_id,
      content: payload.new.content,
      created_at: payload.new.created_at,
      sender_name: senderData.company_title,
      sender_avatar: senderData.profile_image,
      company_title: senderData.company_title,
      company_image: senderData.profile_image,
      tender_id: payload.new.tender_id || null,
      tender_request_id: payload.new.tender_request_id || null,
      pdf_url: payload.new.pdf_url || null,
      read_status: payload.new.read_status
    };

    console.log('Processed new message:', newMessageData);
    setMessages(prevMessages => [...prevMessages, newMessageData]);
  }, [chatRoomId]);

  useEffect(() => {
    const channel = supabase
      .channel(`chat_room:${chatRoomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `chat_room_id=eq.${chatRoomId}`
        },
        handleNewMessage
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatRoomId, handleNewMessage]);

  return messages;
};