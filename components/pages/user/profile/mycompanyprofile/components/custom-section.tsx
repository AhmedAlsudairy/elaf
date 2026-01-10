import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PDFUpload from '@/components/common/pdf-upload';
import type {  CustomSection, CustomSectionProps } from '@/types';
import { FileText, Link } from "lucide-react";
import { Section } from '@/actions/neon/section/get-sections';

export function CustomSection({ section, onUpdate, isEditing }: CustomSectionProps) {
  const handleChange = (field: keyof CustomSection, value: string) => {
    onUpdate({ ...section, [field]: value });
  };

  if (isEditing) {
    return (
      <Card className="space-y-4 p-4">
        <CardHeader>
          <CardTitle>Edit Section</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor={`title-${section.id}`}>Title</Label>
              <Input
                id={`title-${section.id}`}
                value={section.title}
                onChange={(e) => handleChange('title', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor={`description-${section.id}`}>Description</Label>
              <Textarea
                id={`description-${section.id}`}
                value={section.description}
                onChange={(e) => handleChange('description', e.target.value)}
              />
            </div>
            <div>
              <Label>PDF File</Label>
              <PDFUpload
                onChange={(url) => handleChange('fileUrl', url)}
                onRemove={() => handleChange('fileUrl', '')}
                value={section.fileUrl ? [section.fileUrl] : []}
                bucketName="profile"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-primary text-primary-foreground">
        <CardTitle>{section.title}</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="prose max-w-none">
          <p>{section.description}</p>
        </div>
        {section.fileUrl && (
          <div className="mt-4">
            <a 
              href={section.fileUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center text-primary hover:underline"
            >
              <FileText className="mr-2 h-4 w-4" />
              View PDF
              <Link className="ml-1 h-4 w-4" />
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
}