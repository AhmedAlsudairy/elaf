import { getCurrentCompanyProfile } from '@/actions/neon/company/get-current-company-profile';
import { Button } from "@/components/ui/button";
import { MessageCircle, Edit } from "lucide-react";
import Link from 'next/link';
import { createOrGetChatRoom } from '@/actions/neon/chat/chats';
import { getCompanyProfileById } from '@/actions/neon/company/gett-company-profile-by-id';
import { notFound, redirect } from 'next/navigation';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, Globe, Building } from "lucide-react";

export default async function CompanyProfilePage({ 
  params 
}: { 
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const company = await getCompanyProfileById(id);

  if (!company) {
    notFound();
  }
  const currentProfile = await getCurrentCompanyProfile();
  console.log('AAAAAAAAAAAAcurrentProfile:', currentProfile);
  console.log('params.id:', id);
  console.log('canChat:', currentProfile && currentProfile.id !== id);
  const canChat = currentProfile && currentProfile.id !== id;
  const isOwnProfile = currentProfile && currentProfile.id === id;

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-lg p-8">
        {/* Header */}
        <div className="flex items-start gap-6 mb-6 justify-between">
          <div className="flex items-start gap-6">
            <Avatar className="w-24 h-24">
              {company.profileImage ? (
                <AvatarImage src={company.profileImage} alt={company.companyTitle} />
              ) : (
                <AvatarFallback className="text-2xl">
                  {company.companyTitle.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{company.companyTitle}</h1>
              {company.companyNumber && (
                <p className="text-gray-600 mb-2">Company #: {company.companyNumber}</p>
              )}
            </div>
          </div>
          
          {isOwnProfile && (
            <Link href={`/profile/companyprofiles/${id}/edit`}>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2">
                <Edit className="h-4 w-4" />
                Edit Profile
              </Button>
            </Link>
          )}
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
            <a href={`mailto:${company.companyEmail}`} className="hover:underline">
              {company.companyEmail}
            </a>
          </div>

          {company.phoneNumber && (
            <div className="flex items-center gap-2 text-gray-700">
              <Phone className="w-5 h-5 text-blue-600" />
              <span>{company.phoneNumber}</span>
            </div>
          )}

          {company.address && (
            <div className="flex items-center gap-2 text-gray-700">
              <MapPin className="w-5 h-5 text-blue-600" />
              <span>{company.address}</span>
            </div>
          )}

          {company.companyWebsite && (
            <div className="flex items-center gap-2 text-gray-700">
              <Globe className="w-5 h-5 text-blue-600" />
              <a href={company.companyWebsite} target="_blank" rel="noopener noreferrer" className="hover:underline">
                {company.companyWebsite}
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
            id
          );
          if (chatRoom) {
            redirect(`/chats/${chatRoom.id}`); // Assuming chatRoom.id
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