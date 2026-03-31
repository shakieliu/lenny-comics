import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export for Vercel deployment
  images: {
    // Use unoptimized for static WebP files (already pre-processed)
    unoptimized: false,
  },
};

export default nextConfig;
