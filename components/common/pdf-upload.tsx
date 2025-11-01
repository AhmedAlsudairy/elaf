import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { FileUp, Trash, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { put } from "@vercel/blob";

interface PDFUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
  bucketName?: string; // not needed anymore but kept for compatibility
  generatedPdfBlob?: Blob | null;
}

const PDFUpload: React.FC<PDFUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value,
  generatedPdfBlob,
}) => {
  const [uploading, setUploading] = useState(false);

  const uploadPDF = useCallback(
    async (file: File | Blob) => {
      try {
        setUploading(true);
        const fileName = `${crypto.randomUUID()}.pdf`;

        // Upload the PDF to Vercel Blob
        const blob = await put(fileName, file, { access: "public" });

        // blob.url is the public file URL
        onChange(blob.url);
      } catch (error) {
        console.error("Error uploading PDF:", error);
        alert("Error uploading PDF!");
      } finally {
        setUploading(false);
      }
    },
    [onChange]
  );

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];
        uploadPDF(file);
      }
    },
    [uploadPDF]
  );

  const handleGeneratedPdfUpload = useCallback(() => {
    if (generatedPdfBlob) {
      uploadPDF(generatedPdfBlob);
    }
  }, [generatedPdfBlob, uploadPDF]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        {value
          .filter((url) => typeof url === "string" && url.trim() !== "")
          .map((url) => (
            <div
              key={url}
              className="flex items-center justify-between p-2 bg-gray-100 rounded"
            >
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline truncate max-w-[70%]"
              >
                {url.split("/").pop() || "Uploaded PDF"}
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
      <div className="flex flex-wrap gap-2">
        <Input
          type="file"
          id="pdfUpload"
          accept="application/pdf"
          onChange={handleFileChange}
          disabled={disabled || uploading}
          style={{ display: "none" }}
        />
        <Button
          type="button"
          disabled={disabled || uploading}
          variant="secondary"
          onClick={() => document.getElementById("pdfUpload")?.click()}
          className="w-full sm:w-auto mb-2 mr-2"
        >
          <FileUp className="h-4 w-4 mr-2" />
          {uploading ? "Uploading..." : "Upload a PDF"}
        </Button>
        {generatedPdfBlob && (
          <Button
            type="button"
            disabled={disabled || uploading}
            variant="secondary"
            onClick={handleGeneratedPdfUpload}
            className="w-full sm:w-auto mb-2"
          >
            <Upload className="h-4 w-4 mr-2" />
            {uploading ? "Uploading..." : "Upload Generated PDF"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default PDFUpload;
