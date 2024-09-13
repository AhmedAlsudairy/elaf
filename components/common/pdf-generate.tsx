import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

// Register Arabic font
Font.register({
  family: 'Cairo',
  fonts: [
    { src: '/fonts/Cairo-Regular.ttf', fontWeight: 400 },
    { src: '/fonts/Cairo-Bold.ttf', fontWeight: 700 },
  ]
});

// Define the type for the data prop
interface PDFData {
  title: string;
  summary: string;
  end_date: Date;
  terms: string;
  scope_of_works: string;
  custom_fields: Array<{ title: string; description: string }>;
  tender_id: string;
  content_sections: Array<{
    type: 'paragraph' | 'list';
    title: string;
    content: string[];
  }>;
  bid_price?: number;
  currency?: 'OMR' | 'EGP' | 'SAR' | 'AED';
  company_name?: string;
  is_tender_request?: boolean;
}

// Define prop types for the component
interface PDFDocumentProps {
  data: PDFData;
  companyLogo: string;
  elafLogo: string;
  locale: string;
}

// Define styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column' as const,
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily: 'Cairo',
  },
  header: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    marginBottom: 20,
    borderBottom: '1px solid #CCCCCC',
    paddingBottom: 10,
  },
  headerColumn: {
    flexDirection: 'column' as const,
  },
  logoContainer: {
    marginBottom: 10,
  },
  logo: {
    width: 100,
    height: 50,
    objectFit: 'contain' as const,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center' as const,
  },
  section: {
    marginBottom: 10,
  },
  fieldTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#555555',
  },
  fieldContent: {
    fontSize: 12,
    lineHeight: 1.5,
    color: '#333333',
  },
  metaData: {
    fontSize: 10,
    color: '#888888',
    marginTop: 5,
  },
  bidPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 10,
  },
  listItem: {
    flexDirection: 'row' as const,
    marginBottom: 5,
  },
  bullet: {
    width: 15,
    fontSize: 12,
  },
});

const PDFDocument: React.FC<PDFDocumentProps> = ({ data, companyLogo, elafLogo, locale }) => {
  const isRTL = locale === 'ar';

  const rtlStyles = {
    ...styles,
    page: { ...styles.page, direction: 'rtl' as const },
    header: { ...styles.header, flexDirection: 'row-reverse' as const },
    headerColumn: { ...styles.headerColumn, alignItems: 'flex-end' as const },
    fieldTitle: { ...styles.fieldTitle, textAlign: 'right' as const },
    fieldContent: { ...styles.fieldContent, textAlign: 'right' as const },
    metaData: { ...styles.metaData, textAlign: 'right' as const },
    bidPrice: { ...styles.bidPrice, textAlign: 'right' as const },
    listItem: { ...styles.listItem, flexDirection: 'row-reverse' as const },
  };

  const currentStyles = isRTL ? rtlStyles : styles;

  const formatArabicDate = (date: Date) => {
    const day = date.getDate();
    const month = date.toLocaleString('ar-EG', { month: 'long' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const Header: React.FC = () => (
    <View style={currentStyles.header}>
      <View style={currentStyles.headerColumn}>
        <View style={currentStyles.logoContainer}>
          <Image style={currentStyles.logo} src={companyLogo} />
        </View>
        <Text style={currentStyles.metaData}>
          {isRTL ? 'تم الإنشاء في' : 'Created At'} {isRTL ? formatArabicDate(new Date()) : format(new Date(), 'PPP', { locale: isRTL ? ar : undefined })}
        </Text>
        {data.company_name && (
          <Text style={currentStyles.metaData}>
            {isRTL ? 'الشركة' : 'Company'} {data.company_name}
          </Text>
        )}
      </View>
      <View style={currentStyles.headerColumn}>
        <View style={currentStyles.logoContainer}>
          <Image style={currentStyles.logo} src={elafLogo} />
        </View>
        <Text style={currentStyles.metaData}>Tender ID {data.tender_id}</Text>
      </View>
    </View>
  );

  const renderSection = (title: string, content: string | React.ReactNode) => (
    <View style={currentStyles.section}>
      <Text style={currentStyles.fieldTitle}>{title}</Text>
      {typeof content === 'string' ? (
        <Text style={currentStyles.fieldContent}>{content}</Text>
      ) : (
        content
      )}
    </View>
  );

  const renderListItems = (items: string[]) => (
    items.map((item, index) => (
      <View key={index} style={currentStyles.listItem}>
        <Text style={currentStyles.bullet}>• </Text>
        <Text style={currentStyles.fieldContent}>{item}</Text>
      </View>
    ))
  );

  return (
    <Document>
      <Page size="A4" style={currentStyles.page}>
        <Header />
        <Text style={styles.title}>{data.title}</Text>
        
        {data.is_tender_request && data.bid_price !== undefined && data.currency && (
          <View style={currentStyles.section}>
            <Text style={currentStyles.bidPrice}>
              {isRTL ? `سعر العطاء ${data.currency} ${data.bid_price.toFixed(2)}` 
                     : `Bid Price ${data.currency} ${data.bid_price.toFixed(2)}`}
            </Text>
          </View>
        )}

        {renderSection(isRTL ? 'الملخص' : 'Summary', data.summary)}

        {!data.is_tender_request && (
          <>
            {renderSection(isRTL ? 'تاريخ الانتهاء' : 'End Date', 
              isRTL ? formatArabicDate(data.end_date) : format(data.end_date, 'PPP', { locale: undefined })
            )}
            {renderSection(isRTL ? 'الشروط' : 'Terms', data.terms)}
            {renderSection(isRTL ? 'نطاق الأعمال' : 'Scope of Works', data.scope_of_works)}
          </>
        )}

        {data.custom_fields.map((field, index) => (
          renderSection(field.title, field.description)
        ))}

        {data.content_sections.map((section, index) => (
          <View key={index} style={currentStyles.section}>
            <Text style={currentStyles.fieldTitle}>{section.title}</Text>
            {section.type === 'paragraph' ? (
              section.content.map((paragraph, pIndex) => (
                <Text key={pIndex} style={currentStyles.fieldContent}>{paragraph}</Text>
              ))
            ) : (
              renderListItems(section.content)
            )}
          </View>
        ))}
      </Page>
    </Document>
  );
};

export default PDFDocument;