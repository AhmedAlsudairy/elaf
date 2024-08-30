"use server";

import { createClient } from "@/lib/utils/supabase/server";

const supabase = createClient();

interface Message {
  id: string;
  sender_company_profile_id: string;
  receiver_company_profile_id: string;
  content: string;
  created_at: string;
  sender_name: string;
  sender_avatar: string | null;
  company_title: string | null;
  company_image: string | null;
  tender_id?: string | null;
  pdf_url?: string | null;
}

interface ChatRoomDetails {
  id: string;
  tender_id: string | null;
  initiator_company_profile_id: string;
  recipient_company_profile_id: string;
  initiator_company_title: string;
  initiator_company_image: string | null;
  recipient_company_title: string;
  recipient_company_image: string | null;
}

interface ChatRoomResult {
  chat_room_id: string;
  is_new: boolean;
}






{
  /* TODO: Add tender_request_id  for get or add message and within create chatroom when click request in first time */
}

export const getMessages = async (chatRoomId: string) => {
  try {
    // Fetch messages
    const { data: messages, error: messagesError } = await supabase
      .from("messages")
      .select(
        `
        id,
        sender_company_profile_id,
        receiver_company_profile_id,
        content,
        pdf_url,
        created_at,
        tender_id
      `
      )
      .eq("chat_room_id", chatRoomId)
      .order("created_at", { ascending: true });

    if (messagesError) throw messagesError;

    // Fetch chat room details
    const { data: chatRoomData, error: chatRoomError } = await supabase
      .from("chat_rooms")
      .select(
        `
        id,
        initiator_company_profile_id,
        recipient_company_profile_id
      `
      )
      .eq("id", chatRoomId)
      .single();

    if (chatRoomError) throw chatRoomError;

    // Fetch company profiles for all unique company profile IDs
    const uniqueCompanyIds = Array.from(
      new Set([
        ...messages.map((msg) => msg.sender_company_profile_id),
        ...messages.map((msg) => msg.receiver_company_profile_id),
        chatRoomData.initiator_company_profile_id,
        chatRoomData.recipient_company_profile_id,
      ])
    );

    const { data: companyProfiles, error: companyProfilesError } =
      await supabase
        .from("company_profiles")
        .select("company_profile_id, company_title, profile_image")
        .in("company_profile_id", uniqueCompanyIds);

    if (companyProfilesError) throw companyProfilesError;

    // Create a map of company_profile_id to company profile for easy lookup
    const companyProfileMap = new Map(
      companyProfiles.map((profile) => [profile.company_profile_id, profile])
    );

    const formattedMessages: Message[] = messages.map((msg) => {
      const senderProfile = companyProfileMap.get(
        msg.sender_company_profile_id
      );
      return {
        id: msg.id,
        sender_company_profile_id: msg.sender_company_profile_id,
        receiver_company_profile_id: msg.receiver_company_profile_id,
        content: msg.content,
        pdf_url: msg.pdf_url,
        tender_id: msg.tender_id,
        created_at: msg.created_at,
        sender_name: senderProfile?.company_title || "Unknown Company",
        sender_avatar: senderProfile?.profile_image || null,
        company_title: senderProfile?.company_title || null,
        company_image: senderProfile?.profile_image || null,
      };
    });

    const initiatorProfile = companyProfileMap.get(
      chatRoomData.initiator_company_profile_id
    );
    const recipientProfile = companyProfileMap.get(
      chatRoomData.recipient_company_profile_id
    );

    const chatRoomDetails: ChatRoomDetails = {
      id: chatRoomData.id,
      tender_id: messages.length > 0 ? messages[0].tender_id : null,
      initiator_company_profile_id: chatRoomData.initiator_company_profile_id,
      recipient_company_profile_id: chatRoomData.recipient_company_profile_id,
      initiator_company_title:
        initiatorProfile?.company_title || "Unknown Company",
      initiator_company_image: initiatorProfile?.profile_image || null,
      recipient_company_title:
        recipientProfile?.company_title || "Unknown Company",
      recipient_company_image: recipientProfile?.profile_image || null,
    };

    return {
      success: true,
      data: {
        messages: formattedMessages,
        chatRoomDetails,
      },
    };
  } catch (error) {
    console.error("Error fetching messages:", error);
    return { success: false, error: "Failed to fetch messages" };
  }
};

export const sendMessage = async (
  chatRoomId: string,
  content: string,
  senderCompanyProfileId: string,
  receiverCompanyProfileId: string,
  pdfUrl?: string
) => {
  try {
    const { data, error } = await supabase
      .from("messages")
      .insert({
        chat_room_id: chatRoomId,
        sender_company_profile_id: senderCompanyProfileId,
        receiver_company_profile_id: receiverCompanyProfileId,
        content,
        pdf_url: pdfUrl,
      })
      .select()
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error("Error sending message:", error);
    return { success: false, error: "Failed to send message" };
  }
};

export const createOrGetChatRoom = async (
  initiatorCompanyProfileId: string,
  recipientCompanyProfileId: string,
  tenderId?: string
): Promise<{ success: boolean; data?: ChatRoomResult; error?: string }> => {
  try {
    // Check if a chat room already exists for these company profiles
    const { data: existingRoom, error: fetchError } = await supabase
      .from("chat_rooms")
      .select("id")
      .or(
        `initiator_company_profile_id.eq.${initiatorCompanyProfileId},initiator_company_profile_id.eq.${recipientCompanyProfileId}`
      )
      .or(
        `recipient_company_profile_id.eq.${initiatorCompanyProfileId},recipient_company_profile_id.eq.${recipientCompanyProfileId}`
      )
      .single();

    if (fetchError && fetchError.code !== "PGRST116") throw fetchError; // PGRST116 is the error code for no rows returned

    if (existingRoom) {
      return {
        success: true,
        data: {
          chat_room_id: existingRoom.id,
          is_new: false,
        },
      };
    }

    // If no existing room, create a new one
    const { data: newRoom, error: insertRoomError } = await supabase
      .from("chat_rooms")
      .insert({
        initiator_company_profile_id: initiatorCompanyProfileId,
        recipient_company_profile_id: recipientCompanyProfileId,
      })
      .select()
      .single();

    if (insertRoomError) throw insertRoomError;

    // Create an initial message for the new chat room
    const { error: messageError } = await supabase.from("messages").insert({
      chat_room_id: newRoom.id,
      tender_id: tenderId,
      content: "Chat room created",
      sender_company_profile_id: initiatorCompanyProfileId,
      receiver_company_profile_id: recipientCompanyProfileId,
    });

    if (messageError) throw messageError;

    return {
      success: true,
      data: {
        chat_room_id: newRoom.id,
        is_new: true,
      },
    };
  } catch (error) {
    console.error("Error in createOrGetChatRoom:", error);
    return { success: false, error: "Failed to create or get chat room" };
  }
};
