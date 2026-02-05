"use client";

import { useState } from "react";
import { X, Image as ImageIcon, Video, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  company: {
    companyTitle: string;
    profileImage?: string;
  };
}

export default function CreatePostModal({
  isOpen,
  onClose,
  company,
}: CreatePostModalProps) {
  const [postType, setPostType] = useState<"POST" | "NEWS">("POST");
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaPreview, setMediaPreview] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleMediaSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Validate file sizes (max 10MB per file)
    const validFiles = files.filter(file => {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds 10MB limit`,
          variant: "destructive",
        });
        return false;
      }
      return true;
    });

    // Limit to 10 files
    if (mediaFiles.length + validFiles.length > 10) {
      toast({
        title: "Too many files",
        description: "Maximum 10 media files allowed",
        variant: "destructive",
      });
      return;
    }

    setMediaFiles(prev => [...prev, ...validFiles]);

    // Create preview URLs
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeMedia = (index: number) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
    setMediaPreview(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast({
        title: "Content required",
        description: "Please write something before posting",
        variant: "destructive",
      });
      return;
    }

    if (postType === "NEWS" && !title.trim()) {
      toast({
        title: "Title required",
        description: "News posts require a title",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Step 1: Upload media files to Vercel Blob
      const mediaUrls: string[] = [];
      
      for (const file of mediaFiles) {
        const formData = new FormData();
        formData.append("file", file);

        const uploadRes = await fetch("/api/socialMedia/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) throw new Error("Media upload failed");
        
        const { url } = await uploadRes.json();
        mediaUrls.push(url);
      }

      const postData = {
        content,
        postType,
        mediaUrls,
        ...(postType === "NEWS" && {
          title,
          summary,
          featuredImage: mediaUrls[0], // First image as featured
        }),
      };

      const res = await fetch("/api/socialMedia/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });

      if (!res.ok) throw new Error("Failed to create post");

      toast({
        title: "Post created!",
        description: "Your post has been published successfully",
      });

      // Reset form
      setContent("");
      setTitle("");
      setSummary("");
      setMediaFiles([]);
      setMediaPreview([]);
      setPostType("POST");
      onClose();

      // Refresh feed (you'll add this later)
      window.location.reload();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Post</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Company Info */}
          <div className="flex items-center space-x-3 pb-4 border-b">
            <Avatar className="h-12 w-12">
              <AvatarImage src={company.profileImage} alt={company.companyTitle} />
              <AvatarFallback>{company.companyTitle[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{company.companyTitle}</p>
              <p className="text-sm text-gray-500">Posting as company</p>
            </div>
          </div>

          {/* Post Type Selection */}
          <div>
            <Label>Post Type</Label>
            <RadioGroup
              value={postType}
              onValueChange={(value) => setPostType(value as "POST" | "NEWS")}
              className="flex space-x-4 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="POST" id="post" />
                <Label htmlFor="post" className="cursor-pointer">Regular Post</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="NEWS" id="news" />
                <Label htmlFor="news" className="cursor-pointer">News Article</Label>
              </div>
            </RadioGroup>
          </div>

          {/* News Title (only for NEWS) */}
          {postType === "NEWS" && (
            <>
              <div>
                <Label htmlFor="title">News Title *</Label>
                <Input
                  id="title"
                  placeholder="Enter news headline..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={200}
                />
              </div>

              <div>
                <Label htmlFor="summary">Summary</Label>
                <Input
                  id="summary"
                  placeholder="Brief summary (optional)"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  maxLength={300}
                />
              </div>
            </>
          )}

          {/* Content */}
          <div>
            <Label htmlFor="content">
              {postType === "NEWS" ? "Full Article *" : "What's on your mind? *"}
            </Label>
            <Textarea
              id="content"
              placeholder={
                postType === "NEWS"
                  ? "Write your full news article..."
                  : "Share your thoughts, updates, or announcements..."
              }
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              maxLength={5000}
            />
            <p className="text-xs text-gray-500 mt-1">
              {content.length} / 5000 characters
            </p>
          </div>

          {/* Media Preview */}
          {mediaPreview.length > 0 && (
            <div className="grid grid-cols-4 gap-2">
              {mediaPreview.map((preview, index) => (
                <div key={index} className="relative group">
                  {mediaFiles[index].type.startsWith("video/") ? (
                    <video
                      src={preview}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                  ) : (
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                  )}
                  <button
                    onClick={() => removeMedia(index)}
                    className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Media Upload Buttons */}
          <div className="flex space-x-2">
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleMediaSelect}
                className="hidden"
              />
              <Button type="button" variant="outline" size="sm" asChild>
                <span>
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Add Images
                </span>
              </Button>
            </label>

            <label className="cursor-pointer">
              <input
                type="file"
                accept="video/*"
                multiple
                onChange={handleMediaSelect}
                className="hidden"
              />
              <Button type="button" variant="outline" size="sm" asChild>
                <span>
                  <Video className="h-4 w-4 mr-2" />
                  Add Videos
                </span>
              </Button>
            </label>
          </div>

          {/* Submit */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Posting..." : "Post"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}