import { MetadataRoute } from 'next';
import { headers } from 'next/headers';


export default async function robots(): Promise<MetadataRoute.Robots> {
    const headersList = headers();
    const host = (headersList.get('host') || headersList.get('x-forwarded-host')) as string;
    const protocol = headersList.get('x-forwarded-proto') || 'http';

    // If you need any data from the API, you can still use it like this:
    // const page = await getPageData();
    // const customRules = parseRulesString(page.properties.rules);

    return {
        rules: [
            {
                userAgent: '*',
                disallow: ['/privacy', '/terms'],
                allow: '/',
            },
            // If you have any custom rules from your API, you can add them here
            // ...customRules,
        ],
        sitemap: `${protocol}://${host}/sitemap.xml`
    };
}