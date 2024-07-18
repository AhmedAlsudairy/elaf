import { useTranslations } from "next-intl";
import { FeatureCard } from "./ui/feature-card";
import { FileText, Layers, Users } from "lucide-react";
import { FeatureCardProps } from "@/types";

export const FeatureSection: React.FC = () => {
    const t = useTranslations('Features');
  
    const features: FeatureCardProps[] = [
      {
        icon: Layers,
        title: t('tenderManagement.title'),
        description: t('tenderManagement.description'),
      },
      {
        icon: Users,
        title: t('supplierProfiles.title'),
        description: t('supplierProfiles.description'),
      },
      {
        icon: FileText,
        title: t('bidManagement.title'),
        description: t('bidManagement.description'),
      },
    ];
  
    return (
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
        <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
          <div className="space-y-3">
            <h2 className="text-3xl font-balooBhaijaan font-medium tracking-tighter md:text-4xl/tight">
              {t('title')}
            </h2>
            <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              {t('description')}
            </p>
          </div>
          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>
    );
  };