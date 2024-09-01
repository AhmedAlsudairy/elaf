'use client'
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useRouter, usePathname } from 'next/navigation';
import { useQuery, useInfiniteQuery, InfiniteData } from '@tanstack/react-query';
import { ClipLoader } from 'react-spinners';
import { getChatRoomsForCurrentProfile, getMessages, markMessagesAsRead } from "@/actions/supabase/chats";
import { getCurrentCompanyProfile } from "@/actions/supabase/get-current-company-profile";
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
        if (profileData) {
          setProfile({
            company_title: profileData.company_title,
            company_email: profileData.company_email,
            company_profile_id: profileData.company_profile_id,
            profile_image: profileData.profile_image,
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
      setShowChatList(pathname === '/chats' || window.innerWidth <= 700);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [pathname]);

  const { 
    data: chatRooms, 
    isLoading: isChatRoomsLoading, 
    error: chatRoomsError 
  } = useQuery<ChatRoom[]>({
    queryKey: ['chatRooms'],
    queryFn: async () => {
      const rooms = await getChatRoomsForCurrentProfile();
      return rooms ?? [];
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
      return getMessages(currentChatRoomId, MESSAGES_PER_PAGE, pageParam);
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
        setShowChatList(window.innerWidth <= 700);
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

  if (chatRoomsError) {
    return (
      <div className="text-center text-red-500 my-4">
        An error occurred. Please try again later.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen md:flex-row">
      <div className={`md:w-1/3 ${showChatList || pathname === '/chats' ? 'flex-grow md:flex-grow-0' : 'hidden'} md:block border-r`}>
        <ChatRoomList
          chatRooms={chatRooms || []}
          currentChatRoomId={currentChatRoomId}
          onChatRoomClick={handleChatRoomClick}
        />
      </div>
      <div className={`flex-grow ${!showChatList && pathname !== '/chats' ? 'flex flex-col' : 'hidden md:flex md:flex-col'}`}>
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