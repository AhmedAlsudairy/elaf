'use client'
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

const PDFDocument: React.FC<PDFDocumentProps> = ({ data, companyLogo, elafLogo, locale }) => {
  const isRTL = locale === 'ar';

  // Define styles
  const styles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      backgroundColor: '#FFFFFF',
      padding: 30,
      fontFamily: 'Cairo',
    },
    header: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
      borderBottom: '1px solid #CCCCCC',
      paddingBottom: 10,
    },
    headerColumn: {
      flexDirection: 'column',
      alignItems: isRTL ? 'flex-end' : 'flex-start',
    },
    logoContainer: {
      marginBottom: 10,
    },
    logo: {
      width: 100,
      height: 50,
      objectFit: 'contain',
    },
    title: {
      fontSize: 24,
      marginBottom: 20,
      fontWeight: 'bold',
      color: '#333333',
      textAlign: 'center',
    },
    section: {
      marginBottom: 10,
    },
    fieldTitle: {
      fontSize: 14,
      fontWeight: 'bold',
      marginBottom: 5,
      color: '#555555',
      textAlign: isRTL ? 'right' : 'left',
    },
    fieldContent: {
      fontSize: 12,
      lineHeight: 1.5,
      color: '#333333',
      textAlign: isRTL ? 'right' : 'left',
    },
    metaData: {
      fontSize: 10,
      color: '#888888',
      marginTop: 5,
      textAlign: isRTL ? 'right' : 'left',
    },
    bidPrice: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#007bff',
      marginBottom: 10,
      textAlign: isRTL ? 'right' : 'left',
    },
    listItem: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      marginBottom: 5,
    },
    bullet: {
      width: 15,
      fontSize: 12,
      marginRight: isRTL ? 0 : 5,
      marginLeft: isRTL ? 5 : 0,
    },
  });

  const formatArabicDate = (date: Date) => {
    const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    const day = date.getDate().toString().split('').map(d => arabicNumbers[parseInt(d)]).join('');
    const month = date.toLocaleString('ar-EG', { month: 'long' });
    const year = date.getFullYear().toString().split('').map(y => arabicNumbers[parseInt(y)]).join('');
    return `${day} ${month} ${year}`;
  };

  const Header: React.FC = () => (
    <View style={styles.header}>
      <View style={styles.headerColumn}>
        <View style={styles.logoContainer}>
          <Image style={styles.logo} src={companyLogo} />
        </View>
        <Text style={styles.metaData}>
          {isRTL ? 'تم الإنشاء في' : 'Created At'} {isRTL ? formatArabicDate(new Date()) : format(new Date(), 'PPP', { locale: isRTL ? ar : undefined })}
        </Text>
        {data.company_name && (
          <Text style={styles.metaData}>
            {isRTL ? 'الشركة' : 'Company'} {data.company_name}
          </Text>
        )}
      </View>
      <View style={styles.headerColumn}>
        <View style={styles.logoContainer}>
          <Image style={styles.logo} src={elafLogo} />
        </View>
        <Text style={styles.metaData}>Tender ID {data.tender_id}</Text>
      </View>
    </View>
  );

  const renderSection = (title: string, content: string | React.ReactNode) => (
    <View style={styles.section}>
      <Text style={styles.fieldTitle}>{title}</Text>
      {typeof content === 'string' ? (
        <Text style={styles.fieldContent}>{content}</Text>
      ) : (
        content
      )}
    </View>
  );

  const renderListItems = (items: string[]) => (
    items.map((item, index) => (
      <View key={index} style={styles.listItem}>
        <Text style={styles.bullet}>{isRTL ? ' -' : '- '}</Text>
        <Text style={styles.fieldContent}>{item.trim()}</Text>
      </View>
    ))
  );

  const renderSectionContent = (content: string) => {
    const items = content
      .split('\n')
      .map(item => item.trim())
      .filter(item => item !== '');
    return items.length > 1 ? renderListItems(items) : <Text style={styles.fieldContent}>{items[0]}</Text>;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Header />
        <Text style={styles.title}>{data.title}</Text>
        
        {data.is_tender_request && data.bid_price !== undefined && data.currency && (
          <View style={styles.section}>
            <Text style={styles.bidPrice}>
              {isRTL ? `سعر المناقصة ${data.currency} ${data.bid_price.toFixed(2)}` 
                     : `Bid Price ${data.currency} ${data.bid_price.toFixed(2)}`}
            </Text>
          </View>
        )}

        {renderSection(isRTL ? 'الملخص' : 'Summary', data.summary.trim())}

        {!data.is_tender_request && (
          <>
            {renderSection(isRTL ? 'تاريخ الانتهاء' : 'End Date', 
              isRTL ? formatArabicDate(data.end_date) : format(data.end_date, 'PPP', { locale: undefined })
            )}
            {renderSection(isRTL ? 'الشروط' : 'Terms', renderSectionContent(data.terms))}
            {renderSection(isRTL ? 'نطاق الأعمال' : 'Scope of Works', renderSectionContent(data.scope_of_works))}
          </>
        )}

        {data.custom_fields.map((field, index) => (
          renderSection(field.title, renderSectionContent(field.description))
        ))}

        {data.content_sections.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.fieldTitle}>{section.title}</Text>
            {section.type === 'paragraph' ? (
              section.content.map((paragraph, pIndex) => (
                <Text key={pIndex} style={styles.fieldContent}>{paragraph.trim()}</Text>
              ))
            ) : (
              renderListItems(section.content.map(item => item.trim()))
            )}
          </View>
        ))}
      </Page>
    </Document>
  );
};

export default PDFDocument;