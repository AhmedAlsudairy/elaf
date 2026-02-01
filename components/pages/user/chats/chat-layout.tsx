'use client'
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useRouter, usePathname } from 'next/navigation';
import { useQuery, useInfiniteQuery, InfiniteData } from '@tanstack/react-query';
import { ClipLoader } from 'react-spinners';
import { getChatRoomsForCurrentProfile, getMessages, markMessagesAsRead } from "@/actions/neon/chat/chats";
import { getCurrentCompanyProfile } from "@/actions/neon/company/get-current-company-profile";
import ChatRoomComponent from '@/components/pages/user/chats/single-chat-component';
import { useSubscribeToChat } from "@/hooks/messages subs-hook";
import ChatRoomList from './chatr-list';
import { Button } from "@/components/ui/button";

const MESSAGES_PER_PAGE = 20;

interface CompanyProfile {
  company_title: string;
  company_email: string;
  company_profile_id?: string;
  profile_image?: string;
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
  read_status: string;
  sender_name?: string;
  sender_avatar?: string | null;
  company_title?: string | null;
  company_image?: string | null;
}

interface ChatRoom {
  id: string;
  other_company_profile: {
    company_title: string;
    profile_image: string | null;
  };
  last_message: Message | null;
  unread_count: number;
}

interface MessagesResponse {
  messages: Message[];
  chatRoomDetails: {
    id: string;
    tender_id: string | null;
    initiator_company_profile_id: string;
    recipient_company_profile_id: string;
    initiator_company_title: string;
    initiator_company_image: string | null;
    recipient_company_title: string;
    recipient_company_image: string | null;
  } | null;
}

const ChatInterface: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const currentChatRoomId = params.chatRoomId as string | undefined;
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [showChatList, setShowChatList] = useState(true);
  const [isRouting, setIsRouting] = useState(false);



  
  useEffect(() => {

    const fetchProfile = async () => {
      try {
          const profileData = await getCurrentCompanyProfile();
          console.log('profileData from getCurrentCompanyProfile:', profileData); 
          if (profileData) {
            setProfile({
              company_title: profileData.companyTitle,      
              company_email: profileData.companyEmail,      
              company_profile_id: profileData.id,           
              profile_image: profileData.profileImage || undefined,      
            });
          }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 700) {
        setShowChatList(true);
      } else {
        setShowChatList(pathname === '/chats' || !currentChatRoomId);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [pathname, currentChatRoomId]);

  const { 
    data: chatRooms, 
    isLoading: isChatRoomsLoading, 
    error: chatRoomsError 
  } = useQuery<ChatRoom[]>({
    queryKey: ['chatRooms'],
    queryFn: async () => {
      const rooms = await getChatRoomsForCurrentProfile();
      if (!rooms) return [];
      
      return rooms.map(room => ({
        ...room,
        last_message: room.last_message ? {
          id: room.last_message.id,
          chat_room_id: room.last_message.chatRoomId,
          tender_id: room.last_message.tenderId || null,
          content: room.last_message.content,
          created_at: new Date(room.last_message.createdAt).toISOString(),
          tender_request_id: null, // Message doesn't have this property in DB
          pdf_url: room.last_message.pdfUrl,
          sender_company_profile_id: room.last_message.senderCompanyProfileId,
          receiver_company_profile_id: room.last_message.receiverCompanyProfileId,
          read_status: room.last_message.readStatus ? "true" : "false",
          sender_name: room.last_message.senderCompany.companyTitle,
          sender_avatar: room.last_message.senderCompany.profileImage,
          company_title: room.last_message.senderCompany.companyTitle,
          company_image: room.last_message.senderCompany.profileImage
        } : null
      }));
    }
  });

  const { 
    data: messagesData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status: messagesStatus,
    error: messagesError,
    refetch: refetchMessages
  } = useInfiniteQuery<MessagesResponse, Error, InfiniteData<MessagesResponse>, [string, string | undefined], number>({
    queryKey: ['messages', currentChatRoomId],
    queryFn: async ({ pageParam }) => {
      if (!currentChatRoomId) throw new Error('No chat room selected');
      const data = await getMessages(currentChatRoomId, MESSAGES_PER_PAGE, pageParam);

      if (!data) return { messages: [], chatRoomDetails: null };

      return {
        messages: data.messages.map(msg => ({
          id: msg.id,
          chat_room_id: msg.chatRoomId,
          tender_id: msg.tenderId || null,
          content: msg.content,
          created_at: new Date(msg.createdAt).toISOString(),
          tender_request_id: null,
          pdf_url: msg.pdfUrl,
          sender_company_profile_id: msg.senderCompanyProfileId,
          receiver_company_profile_id: msg.receiverCompanyProfileId,
          read_status: msg.readStatus ? "true" : "false",
          sender_name: msg.senderCompany.companyTitle,
          sender_avatar: msg.senderCompany.profileImage,
          company_title: msg.senderCompany.companyTitle,
          company_image: msg.senderCompany.profileImage
        })),
        chatRoomDetails: data.chatRoomDetails ? {
          id: data.chatRoomDetails.id,
          tender_id: data.chatRoomDetails.tenderId,
          initiator_company_profile_id: data.chatRoomDetails.initiatorCompanyProfileId,
          recipient_company_profile_id: data.chatRoomDetails.recipientCompanyProfileId,
          initiator_company_title: data.chatRoomDetails.initiator_company_title,
          initiator_company_image: data.chatRoomDetails.initiator_company_image,
          recipient_company_title: data.chatRoomDetails.recipient_company_title,
          recipient_company_image: data.chatRoomDetails.recipient_company_image,
        } : null
      };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => 
      lastPage.messages.length === MESSAGES_PER_PAGE ? allPages.length * MESSAGES_PER_PAGE : undefined,
    enabled: !!currentChatRoomId,
  });

  const newMessages = useSubscribeToChat(currentChatRoomId ?? '');

  const allMessages = useMemo(() => {
    const messages = messagesData?.pages.flatMap(page => page.messages) ?? [];
    return [...messages, ...newMessages].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  }, [messagesData, newMessages]);

  const handleChatRoomClick = useCallback(async (chatRoomId: string) => {
    if (profile?.company_profile_id && chatRoomId !== currentChatRoomId) {
      setIsRouting(true);
      try {
        await router.push(`/chats/${chatRoomId}`);
        await markMessagesAsRead(chatRoomId, profile.company_profile_id);
        if (window.innerWidth <= 700) {
          setShowChatList(false);
        }
        await refetchMessages();
      } catch (error) {
        console.error('Error during navigation:', error);
      } finally {
        setIsRouting(false);
      }
    }
  }, [profile, router, currentChatRoomId, refetchMessages]);

  const toggleChatList = useCallback(() => {
    setShowChatList(prev => !prev);
  }, []);



  if (!profile || isChatRoomsLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#3B82F6" size={50} />
      </div>
    );
  }
if (!profile ) {
  return (
    <div className="text-center text-red-500 my-4">
you don&apos;t have a company profile. Please create one to start chatting.
    </div>
  );

}
  if (chatRoomsError) {
    return (
      <div className="text-center text-red-500 my-4">
        An error occurred. Please try again later.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen md:flex-row">
      <div className={`md:w-1/3 ${showChatList ? 'flex-grow md:flex-grow-0' : 'hidden'} md:block border-r`}>
        <ChatRoomList
          chatRooms={chatRooms || []}
          currentChatRoomId={currentChatRoomId}
          onChatRoomClick={handleChatRoomClick}
        />
      </div>
      <div className={`flex-grow ${!showChatList || (window.innerWidth > 700 && currentChatRoomId) ? 'flex flex-col' : 'hidden md:flex md:flex-col'}`}>
        {isRouting ? (
          <div className="flex justify-center items-center h-full">
            <ClipLoader color="#3B82F6" size={50} />
          </div>
        ) : currentChatRoomId ? (
          <div className="flex flex-col h-full">
            <div className="flex-grow overflow-y-auto">
              <ChatRoomComponent
                chatRoomId={currentChatRoomId}
                initialMessages={allMessages}
                isLoading={messagesStatus === 'pending'}
                fetchNextPage={fetchNextPage}
                hasNextPage={!!hasNextPage}
                currentCompanyProfile={profile}
                toggleChatList={toggleChatList}
              />
              {messagesStatus === 'error' && (
                <div className="text-center text-red-500 my-4">Error loading messages. Please try again.</div>
              )}
            </div>
            {hasNextPage && (
              <div className="p-4 border-t">
                <Button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="flex items-center justify-center space-x-2 w-full"
                >
                  {isFetchingNextPage ? (
                    <>
                      <ClipLoader color="#FFFFFF" size={20} />
                      <span>Loading more...</span>
                    </>
                  ) : (
                    'Load More Messages'
                  )}
                </Button>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default React.memo(ChatInterface);