import { FeatureCardProps } from "@/types";
import { FeatureCard } from "./ui/feature-card";
import { FactoryIcon, MessageCircleHeart, ShareIcon, Users } from "lucide-react";
import { useTranslations } from "next-intl";

 const SocialMediaSection: React.FC = () => {
    const t = useTranslations('SocialMedia');
  
    const features: FeatureCardProps[] = [
      {
        icon: FactoryIcon,
        title: t('companyProfiles.title'),
        description: t('companyProfiles.description'),
      },
      {
        icon: ShareIcon,
        title: t('socialSharing.title'),
        description: t('socialSharing.description'),
      },
      {
        icon: MessageCircleHeart,
        title: t('engagementTools.title'),
        description: t('engagementTools.description'),
      },
    ];
  
    return (
      <section className="w-full py-12 md:py-24 lg:py-32">
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
  
  export default SocialMediaSection