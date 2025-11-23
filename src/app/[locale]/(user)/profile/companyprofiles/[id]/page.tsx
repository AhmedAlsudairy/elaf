import { getCurrentCompanyProfile } from '@/actions/supabase/get-current-company-profile';
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import Link from 'next/link';
import { createOrGetChatRoom } from '@/actions/supabase/chats';
import { getCompanyProfileById } from '@/actions/supabase/gett-company-profile-by-id';
import { notFound, redirect } from 'next/navigation';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, Globe, Building } from "lucide-react";

export default async function CompanyProfilePage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const company = await getCompanyProfileById(params.id);

  if (!company) {
    notFound();
  }
const currentProfile = await getCurrentCompanyProfile();
console.log('AAAAAAAAAAAAcurrentProfile:', currentProfile);
console.log('params.id:', params.id);
console.log('canChat:', currentProfile && currentProfile.id !== params.id);
const canChat = currentProfile && currentProfile.id !== params.id;


  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-lg p-8">
        {/* Header */}
        <div className="flex items-start gap-6 mb-6">
          <Avatar className="w-24 h-24">
            {company.profile_image ? (
              <AvatarImage src={company.profile_image} alt={company.company_title} />
            ) : (
              <AvatarFallback className="text-2xl">
                {company.company_title.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            )}
          </Avatar>
          
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{company.company_title}</h1>
            {company.company_number && (
              <p className="text-gray-600 mb-2">Company #: {company.company_number}</p>
            )}
          </div>
        </div>

        {/* Bio */}
        {company.bio && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">About</h2>
            <p className="text-gray-700">{company.bio}</p>
          </div>
        )}

        {/* Contact Info */}
        <div className="mb-6 space-y-2">
          <h2 className="text-xl font-semibold mb-3">Contact Information</h2>
          
          <div className="flex items-center gap-2 text-gray-700">
            <Mail className="w-5 h-5 text-blue-600" />
            <a href={`mailto:${company.company_email}`} className="hover:underline">
              {company.company_email}
            </a>
          </div>

          {company.phone_number && (
            <div className="flex items-center gap-2 text-gray-700">
              <Phone className="w-5 h-5 text-blue-600" />
              <span>{company.phone_number}</span>
            </div>
          )}

          {company.address && (
            <div className="flex items-center gap-2 text-gray-700">
              <MapPin className="w-5 h-5 text-blue-600" />
              <span>{company.address}</span>
            </div>
          )}

          {company.company_website && (
            <div className="flex items-center gap-2 text-gray-700">
              <Globe className="w-5 h-5 text-blue-600" />
              <a href={company.company_website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                {company.company_website}
              </a>
            </div>
          )}
        </div>
        {/* Chat Button */}
              {canChat && (
        <form action={async () => {
          'use server'
          const chatRoom = await createOrGetChatRoom(
            currentProfile!.id,
            params.id
          );
          if (chatRoom) {
            redirect(`/chats/${chatRoom.chat_room_id}`);
          }
        }}>
          <Button type="submit" className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            Start Chat
          </Button>
        </form>
      )}
              {/* Sectors */}
        {company.sectors && company.sectors.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-3">Sectors</h2>
            <div className="flex flex-wrap gap-2">
              {company.sectors.map((sector, index) => (
                <Badge key={index} className="bg-blue-100 text-blue-600">
                  {sector}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}