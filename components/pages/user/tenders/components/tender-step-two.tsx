'use client'
import React, { useState, useEffect } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { Button } from "@/components/ui/button"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PDFViewer } from '@react-pdf/renderer'
import PDFUpload from '@/components/common/pdf-upload'
import PDFDocument from '@/components/common/pdf-generate'
import { Trash2, Plus } from 'lucide-react'
import { TenderFormValues } from '@/schema'
import { ELAF_LOGO_PNG_URL } from '@/constant/svg'

type TenderFormStep2Props = {
  form: UseFormReturn<TenderFormValues>
  companyLogo: string
  tenderId: string | null
}

type ContentSection = {
  type: 'paragraph' | 'list';
  title: string;
  content: string[];
}

export function TenderFormStep2({ form, companyLogo, tenderId }: TenderFormStep2Props) {
  const [contentSections, setContentSections] = useState<ContentSection[]>([]);
  const [previewPDF, setPreviewPDF] = useState(false);

  useEffect(() => {
    const fields = form.getValues('custom_fields');
    if (fields && fields.length === 0) {
      form.setValue('custom_fields', [{ title: '', description: '' }]);
    }
    // Note: We're not setting content_sections from form values as it's not part of the form schema
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
                  bucketName="your-bucket-name"  // Replace with your actual bucket name
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
        <Button type="button" onClick={() => setPreviewPDF(true)}>
          Preview PDF
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
          />
        )}
      </div>

      {previewPDF && (
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
              <Button 
                type="button" 
                onClick={() => {
                  // Logic to download the generated PDF
                  console.log("Download PDF functionality to be implemented");
                }}
              >
                Download PDF
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}