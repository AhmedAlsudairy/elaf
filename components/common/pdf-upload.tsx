import React, { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { FileUp, Trash } from "lucide-react";
import supabaseClient from '@/lib/utils/supabase/supabase-call-client';
import { Input } from '@/components/ui/input';

interface PDFUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
  bucketName: string;
}

const PDFUpload: React.FC<PDFUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value,
  bucketName,
}) => {
  const [uploading, setUploading] = useState(false);

  const uploadPDF = useCallback(async (file: File) => {
    try {
      setUploading(true);

      const fileName = `${Math.random()}.pdf`;
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
      console.error('Error uploading PDF:', error);
      alert('Error uploading PDF!');
    } finally {
      setUploading(false);
    }
  }, [bucketName, onChange]);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      uploadPDF(file);
    }
  }, [uploadPDF]);

  return (
    <div>
      <div className="mb-4 flex flex-col gap-2">
        {value.filter(url => typeof url === 'string' && url.trim() !== '').map((url) => (
          <div key={url} className="flex items-center justify-between p-2 bg-gray-100 rounded">
            <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              {url.split('/').pop() || 'Uploaded PDF'}
            </a>
            <Button
              type="button"
              onClick={() => onRemove(url)}
              size="icon"
              variant="destructive"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      <div>
        <Input
          type="file"
          id="pdfUpload"
          accept="application/pdf"
          onChange={handleFileChange}
          disabled={disabled || uploading}
          style={{ display: 'none' }}
        />
        <Button
          type="button"
          disabled={disabled || uploading}
          variant="secondary"
          onClick={() => document.getElementById('pdfUpload')?.click()}
        >
          <FileUp className="h-4 w-4 mr-2" />
          {uploading ? 'Uploading...' : 'Upload a PDF'}
        </Button>
      </div>
    </div>
  );
};

export default PDFUpload;