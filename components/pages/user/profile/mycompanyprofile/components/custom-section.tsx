// components/pages/user/profile/mycompanyprofile/components/custom-section.tsx
import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import PDFUpload from '@/components/common/pdf-upload';
import  type { CustomSection, CustomSectionProps } from '@/types';


export function CustomSection({ section, onUpdate, onRemove, isEditing }: CustomSectionProps) {
  const handleChange = (field: keyof CustomSection, value: string) => {
    onUpdate({ ...section, [field]: value });
  };

  return (
    <div className="space-y-4 p-4 border rounded">
      <div>
        <Label htmlFor={`title-${section.id}`}>Title</Label>
        <Input
          id={`title-${section.id}`}
          value={section.title}
          onChange={(e) => handleChange('title', e.target.value)}
          disabled={!isEditing}
        />
      </div>
      <div>
        <Label htmlFor={`description-${section.id}`}>Description</Label>
        <Textarea
          id={`description-${section.id}`}
          value={section.description}
          onChange={(e) => handleChange('description', e.target.value)}
          disabled={!isEditing}
        />
      </div>
      <div>
        <Label>PDF File</Label>
        <PDFUpload
          onChange={(url) => handleChange('pdfUrl', url)}
          onRemove={() => handleChange('pdfUrl', '')}
          value={section.pdfUrl ? [section.pdfUrl] : []}
          bucketName="custom-sections"
          disabled={!isEditing}
        />
      </div>
      {isEditing && (
        <Button variant="destructive" onClick={() => onRemove(section.id)}>
          <Trash className="h-4 w-4 mr-2" /> Remove Section
        </Button>
      )}
    </div>
  );
}