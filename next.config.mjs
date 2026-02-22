import createNextIntlPlugin from 'next-intl/plugin';
 
const withNextIntl = createNextIntlPlugin('./i18n/request.ts');
 
/** @type {import('next').NextConfig} */
const nextConfig = {
    serverExternalPackages: ['@react-pdf/renderer'],
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'lh3.googleusercontent.com',
            pathname: '/**',
          },
          {
            protocol: 'https',
            hostname: '*.public.blob.vercel-storage.com',  
            pathname: '/**',
          },
                    {
            protocol: 'https',
            hostname: 'img.clerk.com',
            pathname: '/**',
          },
          {
            protocol: 'https',
            hostname: 'images.clerk.dev',
            pathname: '/**',
          },
        ],
      },
    }
 

 
export default withNextIntl(nextConfig);