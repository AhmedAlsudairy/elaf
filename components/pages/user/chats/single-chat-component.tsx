import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import {
  Send,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  FileText,
  ExternalLink,
  Menu,
  Loader2,
} from "lucide-react";
import { fetchTenderData } from "@/actions/supabase/get-tender";
import PDFUpload from "@/components/common/pdf-upload";
import { getReadStatus, sendMessage, getMessages } from "@/actions/supabase/chats";
import { useQuery } from '@tanstack/react-query';
import { useSubscribeToChat } from "@/hooks/messages subs-hook";

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

interface TenderInfo {
  tender_id: string;
  title: string;
  status: string;
  end_date: string | null;
}

interface ChatRoomComponentProps {
  chatRoomId: string;
  initialMessages: Message[];
  isLoading: boolean;
  fetchNextPage: () => void;
  hasNextPage: boolean | undefined;
  currentCompanyProfile: any;
  toggleChatList: () => void;
}

const ChatRoomComponent: React.FC<ChatRoomComponentProps> = ({
  chatRoomId,
  initialMessages,
  isLoading,
  fetchNextPage,
  hasNextPage,
  currentCompanyProfile,
  toggleChatList,
}) => {
  const [newMessage, setNewMessage] = useState("");
  const [showTenderDetails, setShowTenderDetails] = useState(false);
  const [pdfUrls, setPdfUrls] = useState<string[]>([]);
  const [chatRoomDetails, setChatRoomDetails] = useState<ChatRoomDetails | null>(null);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [allMessages, setAllMessages] = useState<Message[]>(initialMessages);
  const [tenderInfo, setTenderInfo] = useState<TenderInfo | null>(null);
  const [isBackLoading, setIsBackLoading] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { data: readStatus } = useQuery({
    queryKey: ['readStatus'],
    queryFn: getReadStatus
  });

  const newMessages = useSubscribeToChat(chatRoomId);

  useEffect(() => {
    setAllMessages(prevMessages => {
      const updatedMessages = [...prevMessages, ...newMessages];
      return updatedMessages.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    });
  }, [newMessages]);

  useEffect(() => {
    setAllMessages(initialMessages.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()));
  }, [initialMessages]);

  useEffect(() => {
    const fetchChatRoomDetails = async () => {
      if (allMessages.length > 0 && !chatRoomDetails) {
        try {
          const result = await getMessages(chatRoomId, 1, 0);
          if (result.chatRoomDetails) {
            setChatRoomDetails(result.chatRoomDetails);
          }
        } catch (error) {
          console.error("Error fetching chat room details:", error);
        }
      }
    };

    fetchChatRoomDetails();
  }, [allMessages, chatRoomId, chatRoomDetails]);

  const lastTenderMessage = useMemo(() => {
    return [...allMessages].reverse().find(message => message.tender_id !== null);
  }, [allMessages]);

  useEffect(() => {
    const fetchTenderInfo = async () => {
      if (lastTenderMessage?.tender_id) {
        try {
          const result = await fetchTenderData(lastTenderMessage.tender_id);
          setTenderInfo(result.tender);
        } catch (error) {
          console.error("Error fetching tender info:", error);
        }
      }
    };

    fetchTenderInfo();
  }, [lastTenderMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages]);

  const handleSendMessage = async () => {
    if ((!newMessage.trim() && pdfUrls.length === 0) || !chatRoomDetails || !currentCompanyProfile) return;

    setIsSendingMessage(true);

    const receiverCompanyProfileId =
      chatRoomDetails.initiator_company_profile_id === currentCompanyProfile.company_profile_id
        ? chatRoomDetails.recipient_company_profile_id
        : chatRoomDetails.initiator_company_profile_id;

    try {
      const result = await sendMessage(
        chatRoomId,
        newMessage,
        currentCompanyProfile.company_profile_id,
        receiverCompanyProfileId,
        undefined,
        undefined,
        pdfUrls[0]
      );
      if (result && result.success && result.data) {
        setNewMessage("");
        setPdfUrls([]);
      } else {
        toast({
          title: "Error",
          description: "Failed to send message",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast({
        title: "Error",
        description: "Unexpected error sending message",
        variant: "destructive",
      });
    } finally {
      setIsSendingMessage(false);
    }
  };

  const getOtherCompanyDetails = useCallback(() => {
    if (!chatRoomDetails || !currentCompanyProfile) return null;

    const isInitiator = chatRoomDetails.initiator_company_profile_id === currentCompanyProfile.company_profile_id;
    return {
      company_title: isInitiator ? chatRoomDetails.recipient_company_title : chatRoomDetails.initiator_company_title,
      company_image: isInitiator ? chatRoomDetails.recipient_company_image : chatRoomDetails.initiator_company_image,
    };
  }, [chatRoomDetails, currentCompanyProfile]);

  const toggleTenderDetails = () => setShowTenderDetails((prev) => !prev);

  const handlePdfChange = useCallback((url: string) => {
    setPdfUrls((prev) => [...prev, url]);
  }, []);

  const handlePdfRemove = useCallback((url: string) => {
    setPdfUrls((prev) => prev.filter((u) => u !== url));
  }, []);

  const handleBack = async () => {
    setIsBackLoading(true);
    try {
      await router.push("/chats");
    } catch (error) {
      console.error("Error navigating back:", error);
      toast({
        title: "Error",
        description: "Failed to navigate back. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsBackLoading(false);
    }
  };

  const renderMessage = (message: Message) => {
    const isSender = message.sender_company_profile_id === currentCompanyProfile?.company_profile_id;
    const messageClassName = `flex ${isSender ? 'justify-end' : 'justify-start'} mb-4`;
    const bubbleClassName = `rounded-lg p-3 ${
      isSender ? 'bg-blue-500 text-white' : 'bg-gray-100 text-black'
    } max-w-[85%] break-words`;
  
    return (
      <div key={message.id} className={messageClassName}>
        <div className={`flex ${isSender ? 'flex-row-reverse' : 'flex-row'} items-end max-w-[85%]`}>
          <Avatar className="w-8 h-8 flex-shrink-0 mx-2">
            <AvatarImage src={message.sender_avatar || undefined} alt={message.sender_name} />
            <AvatarFallback>
              {message.company_title && message.company_title.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className={`flex flex-col ${isSender ? 'items-end' : 'items-start'} flex-grow`}>
            <div className={bubbleClassName}>
              <p className="text-sm whitespace-normal break-words hyphens-auto">{message.content}</p>
              {message.pdf_url && (
                <a
                  href={message.pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center ${isSender ? 'text-white' : 'text-blue-500'} hover:underline mt-2 text-xs`}
                >
                  <FileText className="h-3 w-3 mr-1" />
                  View PDF
                </a>
              )}
            </div>
            <div className="flex items-center mt-1 text-xs text-gray-500">
              <span>{message.sender_name}</span>
              <span className="mx-1">•</span>
              <span>{format(new Date(message.created_at), "HH:mm")}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        Loading Chat Room...
      </div>
    );
  }

  const otherCompanyDetails = getOtherCompanyDetails();

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]"> {/* Adjust the 4rem value based on your footer height */}
      <Card className="flex flex-col flex-grow overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-2 border-b shrink-0">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" onClick={toggleChatList} className="mr-2 lg:hidden">
              <Menu className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              disabled={isBackLoading}
            >
              {isBackLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <ArrowLeft className="mr-2 h-4 w-4" />
              )}
              Back
            </Button>
          </div>
          {otherCompanyDetails && (
            <div className="flex items-center">
              <Avatar className="w-8 h-8 mr-2">
                <AvatarImage
                  src={otherCompanyDetails.company_image || undefined}
                  alt={otherCompanyDetails.company_title}
                />
                <AvatarFallback>
                  {otherCompanyDetails.company_title.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-lg font-bold">
                {otherCompanyDetails.company_title}
              </CardTitle>
            </div>
          )}
        </CardHeader>
        <div className="flex-grow flex flex-col min-h-0">
          {lastTenderMessage && tenderInfo && (
            <div className="px-4 py-2 bg-gray-100 border-b shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTenderDetails}
                disabled={isBackLoading}
                className="w-full flex justify-between items-center"
              >
                <span className="text-left truncate">Tender: {tenderInfo.title}</span>
                {showTenderDetails ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </Button>
              {showTenderDetails && (
                <div className="mt-2 text-sm">
                  <p><strong>Status:</strong> {tenderInfo.status}</p>
                  <p><strong>End Date:</strong> {tenderInfo.end_date ? format(new Date(tenderInfo.end_date), "PPP") : "Not specified"}</p>
                  <p><strong>Last Message:</strong> {lastTenderMessage.content}</p>
                  <p><strong>Sent at:</strong> {format(new Date(lastTenderMessage.created_at), "PPP HH:mm")}</p>
                  <Button
                    variant="link"
                    asChild
                    className="text-blue-500 hover:underline flex items-center mt-2 p-0"
                  >
                    <a href={`/tenders/${tenderInfo.tender_id}`}>
                      View Full Tender Details
                      <ExternalLink className="h-4 w-4 ml-1" />
                    </a>
                  </Button>
                </div>
              )}
            </div>
          )}
          <div className="flex-grow overflow-hidden flex flex-col">
            <CardContent className="flex-grow overflow-y-auto py-4">
              <div className="space-y-4">
                {hasNextPage && (
                  <div className="flex justify-center mb-8">
                    <Button onClick={() => fetchNextPage()} variant="outline" size="sm">
                      Load More Messages
                    </Button>
                  </div>
                )}
                {allMessages.map(renderMessage)}
                <div ref={messagesEndRef} />
              </div>
            </CardContent>
          </div>
        </div>
        <CardFooter className="flex-col space-y-2 border-t p-4">
          <PDFUpload
            disabled={isSendingMessage}
            onChange={handlePdfChange}
            onRemove={handlePdfRemove}
            value={pdfUrls}
            bucketName="profile"
          />
          <div className="flex w-full space-x-2">
            <Input
              type="text"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && !isSendingMessage && handleSendMessage()}
              disabled={isSendingMessage}
            />
            <Button onClick={handleSendMessage} disabled={isSendingMessage}>
              {isSendingMessage ? (
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
  
};

export default ChatRoomComponent;