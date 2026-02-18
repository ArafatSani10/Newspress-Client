import withNextIntl from 'next-intl/plugin';

const withNextIntlConfig = withNextIntl('./src/i18n.ts'); 

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

// @ts-ignore
export default withNextIntlConfig(nextConfig);