'use client'

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Menu } from "lucide-react";
import { AddSectionDialog } from './coustom-section-dialog';
import { SidebarProps } from '@/types';


export function Sidebar({ sections, onTabChange }: SidebarProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
    onTabChange(tabName);
  };

  const SidebarContent = () => (
    <div className="space-y-2 py-4">
      <Button
        variant={activeTab === 'info' ? 'default' : 'ghost'}
        className="w-full justify-start"
        onClick={() => handleTabClick('info')}
      >
        Info
      </Button>
      <Button
        variant={activeTab === 'tenders' ? 'default' : 'ghost'}
        className="w-full justify-start"
        onClick={() => handleTabClick('tenders')}
      >
        Tenders
      </Button>
      <Button
        variant={activeTab === 'requests' ? 'default' : 'ghost'}
        className="w-full justify-start"
        onClick={() => handleTabClick('requests')}
      >
        Requests
      </Button>
      {sections.map((section) => (
        <Button
          key={section.id}
          variant={activeTab === section.tab_name ? 'default' : 'ghost'}
          className="w-full justify-start"
          onClick={() => handleTabClick(section.tab_name)}
        >
          {section.title}
        </Button>
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
}
