import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // 정적 내보내기에 필요
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
      },
      {
        protocol: "https",
        hostname: "turtle-playground.kr",
      },
      {
        protocol: "https",
        hostname: "api.turtle-playground.kr",
      },
    ],
  },
};

export default nextConfig;
