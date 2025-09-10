/** @type {import('next').NextConfig} */
const { withBotId } = require('botid/next/config');
const { withSentryConfig } = require('@sentry/nextjs');

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  sw: 'sw-custom.js', // Use our custom service worker
  runtimeCaching: [
    {
      urlPattern: /^https?.*/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'offlineCache',
        expiration: {
          maxEntries: 200,
        },
      },
    },
  ],
});

const baseConfig = {
  reactStrictMode: true,
  serverComponentsExternalPackages: ['require-in-the-middle'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ppynkony23.ufs.sh',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'utfs.io',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '6xxtyvziev.ufs.sh',
        port: '',
        pathname: '/**',
      },
    ],
  },
  rewrites() {
    return [
      {
        source: '/ingest/static/:path*',
        destination: 'https://us-assets.i.posthog.com/static/:path*',
      },
      {
        source: '/ingest/:path*',
        destination: 'https://us.i.posthog.com/:path*',
      },
      {
        source: '/ingest/flags',
        destination: 'https://us.i.posthog.com/flags',
      },
    ];
  },
  // This is required to support PostHog trailing slash API requests
  skipTrailingSlashRedirect: true,
};

// Sentry config
const sentryOptions = {
  org: 'flickmart',
  project: 'javascript-nextjs',
  silent: !process.env.CI,
  widenClientFileUpload: true,
  disableLogger: true,
  automaticVercelMonitors: true,
};

let finalConfig = withBotId(baseConfig);

if (!process.env.TURBOPACK) {
  finalConfig = withSentryConfig(finalConfig, sentryOptions);
}

module.exports = withPWA(finalConfig);
