import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

const nextConfig: NextConfig = {
  // Enable compression
  compress: true,
  // Webpack optimizations for better code splitting
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Split Three.js and related libraries into separate chunks
      const existingCacheGroups = config.optimization.splitChunks?.cacheGroups || {};
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...existingCacheGroups,
          three: {
            test: /[\\/]node_modules[\\/](three|@react-three)[\\/]/,
            name: 'three',
            chunks: 'async',
            priority: 10,
            reuseExistingChunk: true,
          },
          gsap: {
            test: /[\\/]node_modules[\\/]gsap[\\/]/,
            name: 'gsap',
            chunks: 'async',
            priority: 10,
            reuseExistingChunk: true,
          },
        },
      };
    }
    return config;
  },
};

export default withNextIntl(nextConfig);
