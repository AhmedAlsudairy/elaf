import React from 'react';
import ReactMarkdown from 'react-markdown';

interface TenderContentProps {
  title: string;
  content: string;
}

const formatTenderContent = (content: string): string => {
  const lines = content.split('\n');
  let formattedContent = '';
  let inList = false;

  lines.forEach((line) => {
    if (line.match(/^\d+\./)) {
      if (!inList) {
        formattedContent += '\n';
        inList = true;
      }
      formattedContent += line.trim() + '\n';
    } else if (line.trim().startsWith('-')) {
      formattedContent += '  ' + line.trim() + '\n';
    } else if (line.trim() !== '') {
      if (inList) {
        formattedContent += '\n';
        inList = false;
      }
      formattedContent += line.trim() + '\n\n';
    }
  });

  return formattedContent.trim();
};

const TenderContent: React.FC<TenderContentProps> = ({ title, content }) => (
  <>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <ReactMarkdown className="text-gray-600 mb-4">
      {formatTenderContent(content) || `No ${title.toLowerCase()} available`}
    </ReactMarkdown>
  </>
);

export default TenderContent;