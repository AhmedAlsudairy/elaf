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
        ],
      },
    }
 

 
export default withNextIntl(nextConfig);