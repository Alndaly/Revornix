import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  output: "standalone",
  headers: async () => {
    return [
      {
        source: "/.well-known/apple-app-site-association",
        headers: [{ key: "content-type", value: "application/json" }]
      }
    ]
  },
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.uniapi.top",
      },
      {
        protocol: "https",
        hostname: "oss.kinda.info",
      }
    ],
  },
  env: {
    NEXT_PUBLIC_API_PREFIX: process.env.NEXT_PUBLIC_API_PREFIX,
    NEXT_PUBLIC_NOTIFICATION_WS_API_PREFIX: process.env.NEXT_PUBLIC_NOTIFICATION_WS_API_PREFIX,
    NEXT_PUBLIC_DAILY_HOT_API_PREFIX: process.env.NEXT_PUBLIC_DAILY_HOT_API_PREFIX
  }
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);