import React, { useState, useCallback } from 'react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PDFViewer, pdf } from '@react-pdf/renderer';
import PDFDocument from '@/components/common/pdf-generate';
import { Trash2, Plus, FileUp, Upload } from 'lucide-react';
import { TenderFormValues } from '@/schema';
import { ELAF_LOGO_PNG_URL } from '@/constant/svg';
import supabaseClient from '@/lib/utils/supabase/supabase-call-client';
import { useTranslations, useLocale } from 'next-intl';
import { getLangDir } from 'rtl-detect';

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
  const t = useTranslations('TenderFormStep2');
  const locale = useLocale();
  const direction = getLangDir(locale);
  const isRTL = direction === 'rtl';

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
      alert(t('uploadError'));
    } finally {
      setUploading(false);
    }
  }, [bucketName, onChange, t]);

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
    <div dir={direction}>
      <div className="mb-4 flex flex-col gap-2">
        {value.filter(url => typeof url === 'string' && url.trim() !== '').map((url) => (
          <div key={url} className="flex items-center justify-between p-2 bg-gray-100 rounded">
            <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline truncate max-w-[70%]">
              {url.split('/').pop() || t('uploadedPDF')}
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
      <div className={`flex flex-col sm:flex-row gap-2 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
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
          className="w-full sm:w-auto"
        >
          <FileUp className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
          {uploading ? t('uploading') : t('uploadPDF')}
        </Button>
        {generatedPdfBlob && (
          <Button
            type="button"
            disabled={disabled || uploading}
            variant="secondary"
            onClick={handleGeneratedPdfUpload}
            className="w-full sm:w-auto"
          >
            <Upload className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {uploading ? t('uploading') : t('uploadGeneratedPDF')}
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
  const t = useTranslations('TenderFormStep2');
  const locale = useLocale();
  const direction = getLangDir(locale);
  const isRTL = direction === 'rtl';

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
        locale={locale}
      />
    ).toBlob();
    setGeneratedPdfBlob(blob);
    setPreviewPDF(true);
  };

  return (
    <div className="space-y-6" dir={direction}>
      <FormField
        control={form.control}
        name="pdf_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('pdfUpload')}</FormLabel>
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
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">{t('contentSections')}</h3>
        {contentSections.map((section, index) => (
          <div key={index} className="border p-4 rounded-md space-y-4">
            <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
              <Input
                placeholder={t('sectionTitlePlaceholder')}
                value={section.title}
                onChange={(e) => handleContentSectionChange(index, 'title', e.target.value)}
                className="w-full sm:w-1/2"
              />
              <div className={`flex items-center gap-2 w-full sm:w-auto ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Select
                  value={section.type}
                  onValueChange={(value: 'paragraph' | 'list') => handleContentSectionChange(index, 'type', value)}
                >
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder={t('selectType')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paragraph">{t('paragraph')}</SelectItem>
                    <SelectItem value="list">{t('list')}</SelectItem>
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
            </div>
            {section.content.map((item, itemIndex) => (
              <div key={itemIndex} className={`flex flex-col sm:flex-row items-start sm:items-center gap-2 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
                {section.type === 'paragraph' ? (
                  <Textarea
                    placeholder={t('enterParagraph')}
                    value={item}
                    onChange={(e) => handleContentItemChange(index, itemIndex, e.target.value)}
                    className="flex-grow"
                  />
                ) : (
                  <Input
                    placeholder={t('enterListItem')}
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
                  className="mt-2 sm:mt-0"
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
              className="w-full sm:w-auto"
            >
              <Plus className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {t(section.type === 'paragraph' ? 'addParagraph' : 'addListItem')}
            </Button>
          </div>
        ))}
        <Button
          type="button"
          onClick={handleAddContentSection}
          className="w-full sm:w-auto"
        >
          {t('addContentSection')}
        </Button>
      </div>

      <div className={`flex flex-col sm:flex-row justify-between gap-4 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
        <Button type="button" onClick={generatePDF} className="w-full sm:w-auto">
          {t('generatePreviewPDF')}
        </Button>
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
                  className="w-full sm:w-auto"
                >
                  {t('downloadUploadedPDF')}
                </Button>
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    
      {previewPDF && generatedPdfBlob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full h-full max-w-4xl max-h-[90vh] overflow-auto flex flex-col">
            <div className="flex-grow">
              <PDFViewer width="100%" height="100%">
                <PDFDocument 
                  data={{
                    ...form.getValues(),
                    tender_id: tenderId || '',
                    content_sections: contentSections
                  }} 
                  companyLogo={companyLogo}
                  elafLogo={ELAF_LOGO_PNG_URL}
                  locale={locale}
                />
              </PDFViewer>
            </div>
            <div className={`mt-4 flex flex-col sm:flex-row justify-between items-center gap-4 p-4 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
              <Button type="button" onClick={() => setPreviewPDF(false)} className="w-full sm:w-auto">
                {t('closePreview')}
              </Button>
              <FormField
                control={form.control}
                name="pdf_url"
                render={({ field }) => (
                  <FormItem className="w-full sm:w-auto">
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