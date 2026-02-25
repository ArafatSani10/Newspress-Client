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
};

const finalConfig = withNextIntlConfig(nextConfig);

if (finalConfig.experimental && "turbo" in finalConfig.experimental) {
  delete (finalConfig.experimental as { turbo?: unknown }).turbo;
}

export default finalConfig;
