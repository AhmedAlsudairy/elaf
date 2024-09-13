"use client";

import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PDFViewer, pdf } from "@react-pdf/renderer";
import PDFDocument from "@/components/common/pdf-generate";
import { ELAF_LOGO_PNG_URL } from "@/constant/svg";
import { Trash2, Plus } from "lucide-react";
import PDFUpload from "@/components/common/pdf-upload";
import { useLocale } from "next-intl";
import { getLangDir } from "rtl-detect";

export const tenderRequestSchema = z.object({
  title: z.string().min(1, "Title is required"),
  bid_price: z.number().nonnegative("Bid price must be non-negative"),
  currency: z.enum(["OMR", "EGP", "SAR", "AED"]), // Keep this as an enum

  summary: z.string().min(1, "Summary is required"),
  pdf_url: z.string().url("Invalid URL").optional(),
});

export type TenderRequestFormValues = z.infer<typeof tenderRequestSchema>;

type ContentSection = {
  type: "paragraph" | "list";
  title: string;
  content: string[];
};

interface TenderRequestFormProps {
  onSubmit: (data: TenderRequestFormValues, pdfBlob?: Blob) => Promise<void>;
  tenderId: string;
  companyProfile: {
    company_profile_id: string;
    company_title: string;
    profile_image: string;
  };
  tenderTitle: string;
  tenderCurrency: z.infer<typeof tenderRequestSchema>['currency'];
}

export function TenderRequestForm({
  onSubmit,
  tenderId,
  companyProfile,
  tenderTitle,
  tenderCurrency,
}: TenderRequestFormProps) {
  const [contentSections, setContentSections] = useState<ContentSection[]>([]);
  const [previewPDF, setPreviewPDF] = useState(false);
  const [generatedPdfBlob, setGeneratedPdfBlob] = useState<Blob | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const locale = useLocale();
  const direction = getLangDir(locale);
  console.log(locale)
  const isRTL = direction === 'rtl';

  const methods = useForm<TenderRequestFormValues>({
    resolver: zodResolver(tenderRequestSchema),
    defaultValues: {
      title: "",
      bid_price: 0,
      currency: tenderCurrency,
      summary: "",
      pdf_url: "",
    },
  });

  const handleSubmit = async (values: TenderRequestFormValues) => {
    setIsLoading(true);
    try {
      await onSubmit(values, generatedPdfBlob || undefined);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
    }
  };

   console.log(locale)

  const generatePDF = async () => {
    setIsLoading(true);
    try {
      const blob = await pdf(
        <PDFDocument
          data={{
            ...methods.getValues(),
            tender_id: tenderId,
            content_sections: contentSections,
            company_name: companyProfile.company_title,
            is_tender_request: true,
            custom_fields: [],
            end_date: new Date(),
            terms: "",
            scope_of_works: "",
          }}
          companyLogo={companyProfile.profile_image}
          elafLogo={ELAF_LOGO_PNG_URL}
          locale={ locale }

        />
      ).toBlob();
      setGeneratedPdfBlob(blob);
      setPreviewPDF(true);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddContentSection = () => {
    setContentSections([
      ...contentSections,
      { type: "paragraph", title: "", content: [""] },
    ]);
  };

  const handleRemoveContentSection = (index: number) => {
    setContentSections(contentSections.filter((_, i) => i !== index));
  };

  const handleContentSectionChange = (
    index: number,
    field: keyof ContentSection,
    value: any
  ) => {
    const newSections = [...contentSections];
    if (field === "type" && value !== newSections[index].type) {
      newSections[index].content = [""];
    }
    newSections[index][field] = value;
    setContentSections(newSections);
  };

  const handleContentItemChange = (
    sectionIndex: number,
    itemIndex: number,
    value: string
  ) => {
    const newSections = [...contentSections];
    newSections[sectionIndex].content[itemIndex] = value;
    setContentSections(newSections);
  };

  const handleAddContentItem = (sectionIndex: number) => {
    const newSections = [...contentSections];
    newSections[sectionIndex].content.push("");
    setContentSections(newSections);
  };

  const handleRemoveContentItem = (sectionIndex: number, itemIndex: number) => {
    const newSections = [...contentSections];
    newSections[sectionIndex].content = newSections[
      sectionIndex
    ].content.filter((_, i) => i !== itemIndex);
    setContentSections(newSections);
  };

  return (
    <FormProvider {...methods}>
      <div className="h-full flex flex-col">
        <Form {...methods}>
          <form
            onSubmit={methods.handleSubmit(handleSubmit)}
            className="flex flex-col h-full"
          >
            <div className="flex-grow overflow-y-auto px-4 py-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={methods.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="w-full"
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={methods.control}
                  name="bid_price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bid Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(
                              value === "" ? 0 : parseFloat(value)
                            );
                          }}
                          className="w-full"
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={methods.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={true}
                          value={tenderCurrency}
                          className="w-full bg-gray-100"
                        />
                      </FormControl>
                      <FormMessage />
                      <p className="text-sm text-muted-foreground mt-1">
                        The currency is automatically set to match the tender&aposs currency.
                      </p>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={methods.control}
                name="summary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Summary</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        className="w-full"
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  Custom Content Sections
                </h3>
                {contentSections.map((section, index) => (
                  <div key={index} className="border p-4 rounded-md space-y-2">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <Input
                        placeholder="Section Title"
                        value={section.title}
                        onChange={(e) =>
                          handleContentSectionChange(
                            index,
                            "title",
                            e.target.value
                          )
                        }
                        className="w-full sm:w-1/2"
                        disabled={isLoading}
                      />
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <select
                          value={section.type}
                          onChange={(e) =>
                            handleContentSectionChange(index, "type", e.target.value as "paragraph" | "list")
                          }
                          disabled={isLoading}
                          className="w-full sm:w-[180px] border rounded p-2"
                        >
                          <option value="paragraph">Paragraph</option>
                          <option value="list">List</option>
                        </select>
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => handleRemoveContentSection(index)}
                          disabled={isLoading}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    {section.content.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center gap-2">
                        {section.type === "paragraph" ? (
                          <Textarea
                            placeholder="Enter paragraph text"
                            value={item}
                            onChange={(e) =>
                              handleContentItemChange(
                                index,
                                itemIndex,
                                e.target.value
                              )
                            }
                            className="flex-grow"
                            disabled={isLoading}
                          />
                        ) : (
                          <Input
                            placeholder="Enter list item"
                            value={item}
                            onChange={(e) =>
                              handleContentItemChange(
                                index,
                                itemIndex,
                                e.target.value
                              )
                            }
                            className="flex-grow"
                            disabled={isLoading}
                          />
                        )}
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() =>
                            handleRemoveContentItem(index, itemIndex)
                          }
                          disabled={isLoading}
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
                      disabled={isLoading}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add{" "}
                      {section.type === "paragraph" ? "Paragraph" : "List Item"}
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  onClick={handleAddContentSection}
                  className="w-full sm:w-auto"
                  disabled={isLoading}
                >
                  Add Content Section
                </Button>
              </div>

              <div className="space-y-4">
                <FormField
                  control={methods.control}
                  name="pdf_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>PDF Upload</FormLabel>
                      <FormControl>
                        <PDFUpload
                          disabled={isLoading}
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

                <Button
                  type="button"
                  onClick={generatePDF}
                  className="w-full sm:w-auto"
                  disabled={isLoading}
                >
                  {isLoading ? "Generating..." : "Generate and Preview PDF"}
                </Button>
              </div>

              <div className="space-y-2 text-sm">
                <p>
                  <strong>Tender ID:</strong> {tenderId}
                </p>
                <p>
                  <strong>Tender Title:</strong> {tenderTitle}
                </p>
              </div>
            </div>

            <div className="shrink-0 p-4 bg-gray-50 border-t">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Submitting..." : "Submit Tender Request"}
              </Button>
            </div>
          </form>
        </Form>

        {previewPDF && generatedPdfBlob && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full h-full max-w-4xl max-h-[90vh] overflow-auto flex flex-col">
              <div className="flex-grow">
                <PDFViewer width="100%" height="100%">
                  <PDFDocument
                    data={{
                      ...methods.getValues(),
                      tender_id: tenderId,
                      content_sections: contentSections,
                      company_name: companyProfile.company_title,
                      is_tender_request: true,
                      custom_fields: [],
                      end_date: new Date(),
                      terms: "",
                      scope_of_works: "",
                    }}
                    companyLogo={companyProfile.profile_image}
                    elafLogo={ELAF_LOGO_PNG_URL}
                    locale={ locale }

                  />
                </PDFViewer>
              </div>
              <div className="mt-4 flex justify-between items-center gap-2 px-4 pb-4">
                <Button
                  type="button"
                  onClick={() => setPreviewPDF(false)}
                  className="w-auto"
                  disabled={isLoading}
                >
                  Close Preview
                </Button>
                <div className="flex-grow"></div>
                <FormField
                  control={methods.control}
                  name="pdf_url"
                  render={({ field }) => (
                    <FormItem className="w-auto">
                      <FormControl>
                        <PDFUpload
                          disabled={isLoading}
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
    </FormProvider>
  );
}

export default TenderRequestForm;