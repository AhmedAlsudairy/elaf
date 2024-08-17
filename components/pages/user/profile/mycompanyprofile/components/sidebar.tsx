'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Menu } from "lucide-react";
import { AddSectionDialog } from './coustom-section-dialog';
import { SectionTab } from '@/types';
import { useIsOwnerOfCompany } from '@/hooks/check-current-user';

interface SidebarProps {
  sections: SectionTab[];
  activeTab: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ sections, activeTab }) => {
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const { companyId } = useParams();
  const { isOwner, isLoading } = useIsOwnerOfCompany(companyId as string);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const SidebarContent = () => (
    <div className="space-y-2 py-4">
      <Button
        variant={activeTab === '' ? 'default' : 'ghost'}
        className="w-full justify-start"
        asChild
      >
        <Link href={`/profile/companyprofiles/${companyId}`}>
          Info
        </Link>
      </Button>
      <Button
        variant={activeTab === 'tenders' ? 'default' : 'ghost'}
        className="w-full justify-start"
        asChild
      >
        <Link href={`/profile/companyprofiles/${companyId}/tenders`}>
          Tenders
        </Link>
      </Button>
      {!isLoading && isOwner && (
        <Button
          variant={activeTab === 'requests' ? 'default' : 'ghost'}
          className="w-full justify-start"
          asChild
        >
          <Link href={`/profile/companyprofiles/${companyId}/requests`}>
            Requests
          </Link>
        </Button>
      )}
      {sections.map((section) => (
        <Button
          key={section.id}
          variant={activeTab === section.id ? 'default' : 'ghost'}
          className="w-full justify-start"
          asChild
        >
          <Link href={`/profile/companyprofiles/${companyId}/${section.id}`}>
            {section.title}
          </Link>
        </Button>
      ))}
      {!isLoading && isOwner && <AddSectionDialog />}
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