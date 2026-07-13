import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'ai4manufacturing.ca', pathname: '/_uploads/**' },
    ],
  },
};

export default nextConfig;
