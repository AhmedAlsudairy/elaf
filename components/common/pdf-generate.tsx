import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';
import { format } from 'date-fns';

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
}

// Register default font
Font.register({
  family: 'Roboto',
  src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf',
});

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily: 'Roboto',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    borderBottom: '1px solid #CCCCCC',
    paddingBottom: 10,
  },
  headerLeft: {
    flexDirection: 'column',
  },
  headerRight: {
    flexDirection: 'column',
    alignItems: 'flex-end',
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
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#333333',
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
  paragraph: {
    fontSize: 12,
    lineHeight: 1.5,
    marginBottom: 10,
    textAlign: 'justify',
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  bullet: {
    width: 15,
    fontSize: 12,
  },
  metaData: {
    fontSize: 10,
    color: '#888888',
    marginTop: 5,
  },
  scopeOfWorks: {
    marginBottom: 10,
  },
  scopeItem: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  scopeNumber: {
    width: 20,
    fontSize: 12,
    fontWeight: 'bold',
  },
  scopeContent: {
    flex: 1,
    fontSize: 12,
  },
  scopeBullet: {
    width: 15,
    fontSize: 12,
    marginLeft: 20,
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 10,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: '#888888',
  },
  bidPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 10,
  },
});

const PDFDocument: React.FC<PDFDocumentProps> = ({ data, companyLogo, elafLogo }) => {
  const renderScopeOfWorks = (scopeOfWorks: string) => {
    const sections = scopeOfWorks.split(/(?=\d+\.)/).filter(section => section.trim() !== '');

    return sections.map((section, index) => {
      const [title, ...content] = section.split('\n').filter(line => line.trim() !== '');
      return (
        <View key={index} style={styles.section}>
          <Text style={styles.fieldTitle}>{title.trim()}</Text>
          {content.map((line, lineIndex) => (
            <View key={lineIndex} style={styles.scopeItem}>
              <Text style={styles.scopeBullet}>•</Text>
              <Text style={styles.scopeContent}>{line.trim().replace(/^[-:]/, '').trim()}</Text>
            </View>
          ))}
        </View>
      );
    });
  };

  const Header = () => (
    <View style={styles.header} fixed>
      <View style={styles.headerLeft}>
        <View style={styles.logoContainer}>
          <Image style={styles.logo} src={elafLogo} />
        </View>
        <Text style={styles.metaData}>Tender ID: {data.tender_id}</Text>
      </View>
      <View style={styles.headerRight}>
        <View style={styles.logoContainer}>
          <Image style={styles.logo} src={companyLogo} />
        </View>
        <Text style={styles.metaData}>Created At: {format(new Date(), 'PPP')}</Text>
        {data.company_name && (
          <Text style={styles.metaData}>Company: {data.company_name}</Text>
        )}
      </View>
    </View>
  );

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        <Header />
        <Text style={styles.title}>{data.title}</Text>

        {data.is_tender_request && data.bid_price !== undefined && data.currency && (
          <View style={styles.section}>
            <Text style={styles.bidPrice}>
              Bid Price: {data.currency} {data.bid_price.toFixed(2)}
            </Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.fieldTitle}>Summary:</Text>
          <Text style={styles.fieldContent}>{data.summary}</Text>
        </View>

        {!data.is_tender_request && (
          <>
            <View style={styles.section}>
              <Text style={styles.fieldTitle}>End Date:</Text>
              <Text style={styles.fieldContent}>{format(data.end_date, 'PPP')}</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.fieldTitle}>Terms:</Text>
              <Text style={styles.fieldContent}>{data.terms}</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.fieldTitle}>Scope of Works:</Text>
              <View style={styles.scopeOfWorks}>
                {renderScopeOfWorks(data.scope_of_works)}
              </View>
            </View>

            {data.content_sections.map((section, index) => (
              <View key={index} style={styles.section}>
                <Text style={styles.fieldTitle}>{section.title}</Text>
                {section.type === 'paragraph' ? (
                  section.content.map((paragraph, pIndex) => (
                    <Text key={pIndex} style={styles.paragraph}>{paragraph}</Text>
                  ))
                ) : (
                  section.content.map((item, lIndex) => (
                    <View key={lIndex} style={styles.listItem}>
                      <Text style={styles.bullet}>• </Text>
                      <Text style={styles.fieldContent}>{item}</Text>
                    </View>
                  ))
                )}
              </View>
            ))}

            {data.custom_fields.map((field, index) => (
              <View key={index} style={styles.section}>
                <Text style={styles.fieldTitle}>{field.title}:</Text>
                <Text style={styles.fieldContent}>{field.description}</Text>
              </View>
            ))}
          </>
        )}

        <Text 
          style={styles.pageNumber} 
          render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} 
          fixed 
        />
      </Page>
    </Document>
  );
};

export default PDFDocument;