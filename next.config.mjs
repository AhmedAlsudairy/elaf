import createNextIntlPlugin from 'next-intl/plugin';
 
const withNextIntl = createNextIntlPlugin();
 
/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'lh3.googleusercontent.com',
            pathname: '/**',
          },
          {
            protocol: 'https',
            hostname: 'rgvkvhrkuimkkmtqxtim.supabase.co',
            pathname: '/**',
          },
        ],
      },
    }
 

 
export default withNextIntl(nextConfig);