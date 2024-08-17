import React from 'react';

interface TenderInfoProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}

const TenderInfo: React.FC<TenderInfoProps> = ({ icon, label, value }) => (
  <div className="flex items-center mb-2">
    {icon}
    <span className="ml-2">
      <strong>{label}:</strong> {value}
    </span>
  </div>
);

export default TenderInfo;