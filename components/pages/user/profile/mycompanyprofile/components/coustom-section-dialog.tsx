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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Section</DialogTitle>
          <DialogDescription>
            Create a new section for your company profile. Add a title, description, and upload a PDF file.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" required />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" required />
          </div>
          <div>
            <Label htmlFor="file">PDF File</Label>
            <PDFUpload
              onChange={(url) => setFileUrl(url)}
              onRemove={() => setFileUrl('')}
              value={fileUrl ? [fileUrl] : []}
              bucketName="profile"
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading || !fileUrl}>
              {isLoading ? 'Adding...' : 'Add Section'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}