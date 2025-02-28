import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
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
      {
        protocol: "https",
        hostname: "https://d2bmu4l3brkna3.cloudfront.net", // CloudFront 도메인으로 변경 필요
      },
    ],
  },
  env: {
    ASSET_PREFIX: "https://d2bmu4l3brkna3.cloudfront.net", // CloudFront 도메인으로 변경 필요
  },
};

export default nextConfig;
