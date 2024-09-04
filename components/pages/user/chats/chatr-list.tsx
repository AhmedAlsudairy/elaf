import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface ChatRoom {
  id: string;
  other_company_profile: {
    company_title: string;
    profile_image: string | null;
  };
  last_message: {
    content: string;
    created_at: string;
  } | null;
  unread_count: number;
}

interface ChatRoomListProps {
  chatRooms: ChatRoom[];
  currentChatRoomId: string | undefined;
  onChatRoomClick: (chatRoomId: string) => Promise<void>;
}

const ChatRoomList: React.FC<ChatRoomListProps> = React.memo(({ chatRooms, currentChatRoomId, onChatRoomClick }) => {
  if (chatRooms.length === 0) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-gray-500">You don't have any chat rooms!</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      <h2 className="text-2xl font-bold p-4 border-b">Chats</h2>
      <ul className="flex-grow overflow-y-auto divide-y divide-gray-200">
        {chatRooms.map((room) => (
          <li key={room.id} className="hover:bg-gray-50">
            <button
              onClick={() => onChatRoomClick(room.id)}
              className={`w-full text-left p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
                currentChatRoomId === room.id ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-center">
                <Avatar className="h-12 w-12 flex-shrink-0 mr-4">
                  <AvatarImage src={room.other_company_profile.profile_image || undefined} alt={room.other_company_profile.company_title} />
                  <AvatarFallback>{room.other_company_profile.company_title.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-grow min-w-0">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-gray-900 truncate">{room.other_company_profile.company_title}</h3>
                    {room.last_message && (
                      <span className="text-sm text-gray-500 flex-shrink-0 ml-2">
                        {format(new Date(room.last_message.created_at), "HH:mm")}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {room.last_message ? room.last_message.content : 'No messages yet'}
                  </p>
                </div>
                {room.unread_count > 0 && (
                  <Badge variant="destructive" className="ml-2 flex-shrink-0">
                    {room.unread_count}
                  </Badge>
                )}
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
});

ChatRoomList.displayName = 'ChatRoomList';

export default ChatRoomList;