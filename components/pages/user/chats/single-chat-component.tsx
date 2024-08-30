'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { format } from 'date-fns';
import { Send, ArrowLeft, ChevronDown, ChevronUp, FileText, ExternalLink } from 'lucide-react';
import { getMessages, sendMessage } from '@/actions/supabase/chats';
import { fetchTenderData } from '@/actions/supabase/get-tender';
import { getCurrentCompanyProfile } from '@/actions/supabase/get-current-company-profile';
import { useSubscribeToChat } from '@/hooks/messages subs-hook';
import PDFUpload from '@/components/common/pdf-upload';

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

interface TenderDetails {
  tender_id: string | null;
  title: string;
  status: string;
  end_date: string | null;
}

interface ChatRoomComponentProps {
  chatRoomId: string;
}

const ChatRoomComponent: React.FC<ChatRoomComponentProps> = ({ chatRoomId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatRoomDetails, setChatRoomDetails] = useState<ChatRoomDetails | null>(null);
  const [tenderDetails, setTenderDetails] = useState<TenderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [currentCompanyProfile, setCurrentCompanyProfile] = useState<any>(null);
  const [showTenderDetails, setShowTenderDetails] = useState(false);
  const [pdfUrls, setPdfUrls] = useState<string[]>([]);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const newMessages = useSubscribeToChat(chatRoomId);

  const updateTenderDetails = useCallback(async (tenderId: string) => {
    const tenderResult = await fetchTenderData(tenderId);
    if (tenderResult?.tender) {
      setTenderDetails({
        tender_id: tenderResult.tender.tender_id || null,
        title: tenderResult.tender.title,
        status: tenderResult.tender.status,
        end_date: tenderResult.tender.end_date || null
      });
    }
  }, []);

  const fetchChatData = useCallback(async () => {
    try {
      const [messagesResult, currentCompanyProfileResult] = await Promise.all([
        getMessages(chatRoomId),
        getCurrentCompanyProfile()
      ]);

      if (messagesResult.success && messagesResult.data) {
        setMessages(messagesResult.data.messages);
        setChatRoomDetails(messagesResult.data.chatRoomDetails);

        const lastTenderMessage = [...messagesResult.data.messages]
          .reverse()
          .find(msg => msg.tender_id);

        if (lastTenderMessage?.tender_id) {
          await updateTenderDetails(lastTenderMessage.tender_id);
        }
      } else {
        toast({
          title: "Error",
          description: messagesResult.error || "Failed to load chat data.",
          variant: "destructive",
        });
      }

      if (currentCompanyProfileResult) {
        setCurrentCompanyProfile(currentCompanyProfileResult);
      } else {
        toast({
          title: "Error",
          description: "Failed to load current company profile.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while loading chat data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [chatRoomId, toast, updateTenderDetails]);

  useEffect(() => {
    fetchChatData();
  }, [fetchChatData]);

  useEffect(() => {
    if (newMessages.length > 0) {
      setMessages((prevMessages) => [...prevMessages, ...newMessages]);
      const lastTenderMessage = [...newMessages]
        .reverse()
        .find(msg => msg.tender_id);
      if (lastTenderMessage?.tender_id) {
        updateTenderDetails(lastTenderMessage.tender_id);
      }
    }
  }, [newMessages, updateTenderDetails]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if ((!newMessage.trim() && pdfUrls.length === 0) || !chatRoomDetails || !currentCompanyProfile) return;

    setIsSending(true);
    const receiverCompanyProfileId = chatRoomDetails.initiator_company_profile_id === currentCompanyProfile.company_profile_id
      ? chatRoomDetails.recipient_company_profile_id
      : chatRoomDetails.initiator_company_profile_id;

    try {
      const result = await sendMessage(
        chatRoomId,
        newMessage,
        currentCompanyProfile.company_profile_id,
        receiverCompanyProfileId,
        pdfUrls[0]
      );
      if (result.success) {
        setNewMessage('');
        setPdfUrls([]);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to send message.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while sending the message.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
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

  const toggleTenderDetails = () => setShowTenderDetails(prev => !prev);

  const handlePdfChange = useCallback((url: string) => {
    setPdfUrls((prev) => [...prev, url]);
  }, []);

  const handlePdfRemove = useCallback((url: string) => {
    setPdfUrls((prev) => prev.filter((u) => u !== url));
  }, []);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading chat room...</div>;
  }

  const otherCompanyDetails = getOtherCompanyDetails();

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="h-[90vh] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <Link href="/messages">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
          <div className="flex items-center">
            <Avatar className="w-8 h-8 mr-2">
              <AvatarImage src={otherCompanyDetails?.company_image || undefined} alt={otherCompanyDetails?.company_title} />
              <AvatarFallback>{otherCompanyDetails?.company_title?.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-lg font-bold">{otherCompanyDetails?.company_title}</CardTitle>
          </div>
        </CardHeader>
        {tenderDetails && (
          <div className="px-4 py-2 bg-gray-100">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleTenderDetails}
              className="w-full flex justify-between items-center"
            >
              <span>Current Tender: {tenderDetails.title}</span>
              {showTenderDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </Button>
            {showTenderDetails && (
              <div className="mt-2 text-sm">
                <p><strong>Status:</strong> {tenderDetails.status}</p>
                <p><strong>End Date:</strong> {tenderDetails.end_date ? format(new Date(tenderDetails.end_date), 'PPP') : 'Not specified'}</p>
                {tenderDetails.tender_id && (
                  <Link href={`/tenders/${tenderDetails.tender_id}`} className="text-blue-500 hover:underline flex items-center mt-2">
                    View Full Tender Details
                    <ExternalLink className="h-4 w-4 ml-1" />
                  </Link>
                )}
              </div>
            )}
          </div>
        )}
        <CardContent className="flex-grow overflow-y-auto pt-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="flex items-start space-x-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={message.sender_avatar || undefined} alt={message.sender_name} />
                  <AvatarFallback>{message.sender_name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p className="text-xs text-gray-500">{message.sender_name}</p>
                  <div className="bg-gray-100 rounded-lg p-2 mt-1 max-w-[80%]">
                    <p>{message.content}</p>
                    {message.pdf_url && (
                      <a href={message.pdf_url} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-500 hover:underline mt-2">
                        <FileText className="h-4 w-4 mr-1" />
                        View PDF
                      </a>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {format(new Date(message.created_at), 'HH:mm')}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
        <CardFooter className="flex-col space-y-2">
          <PDFUpload
            disabled={isSending}
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
              onKeyPress={(e) => e.key === 'Enter' && !isSending && handleSendMessage()}
              disabled={isSending}
            />
            <Button onClick={handleSendMessage} disabled={isSending}>
              {isSending ? 'Sending...' : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ChatRoomComponent;