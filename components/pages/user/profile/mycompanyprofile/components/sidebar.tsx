import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Menu } from "lucide-react";
import { AddSectionDialog } from './coustom-section-dialog';
import { SectionTab } from '@/types';

interface SidebarProps {
  sections: SectionTab[];
  activeTab: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ sections, activeTab }) => {
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const { companyId } = useParams();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const SidebarContent = () => (
    <div className="space-y-2 py-4">
      <Link href={`/profile/companyprofile/${companyId}`} passHref>
        <Button
          variant={activeTab === '' ? 'default' : 'ghost'}
          className="w-full justify-start"
        >
          Info
        </Button>
      </Link>
      <Link href={`/profile/companyprofile/${companyId}/tenders`} passHref>
        <Button
          variant={activeTab === 'tenders' ? 'default' : 'ghost'}
          className="w-full justify-start"
        >
          Tenders
        </Button>
      </Link>
      <Link href={`/profile/companyprofile/${companyId}/requests`} passHref>
        <Button
          variant={activeTab === 'requests' ? 'default' : 'ghost'}
          className="w-full justify-start"
        >
          Requests
        </Button>
      </Link>
      {sections.map((section) => (
        <Link key={section.id} href={`/profile/companyprofile/${companyId}/${section.id}`} passHref>
          <Button
            variant={activeTab === section.id ? 'default' : 'ghost'}
            className="w-full justify-start"
          >
            {section.title}
          </Button>
        </Link>
      ))}
      <AddSectionDialog />
    </div>
  );

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="fixed top-4 left-4 z-50 md:hidden">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64">
          <ScrollArea className="h-full">
            <SidebarContent />
          </ScrollArea>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div className="w-64 mr-4 h-fit">
      <SidebarContent />
    </div>
  );
};