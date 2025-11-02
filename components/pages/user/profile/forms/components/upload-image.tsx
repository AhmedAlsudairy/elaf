'use client';

import React, { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { ImagePlus, Trash, Loader2 } from "lucide-react";
import Image from "next/image";
import { Input } from '@/components/ui/input';
import { uploadImage, deleteImage } from '@/actions/supabase/upload-image';

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
  bucketName?: string; // Keep for compatibility but not used with Vercel Blob
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value,
}) => {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      
      try {
        setUploading(true);
        
        const formData = new FormData();
        formData.append('file', file);
        
        const result = await uploadImage(formData);
        onChange(result.url);
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Error uploading image!');
      } finally {
        setUploading(false);
      }
    }
  }, [onChange]);

  const handleRemove = useCallback(async (url: string) => {
    try {
      await deleteImage(url);
      onRemove(url);
    } catch (error) {
      console.error('Error deleting image:', error);
      // Still remove from UI even if delete fails
      onRemove(url);
    }
  }, [onRemove]);

  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        {value.map((url) => (
          <div
            key={url}
            className="relative w-[200px] h-[200px] rounded-md overflow-hidden"
          >
            <div className="z-10 absolute top-2 right-2">
              <Button
                type="button"
                onClick={() => handleRemove(url)}
                size="icon"
                variant="destructive"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            <Image className="object-cover" fill alt="Image" src={url} />
          </div>
        ))}
      </div>
      <div>
        <Input
          type="file"
          id="imageUpload"
          accept="image/*"
          onChange={handleFileChange}
          disabled={disabled || uploading}
          style={{ display: 'none' }}
        />
        <Button
          type="button"
          disabled={disabled || uploading}
          variant="secondary"
          onClick={() => document.getElementById('imageUpload')?.click()}
        >
          {uploading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <ImagePlus className="h-4 w-4 mr-2" />
              Upload an Image
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ImageUpload;