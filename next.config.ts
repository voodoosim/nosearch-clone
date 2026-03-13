import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  turbopack: {
    root: ".",
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.unsplash.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      { protocol: "https", hostname: "**.samsung.com" },
      { protocol: "https", hostname: "image-us.samsung.com" },
      { protocol: "https", hostname: "images.samsung.com" },
      { protocol: "https", hostname: "**.lge.co.kr" },
      { protocol: "https", hostname: "www.lg.com" },
      { protocol: "https", hostname: "media.us.lg.com" },
      { protocol: "https", hostname: "**.apple.com" },
      { protocol: "https", hostname: "www.apple.com" },
      { protocol: "https", hostname: "store.storeimages.cdn-apple.com" },
      { protocol: "https", hostname: "assets.breville.com" },
      { protocol: "https", hostname: "assets.bosecreative.com" },
      { protocol: "https", hostname: "images.ctfassets.net" },
      { protocol: "https", hostname: "i01.appmifile.com" },
      { protocol: "https", hostname: "site-static.ecovacs.com" },
      { protocol: "https", hostname: "images.philips.com" },
      { protocol: "https", hostname: "dam.delonghi.com" },
      { protocol: "https", hostname: "www.vitamix.com" },
      { protocol: "https", hostname: "balmudtr0795.cdn-nhncommerce.com" },
    ],
  },
};

export default nextConfig;
