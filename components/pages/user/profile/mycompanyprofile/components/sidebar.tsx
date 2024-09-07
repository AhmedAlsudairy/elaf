"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { AddSectionDialog } from "./coustom-section-dialog";
import { SectionTab } from "@/types";
import { useIsOwnerOfCompany } from "@/hooks/check-current-user";

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
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const SidebarContent = ({ isMobileView }: { isMobileView: boolean }) => (
    <>
      <Button
        variant={activeTab === "" ? "default" : "ghost"}
        className={isMobileView ? "whitespace-nowrap" : "w-full justify-start"}
        asChild
      >
        <Link href={`/profile/companyprofiles/${companyId}`}>Info</Link>
      </Button>
      <Button
        variant={activeTab === "tenders" ? "default" : "ghost"}
        className={isMobileView ? "whitespace-nowrap" : "w-full justify-start"}
        asChild
      >
        <Link href={`/profile/companyprofiles/${companyId}/tenders`}>
          Tenders
        </Link>
      </Button>

      <Button
        variant={activeTab === "rate" ? "default" : "ghost"}
        className={isMobileView ? "whitespace-nowrap" : "w-full justify-start"}
        asChild
      >
        <Link href={`/profile/companyprofiles/${companyId}/rate`}>Rate</Link>
      </Button>
      {!isLoading && isOwner && (
        <Button
          variant={activeTab === "requests" ? "default" : "ghost"}
          className={isMobileView ? "whitespace-nowrap" : "w-full justify-start"}
          asChild
        >
          <Link href={`/profile/companyprofiles/${companyId}/requests`}>
            My Tenders
          </Link>
        </Button>
      )}
      {sections.map((section) => (
        <Button
          key={section.id}
          variant={activeTab === section.id ? "default" : "ghost"}
          className={isMobileView ? "whitespace-nowrap" : "w-full justify-start"}
          asChild
        >
          <Link href={`/profile/companyprofiles/${companyId}/${section.id}`}>
            {section.title}
          </Link>
        </Button>
      ))}
      {!isLoading && isOwner && <AddSectionDialog />}
    </>
  );

  if (isMobile) {
    return (
      <div className="sticky top-14 z-30 bg-background border-b">
        <ScrollArea className="w-full h-14">
          <div className="flex p-2 gap-2">
            <SidebarContent isMobileView={true} />
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    );
  }

  return (
    <div className="w-64 mr-4 h-fit">
      <div className="space-y-2 py-4">
        <SidebarContent isMobileView={false} />
      </div>
    </div>
  );
};