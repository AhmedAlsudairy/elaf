'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import PDFUpload from '@/components/common/pdf-upload';
import { Plus } from "lucide-react";
import { addSection } from '@/actions/supabase/add-section';

export function AddSectionDialog() {
  const [isLoading, setIsLoading] = useState(false);
  const [fileUrl, setFileUrl] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    formData.append('fileUrl', fileUrl);

    try {
      await addSection(formData);
      setIsOpen(false);
      router.refresh();
    } catch (error) {
      console.error('Failed to add section:', error);
      // Handle error (e.g., show error message to user)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          <Plus className="mr-2 h-4 w-4" /> Add Section
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Add New Section</DialogTitle>
          <DialogDescription className="text-base">
            Create a new section for your company profile. Add a title, description, and upload a PDF file.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-base">Title</Label>
            <Input id="title" name="title" required className="h-12 text-base" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="text-base">Description</Label>
            <Textarea id="description" name="description" required className="min-h-[100px] text-base" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="file" className="text-base">PDF File</Label>
            <PDFUpload
              onChange={(url) => setFileUrl(url)}
              onRemove={() => setFileUrl('')}
              value={fileUrl ? [fileUrl] : []}
              bucketName="profile"
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading || !fileUrl} className="w-full h-12 text-base">
              {isLoading ? 'Adding...' : 'Add Section'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}