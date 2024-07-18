import React from "react";
import { Layers, FileText, Users, LucideIcon } from "lucide-react";
import { FeatureCardProps } from "@/types";

 
   const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description }) => {
  return (
    <div className="flex flex-col items-center space-y-2 border p-4 rounded-lg">
      <Icon className="h-8 w-8 mb-2 text-primary" />
      <h3 className="text-xl font-medium">{title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
    </div>
  );
};


export default FeatureCard
