'use server'

import { createClient } from "@/lib/utils/supabase/server";
import { getCurrentCompanyProfile } from "./get-current-company-profile";
import { CompanyProfile } from "@/types";
import { sendEmail } from "@/lib/utils/resend/send-emails";

const supabase = createClient();

// Enum for message read status
enum ReadStatus {
  Unread = 'unread',
  Read = 'read',
  Archived = 'archived'
}

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
  read_status: ReadStatus;
  sender_name?: string;
  sender_avatar?: string | null;
  company_title?: string | null;
  company_image?: string | null;
}

interface ChatRoomWithLastMessage {
  id: string;
  initiator_company_profile_id: string;
  recipient_company_profile_id: string;
  created_at: string;
  updated_at: string;
  last_message: Message | null;
  unread_count: number;
  other_company_profile: {
    company_title: string;
    profile_image: string | null;
  };
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

interface ChatRoomWithDetails {
  id: string;
  other_company_profile: {
    company_title: string;
    profile_image: string | null;
  };
  last_message: Message | null;
  unread_count: number;
}

export async function getReadStatus() {
  return ReadStatus;
}



// ... (previous code remains the same)

function getEmailFromUserData(userData: any): string | undefined {
  if (Array.isArray(userData)) {
    return userData[0]?.email;
  } else if (typeof userData === 'object' && userData !== null) {
    return userData.email;
  }
  return undefined;
}

async function sendNewMessageNotification(
  senderId: string,
  receiverId: string,
  chatRoomId: string,
  messageContent: string
) {
  try {
    const [sender, receiver] = await Promise.all([
      supabase
        .from("company_profiles")
        .select(`
          company_title,
          users(email)
        `)
        .eq("company_profile_id", senderId)
        .single(),
      supabase
        .from("company_profiles")
        .select(`
          users(email)
        `)
        .eq("company_profile_id", receiverId)
        .single()
    ]);

    if (sender.error) {
      console.error("Error fetching sender:", sender.error);
      throw new Error("Failed to fetch sender profile");
    }
    if (receiver.error) {
      console.error("Error fetching receiver:", receiver.error);
      throw new Error("Failed to fetch receiver profile");
    }

    console.log("Sender data:", JSON.stringify(sender.data, null, 2));
    console.log("Receiver data:", JSON.stringify(receiver.data, null, 2));

    const receiverEmail = getEmailFromUserData(receiver.data.users);
    console.log("receiverEmail", receiverEmail);

    if (!receiverEmail) {
      console.log("No valid email found for receiver, skipping notification");
      return;
    }

    const emailParams = {
      to: [receiverEmail],
      title: "New Message Received",
      body: `You have a new message from ${sender.data.company_title}. Message preview: "${messageContent.substring(0, 50)}${messageContent.length > 50 ? '...' : ''}". Click <a href="${process.env.NEXT_PUBLIC_WEBSITE_URL}/chats/${chatRoomId}">here</a> to view the full conversation.`
    };

    await sendEmail(emailParams);
    console.log("New message notification sent successfully");
  } catch (error) {
    console.error("Error sending new message notification:", error);
  }
}

export async function getMessages(chatRoomId: string, limit: number, offset: number) {
  try {
    // Fetch messages, chat room details, and company profiles in parallel
    const [messagesResult, chatRoomResult, companyProfilesResult] = await Promise.all([
      supabase
        .from("messages")
        .select(`
          id,
          sender_company_profile_id,
          receiver_company_profile_id,
          content,
          pdf_url,
          created_at,
          tender_id
        `)
        .eq("chat_room_id", chatRoomId)
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1),
      
      supabase
        .from("chat_rooms")
        .select(`
          id,
          initiator_company_profile_id,
          recipient_company_profile_id
        `)
        .eq("id", chatRoomId)
        .single(),
      
      supabase
        .from("company_profiles")
        .select("company_profile_id, company_title, profile_image")
    ]);

    if (messagesResult.error) throw messagesResult.error;
    if (chatRoomResult.error) throw chatRoomResult.error;
    if (companyProfilesResult.error) throw companyProfilesResult.error;

    const messages = messagesResult.data;
    const chatRoomData = chatRoomResult.data;
    const companyProfiles = companyProfilesResult.data;

    // Create a map of company_profile_id to company profile for easy lookup
    const companyProfileMap = new Map(
      companyProfiles.map((profile) => [profile.company_profile_id, profile])
    );

    const formattedMessages = messages.map((msg) => {
      const senderProfile = companyProfileMap.get(msg.sender_company_profile_id);
      return {
        id: msg.id,
        chat_room_id: chatRoomId,
        sender_company_profile_id: msg.sender_company_profile_id,
        receiver_company_profile_id: msg.receiver_company_profile_id,
        content: msg.content,
        pdf_url: msg.pdf_url,
        tender_id: msg.tender_id,
        created_at: msg.created_at,
        tender_request_id: null,
        read_status: ReadStatus.Unread,
        sender_name: senderProfile?.company_title || "Unknown Company",
        sender_avatar: senderProfile?.profile_image || null,
        company_title: senderProfile?.company_title || null,
        company_image: senderProfile?.profile_image || null,
      };
    });

    const initiatorProfile = companyProfileMap.get(chatRoomData.initiator_company_profile_id);
    const recipientProfile = companyProfileMap.get(chatRoomData.recipient_company_profile_id);

    const chatRoomDetails = {
      id: chatRoomData.id,
      tender_id: messages.length > 0 ? messages[0].tender_id : null,
      initiator_company_profile_id: chatRoomData.initiator_company_profile_id,
      recipient_company_profile_id: chatRoomData.recipient_company_profile_id,
      initiator_company_title: initiatorProfile?.company_title || "Unknown Company",
      initiator_company_image: initiatorProfile?.profile_image || null,
      recipient_company_title: recipientProfile?.company_title || "Unknown Company",
      recipient_company_image: recipientProfile?.profile_image || null,
    };

    return {
      messages: formattedMessages,
      chatRoomDetails,
    };
  } catch (error) {
    console.error("Error fetching messages:", error);
    return { messages: [], chatRoomDetails: null };
  }
}

export async function getChatRoomsForCurrentProfile(): Promise<ChatRoomWithDetails[] | null> {
  try {
    const currentProfile = await getCurrentCompanyProfile();
    if (!currentProfile) {
      console.error("Current company profile not found");
      return null;
    }

    const currentProfileId = currentProfile.company_profile_id;

    // Fetch chat rooms and messages in parallel
    const [chatRoomsResult, messagesResult, companyProfilesResult] = await Promise.all([
      supabase
        .from("chat_rooms")
        .select(`*`)
        .or(`initiator_company_profile_id.eq.${currentProfileId},recipient_company_profile_id.eq.${currentProfileId}`),
      
      supabase
        .from("messages")
        .select(`
          id,
          chat_room_id,
          tender_id,
          content,
          created_at,
          tender_request_id,
          pdf_url,
          sender_company_profile_id,
          receiver_company_profile_id,
          read_status
        `)
        .order('created_at', { ascending: false }),
      
      supabase
        .from("company_profiles")
        .select("company_profile_id, company_title, profile_image")
    ]);

    if (chatRoomsResult.error) throw chatRoomsResult.error;
    if (messagesResult.error) throw messagesResult.error;
    if (companyProfilesResult.error) throw companyProfilesResult.error;

    const chatRooms = chatRoomsResult.data;
    const messages = messagesResult.data;
    const companyProfiles = companyProfilesResult.data;

    // Group messages by chat room
    const messagesByChatRoom: { [key: string]: Message[] } = messages.reduce((acc: { [key: string]: Message[] }, message: Message) => {
      if (!acc[message.chat_room_id]) {
        acc[message.chat_room_id] = [];
      }
      acc[message.chat_room_id].push(message);
      return acc;
    }, {});

    const companyProfileMap = new Map(companyProfiles.map(profile => [profile.company_profile_id, profile]));

    const chatRoomsWithDetails: ChatRoomWithDetails[] = chatRooms.map((room: ChatRoomDetails) => {
      const otherCompanyProfileId = room.initiator_company_profile_id === currentProfileId
        ? room.recipient_company_profile_id
        : room.initiator_company_profile_id;
      
      const otherCompanyProfile = companyProfileMap.get(otherCompanyProfileId) as CompanyProfile | undefined;
      
      const roomMessages = messagesByChatRoom[room.id] || [];
      const lastMessage = roomMessages[0] || null;
      const unreadCount = roomMessages.filter(
        (msg: Message) => msg.receiver_company_profile_id === currentProfileId && msg.read_status === 'unread'
      ).length;

      return {
        id: room.id,
        other_company_profile: {
          company_title: otherCompanyProfile?.company_title || "Unknown Company",
          profile_image: otherCompanyProfile?.profile_image || null,
        },
        last_message: lastMessage,
        unread_count: unreadCount,
      };
    });

    return chatRoomsWithDetails;
  } catch (error) {
    console.error("Error in getChatRoomsForCurrentProfile:", error);
    return null;
  }
}

export async function markMessagesAsRead(chatRoomId: string, receiverCompanyProfileId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("messages")
      .update({ read_status: ReadStatus.Read })
      .eq('chat_room_id', chatRoomId)
      .eq('receiver_company_profile_id', receiverCompanyProfileId)
      .eq('read_status', ReadStatus.Unread);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error marking messages as read:", error);
    return false;
  }
}

export async function createOrGetChatRoom(
  initiatorCompanyProfileId: string,
  recipientCompanyProfileId: string,
  tenderId?: string
): Promise<{ chat_room_id: string; is_new: boolean } | null> {
  try {
    const { data, error } = await supabase
      .rpc('create_or_get_chat_room', {
        p_initiator_id: initiatorCompanyProfileId,
        p_recipient_id: recipientCompanyProfileId
      });

    if (error) throw error;

    const chatRoom = data[0];

    if (chatRoom.is_new) {
      // Create an initial message for the new chat room
      await sendMessage(
        chatRoom.chat_room_id,
        "Chat room created",
        initiatorCompanyProfileId,
        recipientCompanyProfileId,
        tenderId
      );

      // Send email notification for new chat room
      await sendNewChatRoomNotification(initiatorCompanyProfileId, recipientCompanyProfileId, chatRoom.chat_room_id);
    }

    return {
      chat_room_id: chatRoom.chat_room_id,
      is_new: chatRoom.is_new,
    };
  } catch (error) {
    console.error("Error in createOrGetChatRoom:", error);
    return null;
  }
}


export async function sendMessage(
  chatRoomId: string,
  content: string,
  senderCompanyProfileId: string,
  receiverCompanyProfileId: string,
  tenderId?: string,
  tenderRequestId?: string,
  pdfUrl?: string
): Promise<{ success: boolean; data?: Message; error?: string }> {
  try {
    const { data, error } = await supabase
      .from("messages")
      .insert({
        chat_room_id: chatRoomId,
        content,
        sender_company_profile_id: senderCompanyProfileId,
        receiver_company_profile_id: receiverCompanyProfileId,
        tender_id: tenderId,
        tender_request_id: tenderRequestId,
        pdf_url: pdfUrl,
        read_status: ReadStatus.Unread
      })
      .select()
      .single();

    if (error) throw error;

    // Send email notification for new message
    await sendNewMessageNotification(senderCompanyProfileId, receiverCompanyProfileId, chatRoomId, content);

    return { success: true, data: data as Message };
  } catch (error) {
    console.error("Error sending message:", error);
    return { success: false, error: "Failed to send message" };
  }
}


async function sendNewChatRoomNotification(
  initiatorId: string,
  recipientId: string,
  chatRoomId: string
) {
  try {
    const [initiator, recipient] = await Promise.all([
      supabase
        .from("company_profiles")
        .select(`
          company_title,
          users(email)
        `)
        .eq("company_profile_id", initiatorId)
        .single(),
      supabase
        .from("company_profiles")
        .select(`
          users(email)
        `)
        .eq("company_profile_id", recipientId)
        .single()
    ]);

    if (initiator.error) {
      console.error("Error fetching initiator:", initiator.error);
      throw new Error("Failed to fetch initiator profile");
    }
    if (recipient.error) {
      console.error("Error fetching recipient:", recipient.error);
      throw new Error("Failed to fetch recipient profile");
    }

    console.log("Initiator data:", JSON.stringify(initiator.data, null, 2));
    console.log("Recipient data:", JSON.stringify(recipient.data, null, 2));

    const recipientEmail = getEmailFromUserData(recipient.data.users);
    console.log("recipientEmail", recipientEmail);

    if (!recipientEmail) {
      console.log("No valid email found for recipient, skipping notification");
      return;
    }

    const emailParams = {
      to: [recipientEmail],
      title: "New Chat Room Created",
      body: `${initiator.data.company_title} has started a new chat with you. Click <a href="${process.env.NEXT_PUBLIC_WEBSITE_URL}/chats/${chatRoomId}">here</a> to view the conversation.`
    };

    await sendEmail(emailParams);
    console.log("New chat room notification sent successfully");
  } catch (error) {
    console.error("Error sending new chat room notification:", error);
  }
}