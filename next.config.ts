import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "m.store.nosearch.com",
      },
      {
        protocol: "https",
        hostname: "d21x3meyyr2jva.cloudfront.net",
      },
    ],
  },
};

export default nextConfig;
