'use server'

import { prisma } from '@/lib/prisma'
import { getCurrentCompanyProfile } from '../company/get-current-company-profile';
import { sendEmail } from "@/lib/utils/resend/send-emails";
import { pusherServer } from "@/lib/pusher-server";

interface MessageWithCompany {
  id: string;
  chatRoomId: string;
  content: string;
  pdfUrl: string | null;
  readStatus: boolean;
  senderCompanyProfileId: string;
  receiverCompanyProfileId: string;
  createdAt: Date;
  updatedAt: Date;
  senderCompany: {
    companyTitle: string;
    profileImage: string | null;
  };
  receiverCompany: {
    companyTitle: string;
    profileImage: string | null;
  };
  tenderId?: string | null;
}

interface ChatRoomWithDetails {
  id: string;
  other_company_profile: {
    company_title: string;
    profile_image: string | null;
  };
  last_message: MessageWithCompany | null;
  unread_count: number;
}

interface ChatRoomDetails {
  id: string;
  tenderId: string | null;
  initiatorCompanyProfileId: string;
  recipientCompanyProfileId: string;
  initiator_company_title: string;
  initiator_company_image: string | null;
  recipient_company_title: string;
  recipient_company_image: string | null;
}

// Helper function to get email from company profile
async function getCompanyEmail(companyId: string): Promise<string | null> {
  try {
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      select: { companyEmail: true }
    });
    return company?.companyEmail || null;
  } catch (error) {
    console.error("Error fetching company email:", error);
    return null;
  }
}

async function sendNewMessageNotification(
  senderId: string,
  receiverId: string,
  chatRoomId: string,
  messageContent: string
) {
  try {
    const [sender, receiver] = await Promise.all([
      prisma.company.findUnique({
        where: { id: senderId },
        select: { companyTitle: true, companyEmail: true }
      }),
      prisma.company.findUnique({
        where: { id: receiverId },
        select: { companyEmail: true }
      })
    ]);

    if (!sender || !receiver) {
      console.error("Sender or receiver not found");
      return;
    }

    const receiverEmail = receiver.companyEmail;
    
    if (!receiverEmail) {
      console.log("No valid email found for receiver, skipping notification");
      return;
    }

    const emailParams = {
      to: [receiverEmail],
      title: "New Message Received",
      body: `You have a new message from ${sender.companyTitle}. Message preview: "${messageContent.substring(0, 50)}${messageContent.length > 50 ? '...' : ''}". Click <a href="${process.env.NEXT_PUBLIC_WEBSITE_URL}/chats/${chatRoomId}">here</a> to view the full conversation.`
    };

    await sendEmail(emailParams);
    console.log("New message notification sent successfully");
  } catch (error) {
    console.error("Error sending new message notification:", error);
  }
}

export async function getMessages(chatRoomId: string, limit: number = 50, offset: number = 0) {
  try {
    // Fetch messages with company details
    const messages = await prisma.message.findMany({
      where: { chatRoomId },
      include: {
        senderCompany: {
          select: {
            companyTitle: true,
            profileImage: true
          }
        },
        receiverCompany: {
          select: {
            companyTitle: true,
            profileImage: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: limit
    });

    // Fetch chat room details
    const chatRoom = await prisma.chatRoom.findUnique({
      where: { id: chatRoomId },
      include: {
        senderCompany: {
          select: {
            companyTitle: true,
            profileImage: true
          }
        },
        receiverCompany: {
          select: {
            companyTitle: true,
            profileImage: true
          }
        },
        tender: {
          select: {
            id: true
          }
        }
      }
    });

    if (!chatRoom) {
      return { messages: [], chatRoomDetails: null };
    }

    const chatRoomDetails: ChatRoomDetails = {
      id: chatRoom.id,
      tenderId: chatRoom.tenderId,
      initiatorCompanyProfileId: chatRoom.senderCompanyProfileId,
      recipientCompanyProfileId: chatRoom.receiverCompanyProfileId,
      initiator_company_title: chatRoom.senderCompany.companyTitle,
      initiator_company_image: chatRoom.senderCompany.profileImage,
      recipient_company_title: chatRoom.receiverCompany.companyTitle,
      recipient_company_image: chatRoom.receiverCompany.profileImage,
    };

    return {
      messages: messages as MessageWithCompany[],
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

    const currentProfileId = currentProfile.id;

    // Fetch all chat rooms where the current profile is either sender or receiver
    const chatRooms = await prisma.chatRoom.findMany({
      where: {
        OR: [
          { senderCompanyProfileId: currentProfileId },
          { receiverCompanyProfileId: currentProfileId }
        ]
      },
      include: {
        senderCompany: {
          select: {
            companyTitle: true,
            profileImage: true
          }
        },
        receiverCompany: {
          select: {
            companyTitle: true,
            profileImage: true
          }
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: {
            senderCompany: {
              select: {
                companyTitle: true,
                profileImage: true
              }
            },
            receiverCompany: {
              select: {
                companyTitle: true,
                profileImage: true
              }
            }
          }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    const chatRoomsWithDetails: ChatRoomWithDetails[] = await Promise.all(
      chatRooms.map(async (room) => {
        const otherCompanyProfile = 
          room.senderCompanyProfileId === currentProfileId
            ? room.receiverCompany
            : room.senderCompany;

        // Count unread messages
        const unreadCount = await prisma.message.count({
          where: {
            chatRoomId: room.id,
            receiverCompanyProfileId: currentProfileId,
            readStatus: false
          }
        });

        return {
          id: room.id,
          other_company_profile: {
            company_title: otherCompanyProfile.companyTitle,
            profile_image: otherCompanyProfile.profileImage,
          },
          last_message: room.messages[0] as MessageWithCompany || null,
          unread_count: unreadCount,
        };
      })
    );

    return chatRoomsWithDetails;
  } catch (error) {
    console.error("Error in getChatRoomsForCurrentProfile:", error);
    return null;
  }
}

export async function markMessagesAsRead(
  chatRoomId: string, 
  receiverCompanyProfileId: string
): Promise<boolean> {
  try {
    await prisma.message.updateMany({
      where: {
        chatRoomId,
        receiverCompanyProfileId,
        readStatus: false
      },
      data: {
        readStatus: true
      }
    });

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
): Promise<{ id: string; isNew: boolean } | null> {
  try {
    // Try to find existing chat room (bidirectional check)
    let chatRoom = await prisma.chatRoom.findFirst({
      where: {
        OR: [
          {
            senderCompanyProfileId: initiatorCompanyProfileId,
            receiverCompanyProfileId: recipientCompanyProfileId,
            tenderId: tenderId || null
          },
          {
            senderCompanyProfileId: recipientCompanyProfileId,
            receiverCompanyProfileId: initiatorCompanyProfileId,
            tenderId: tenderId || null
          }
        ]
      }
    });

    let isNew = false;

    // Create new chat room if doesn't exist
    if (!chatRoom) {
      chatRoom = await prisma.chatRoom.create({
        data: {
          senderCompanyProfileId: initiatorCompanyProfileId,
          receiverCompanyProfileId: recipientCompanyProfileId,
          tenderId: tenderId || null
        }
      });
      isNew = true;

      // Send notification for new chat room
      await sendNewChatRoomNotification(
        initiatorCompanyProfileId,
        recipientCompanyProfileId,
        chatRoom.id
      );
    }

    return {
      id: chatRoom.id,
      isNew: isNew,
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
): Promise<{ success: boolean; data?: MessageWithCompany; error?: string }> {
  try {
    // Create the message
    const message = await prisma.message.create({
      data: {
        chatRoomId,
        content,
        senderCompanyProfileId,
        receiverCompanyProfileId,
        pdfUrl: pdfUrl || null,
        readStatus: false
      },
      include: {
        senderCompany: {
          select: {
            companyTitle: true,
            profileImage: true
          }
        },
        receiverCompany: {
          select: {
            companyTitle: true,
            profileImage: true
          }
        }
      }
    });

    // Update chat room's updatedAt
    await prisma.chatRoom.update({
      where: { id: chatRoomId },
      data: { updatedAt: new Date() }
    });

    // Trigger Pusher event for real-time update
    await pusherServer.trigger(
      `chat-${chatRoomId}`,
      "new-message",
      message
    );

    // Send email notification
    await sendNewMessageNotification(
      senderCompanyProfileId,
      receiverCompanyProfileId,
      chatRoomId,
      content
    );

    return { success: true, data: message as MessageWithCompany };
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
      prisma.company.findUnique({
        where: { id: initiatorId },
        select: { companyTitle: true, companyEmail: true }
      }),
      prisma.company.findUnique({
        where: { id: recipientId },
        select: { companyEmail: true }
      })
    ]);

    if (!initiator || !recipient) {
      console.error("Initiator or recipient not found");
      return;
    }

    const recipientEmail = recipient.companyEmail;

    if (!recipientEmail) {
      console.log("No valid email found for recipient, skipping notification");
      return;
    }

    const emailParams = {
      to: [recipientEmail],
      title: "New Chat Room Created",
      body: `${initiator.companyTitle} has started a new chat with you. Click <a href="${process.env.NEXT_PUBLIC_WEBSITE_URL}/chats/${chatRoomId}">here</a> to view the conversation.`
    };

    await sendEmail(emailParams);
    console.log("New chat room notification sent successfully");
  } catch (error) {
    console.error("Error sending new chat room notification:", error);
  }
}