import ChatRoomComponent from '@/components/pages/user/chats/single-chat-component';
import React from 'react';

interface PageProps {
  params: { chatRoomId: string };
}

const ChatRoomPage: React.FC<PageProps> = ({ params }) => {
  const { chatRoomId } = params;

  return <ChatRoomComponent chatRoomId={chatRoomId} />;
};

export default ChatRoomPage;