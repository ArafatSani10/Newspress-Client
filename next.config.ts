import type { NextConfig } from "next";
import withNextIntl from "next-intl/plugin";

const withNextIntlConfig = withNextIntl("./src/i18n.ts");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ibb.co",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  rewrites: async () => {
    return [
      {
        source: "/api/v1/:path*",
        destination: `https://newspress-server-beta.vercel.app/api/v1/:path*`,
      },
      {
        source: "/api/auth/:path*",
        destination: `https://newspress-server-beta.vercel.app/api/auth/:path*`,
      },
    ];
  },
  headers: async () => {
    return [
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Credentials",
            value: "true",
          },
        ],
      },
    ];
  },
};

const finalConfig = withNextIntlConfig(nextConfig);

if (finalConfig.experimental && "turbo" in finalConfig.experimental) {
  delete (finalConfig.experimental as { turbo?: unknown }).turbo;
}

export default finalConfig;
