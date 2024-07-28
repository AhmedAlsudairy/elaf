import { useTranslations } from "next-intl";
import { FeatureCardProps } from "@/types";
import FeatureCard from "./ui/feature-card";
import { FileText, Layers, Users } from "lucide-react";
import Description from "@/components/common/description";
import Title from "@/components/common/tiltle";

 const FeatureSection: React.FC = () => {
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
            <Title>
                 {t('title')}
            </Title>
           
            <Description>
              {t('description')}
            </Description>
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

  export default FeatureSection