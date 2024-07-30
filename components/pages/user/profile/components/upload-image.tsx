import React, { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { ImagePlus, Trash } from "lucide-react";
import Image from "next/image";
import supabaseClient from '@/lib/utils/supabase/supabase-call-client';
import { Input } from '@/components/ui/input';

// Initialize Supabase client

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
  bucketName: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value,
  bucketName,
}) => {
  const [uploading, setUploading] = useState(false);

  const uploadImage = useCallback(async (file: File) => {
    try {
      setUploading(true);

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      let { error: uploadError, data } = await supabaseClient.storage
        .from(bucketName)
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabaseClient.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      onChange(publicUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image!');
    } finally {
      setUploading(false);
    }
  }, [bucketName, onChange]);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      uploadImage(file);
    }
  }, [uploadImage]);

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
                onClick={() => onRemove(url)}
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
          <ImagePlus className="h-4 w-4 mr-2" />
          {uploading ? 'Uploading...' : 'Upload an Image'}
        </Button>
      </div>
    </div>
  );
};

export default ImageUpload;