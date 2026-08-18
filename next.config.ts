// next.config.ts

import type {
  NextConfig,
} from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,

  experimental: {
    serverActions: {
      bodySizeLimit: '40mb',
    },
  },
};

export default nextConfig;