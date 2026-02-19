import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  trailingSlash: false,

  // Optimización de imágenes
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 año
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.taylorswiftweb.net',
      },
      {
        protocol: 'https',
        hostname: '*.theswiftagency.com',
      },
      {
        protocol: 'https',
        hostname: '*.variety.com',
      },
      {
        protocol: 'https',
        hostname: '*.billboard.com',
      },
      {
        protocol: 'https',
        hostname: '*.rollingstone.com',
      },
      {
        protocol: 'https',
        hostname: '*.people.com',
      },
      {
        protocol: 'https',
        hostname: '*.reddit.com',
      },
      {
        protocol: 'https',
        hostname: '*.news.google.com',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
    ],
  },

  // Compresión
  compress: true,

  // Experimental features para mejor performance
  experimental: {
    optimizePackageImports: ['@mui/material', '@mui/icons-material'],
  },
};

export default withNextIntl(nextConfig);
