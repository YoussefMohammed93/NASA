import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "apod.nasa.gov",
        port: "",
        pathname: "/apod/image/**",
      },
      {
        protocol: "https",
        hostname: "mars.nasa.gov",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.nasa.gov",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "epic.gsfc.nasa.gov",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
