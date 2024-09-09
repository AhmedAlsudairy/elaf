import { extractTLD } from '@/lib/utils/locale/extract-tld';
import { MetadataRoute } from 'next';
import { headers } from 'next/headers';

const defaultLocale = 'en' as const;
const locales = ['en', 'ar'] as const;

const staticRoutes = [
    '/profile/companyprofiles',
    '/tenders',
    '/contact'
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const headersList = headers()
    const host = headersList.get('host') as string;
    const protocol = headersList.get('x-forwarded-proto') || 'http';
    const tld = extractTLD((headersList.get('host') || headersList.get('x-forwarded-host')) as string);

    const baseUrl = `${protocol}://${host}`;

    const sitemapEntries: MetadataRoute.Sitemap = staticRoutes.flatMap(route => 
        getEntry(`${baseUrl}`, route)
    );

    return sitemapEntries;
}

function getEntry(baseUrl: string, pathname: string) {
    return {
        url: getUrl(baseUrl, pathname, defaultLocale),
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
        alternates: {
            languages: Object.fromEntries(
                locales.map((locale) => [locale, getUrl(baseUrl, pathname, locale)])
            )
        }
    };
}

function getUrl(baseUrl: string, pathname: string, locale: string) {
    return `${baseUrl}/${locale}${pathname === '/' ? '' : pathname}`;
}