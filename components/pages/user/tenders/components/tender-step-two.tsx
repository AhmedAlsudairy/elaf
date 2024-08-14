import React, { useState, useEffect, useCallback } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PDFViewer, pdf } from '@react-pdf/renderer';
import PDFDocument from '@/components/common/pdf-generate';
import { Trash2, Plus, FileUp, Upload } from 'lucide-react';
import { TenderFormValues } from '@/schema';
import { ELAF_LOGO_PNG_URL } from '@/constant/svg';
import supabaseClient from '@/lib/utils/supabase/supabase-call-client';

type TenderFormStep2Props = {
  form: UseFormReturn<TenderFormValues>;
  companyLogo: string;
  tenderId: string | null;
};

type ContentSection = {
  type: 'paragraph' | 'list';
  title: string;
  content: string[];
};

const PDFUpload: React.FC<{
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
  bucketName: string;
  generatedPdfBlob?: Blob | null;
}> = ({
  disabled,
  onChange,
  onRemove,
  value,
  bucketName,
  generatedPdfBlob,
}) => {
  const [uploading, setUploading] = useState(false);

  const uploadPDF = useCallback(async (file: File | Blob) => {
    try {
      setUploading(true);

      const fileName = `${Math.random()}.pdf`;
      const filePath = `${fileName}`;

      let { error: uploadError } = await supabaseClient.storage
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

  const handleGeneratedPdfUpload = useCallback(() => {
    if (generatedPdfBlob) {
      uploadPDF(generatedPdfBlob);
    }
  }, [generatedPdfBlob, uploadPDF]);

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
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
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
        {generatedPdfBlob && (
          <Button
            type="button"
            disabled={disabled || uploading}
            variant="secondary"
            onClick={handleGeneratedPdfUpload}
          >
            <Upload className="h-4 w-4 mr-2" />
            {uploading ? 'Uploading...' : 'Upload Generated PDF'}
          </Button>
        )}
      </div>
    </div>
  );
};

export function TenderFormStep2({ form, companyLogo, tenderId }: TenderFormStep2Props) {
  const [contentSections, setContentSections] = useState<ContentSection[]>([]);
  const [previewPDF, setPreviewPDF] = useState(false);
  const [generatedPdfBlob, setGeneratedPdfBlob] = useState<Blob | null>(null);

  useEffect(() => {
    const fields = form.getValues('custom_fields');
    if (fields && fields.length === 0) {
      form.setValue('custom_fields', [{ title: '', description: '' }]);
    }
  }, [form]);

  const handleAddContentSection = () => {
    const newSection: ContentSection = { type: 'paragraph', title: '', content: [''] };
    setContentSections([...contentSections, newSection]);
  };

  const handleRemoveContentSection = (index: number) => {
    const newSections = contentSections.filter((_, i) => i !== index);
    setContentSections(newSections);
  };

  const handleContentSectionChange = (index: number, field: keyof ContentSection, value: any) => {
    const newSections = [...contentSections];
    if (field === 'type' && value !== newSections[index].type) {
      newSections[index].content = [''];
    }
    newSections[index][field] = value;
    setContentSections(newSections);
  };

  const handleContentItemChange = (sectionIndex: number, itemIndex: number, value: string) => {
    const newSections = [...contentSections];
    newSections[sectionIndex].content[itemIndex] = value;
    setContentSections(newSections);
  };

  const handleAddContentItem = (sectionIndex: number) => {
    const newSections = [...contentSections];
    newSections[sectionIndex].content.push('');
    setContentSections(newSections);
  };

  const handleRemoveContentItem = (sectionIndex: number, itemIndex: number) => {
    const newSections = [...contentSections];
    newSections[sectionIndex].content = newSections[sectionIndex].content.filter((_, i) => i !== itemIndex);
    setContentSections(newSections);
  };

  const generatePDF = async () => {
    const blob = await pdf(
      <PDFDocument 
        data={{
          ...form.getValues(),
          tender_id: tenderId || '',
          content_sections: contentSections
        }} 
        companyLogo={companyLogo}
        elafLogo={ELAF_LOGO_PNG_URL}
      />
    ).toBlob();
    setGeneratedPdfBlob(blob);
    setPreviewPDF(true);
  };

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="pdf_choice"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Choose PDF Option</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-1"
              >
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="upload" />
                  </FormControl>
                  <FormLabel className="font-normal">
                    Upload your own PDF
                  </FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="generate" />
                  </FormControl>
                  <FormLabel className="font-normal">
                    Generate PDF with tender information
                  </FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {form.watch('pdf_choice') === 'upload' && (
        <FormField
          control={form.control}
          name="pdf_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>PDF Upload</FormLabel>
              <FormControl>
                <PDFUpload
                  disabled={false}
                  onChange={(url) => field.onChange(url)}
                  onRemove={() => field.onChange("")}
                  value={field.value ? [field.value] : []}
                  bucketName="profile"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {form.watch('pdf_choice') === 'generate' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Content Sections</h3>
          {contentSections.map((section, index) => (
            <div key={index} className="border p-4 rounded-md space-y-2">
              <div className="flex items-center justify-between">
                <Input
                  placeholder="Section Title"
                  value={section.title}
                  onChange={(e) => handleContentSectionChange(index, 'title', e.target.value)}
                  className="w-1/2"
                />
                <Select
                  value={section.type}
                  onValueChange={(value: 'paragraph' | 'list') => handleContentSectionChange(index, 'type', value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paragraph">Paragraph</SelectItem>
                    <SelectItem value="list">List</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => handleRemoveContentSection(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              {section.content.map((item, itemIndex) => (
                <div key={itemIndex} className="flex items-center gap-2">
                  {section.type === 'paragraph' ? (
                    <Textarea
                      placeholder="Enter paragraph text"
                      value={item}
                      onChange={(e) => handleContentItemChange(index, itemIndex, e.target.value)}
                      className="flex-grow"
                    />
                  ) : (
                    <Input
                      placeholder="Enter list item"
                      value={item}
                      onChange={(e) => handleContentItemChange(index, itemIndex, e.target.value)}
                      className="flex-grow"
                    />
                  )}
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => handleRemoveContentItem(index, itemIndex)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleAddContentItem(index)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add {section.type === 'paragraph' ? 'Paragraph' : 'List Item'}
              </Button>
            </div>
          ))}
          <Button
            type="button"
            onClick={handleAddContentSection}
          >
            Add Content Section
          </Button>

          <h3 className="text-lg font-semibold">Custom Fields</h3>
          {form.watch('custom_fields').map((field, index) => (
            <div key={index} className="grid grid-cols-2 gap-4 items-center">
              <Input
                placeholder="Field Title"
                value={field.title}
                onChange={(e) => {
                  const newFields = [...form.getValues('custom_fields')];
                  newFields[index].title = e.target.value;
                  form.setValue('custom_fields', newFields);
                }}
              />
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Field Description"
                  value={field.description}
                  onChange={(e) => {
                    const newFields = [...form.getValues('custom_fields')];
                    newFields[index].description = e.target.value;
                    form.setValue('custom_fields', newFields);
                  }}
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => {
                    const newFields = form.getValues('custom_fields').filter((_, i) => i !== index);
                    form.setValue('custom_fields', newFields);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          <Button
            type="button"
            onClick={() => {
              const currentFields = form.getValues('custom_fields');
              form.setValue('custom_fields', [...currentFields, { title: '', description: '' }]);
            }}
          >
            Add Custom Field
          </Button>
        </div>
      )}

      <div className="flex justify-between">
        <Button type="button" onClick={generatePDF}>
          Generate and Preview PDF
        </Button>
        {form.watch('pdf_choice') === 'upload' && (
          <FormField
            control={form.control}
            name="pdf_url"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Button
                    type="button"
                    onClick={() => {
                      if (field.value) {
                        window.open(field.value, '_blank');
                      }
                    }}
                    disabled={!field.value}
                  >
                    Download Uploaded PDF
                  </Button>
                </FormControl>
              </FormItem>
            )}
          />)}
          </div>
    
          {previewPDF && generatedPdfBlob && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-4 rounded-lg w-full h-full max-w-4xl max-h-[90vh] overflow-auto">
                <PDFViewer width="100%" height="600px">
                  <PDFDocument 
                    data={{
                      ...form.getValues(),
                      tender_id: tenderId || '',
                      content_sections: contentSections
                    }} 
                    companyLogo={companyLogo}
                    elafLogo={ELAF_LOGO_PNG_URL}
                  />
                </PDFViewer>
                <div className="mt-4 flex justify-between">
                  <Button type="button" onClick={() => setPreviewPDF(false)}>
                    Close Preview
                  </Button>
                  <FormField
                    control={form.control}
                    name="pdf_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <PDFUpload
                            disabled={false}
                            onChange={(url) => field.onChange(url)}
                            onRemove={() => field.onChange("")}
                            value={field.value ? [field.value] : []}
                            bucketName="profile"
                            generatedPdfBlob={generatedPdfBlob}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }
    
    export default TenderFormStep2;