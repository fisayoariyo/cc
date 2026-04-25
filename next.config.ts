import type { NextConfig } from 'next';
import { PHASE_DEVELOPMENT_SERVER } from 'next/constants';

export default function config(phase: string): NextConfig {
  return {
    /**
     * Keep dev and build artifacts separate. This prevents corruption when
     * another terminal runs build/start while dev is active.
     */
    distDir: phase === PHASE_DEVELOPMENT_SERVER ? '.next-dev' : '.next',
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'images.unsplash.com',
          pathname: '/**',
        },
      ],
    },
    /**
     * Dev-only tuning: keep compiled pages in memory longer so route revisits
     * do not trigger frequent re-compilation during local development.
     */
    onDemandEntries: {
      maxInactiveAge: 10 * 60 * 1000,
      pagesBufferLength: 8,
    },
    async redirects() {
      return [
        {
          source: '/travels',
          destination: '/travel',
          permanent: true,
        },
        {
          source: '/travels/:path*',
          destination: '/travel/:path*',
          permanent: true,
        },
        {
          source: '/real-estate/properties',
          destination: '/properties',
          permanent: true,
        },
        {
          source: '/real-estate/properties/:path*',
          destination: '/properties/:path*',
          permanent: true,
        },
      ];
    },
    async rewrites() {
      return [
        {
          source: '/travel',
          destination: '/travels',
        },
        {
          source: '/travel/:path*',
          destination: '/travels/:path*',
        },
        {
          source: '/properties',
          destination: '/real-estate/properties',
        },
        {
          source: '/properties/:path*',
          destination: '/real-estate/properties/:path*',
        },
      ];
    },
  };
}
