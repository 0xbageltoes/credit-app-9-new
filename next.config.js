/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  // Add webpack configuration to properly handle client components
  webpack: (config) => {
    config.resolve.fallback = { fs: false };
    return config;
  },
};

module.exports = nextConfig;