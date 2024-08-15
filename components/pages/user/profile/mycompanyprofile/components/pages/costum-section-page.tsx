'use client'
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { CompanyProfile, CustomSection as CustomSectionType } from '@/types';
import { useIsOwnerOfCompany } from '@/hooks/check-current-user';
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { getCompanyProfileById } from '@/actions/supabase/gett-company-profile-by-id';
import { getSectionById } from '@/actions/supabase/get-section-by-id';
import { updateSection } from '@/actions/supabase/update-section';
import { deleteSection } from '@/actions/supabase/delete-section';
import { ProfileHeader } from '../profile-header';
import { CustomSection } from '../custom-section';
import { Skeleton } from "@/components/ui/skeleton";

export function CustomSectionPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const companyId = params.companyId as string;
  const sectionId = params.sectionId as string;

  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [section, setSection] = useState<CustomSectionType | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const { isOwner } = useIsOwnerOfCompany(companyId);

  useEffect(() => {
    async function fetchData() {
      try {
        const [profileData, sectionData] = await Promise.all([
          getCompanyProfileById(companyId),
          getSectionById(sectionId)
        ]);
        setProfile(profileData);
        setSection(sectionData as CustomSectionType);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: "Failed to load data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [companyId, sectionId, toast]);

  const handleUpdate = (updatedSection: CustomSectionType) => {
    setSection(updatedSection);
  };

  const handleSave = async () => {
    if (!section) return;
    setIsSaving(true);
    try {
      await updateSection(section);
      setIsEditing(false);
      toast({
        title: "Section Updated",
        description: "Your changes have been saved successfully.",
        variant: "default",
      });
    } catch (error) {
      console.error('Failed to save changes:', error);
      toast({
        title: "Error",
        description: "Failed to save changes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!section || !section.id) return;
    setIsSaving(true);
    try {
      await deleteSection(section.id);
      toast({
        title: "Section Deleted",
        description: "The section has been deleted successfully.",
        variant: "default",
      });
      router.push(`/profile/companyprofile/${companyId}`);
    } catch (error) {
      console.error('Failed to delete section:', error);
      toast({
        title: "Error",
        description: "Failed to delete section. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-full" />
        <div className="flex justify-end space-x-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!profile || !section) {
    return <div>Failed to load data. Please try again.</div>;
  }

  return (
    <div className="space-y-6">
      <ProfileHeader
        profile={profile}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        onSave={handleSave}
        isLoading={isSaving}
      />
      {isOwner && (
        <div className="flex justify-end space-x-2">
          <Button 
            variant="outline" 
            onClick={() => setIsEditing(!isEditing)}
            disabled={isSaving}
          >
            {isEditing ? <Eye className="mr-2 h-4 w-4" /> : <Edit className="mr-2 h-4 w-4" />}
            {isEditing ? "Preview" : "Edit"}
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={isSaving}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      )}
      <CustomSection
        section={section}
        onUpdate={handleUpdate}
        onRemove={handleDelete}
        isEditing={isEditing && isOwner}
      />
    </div>
  );
}