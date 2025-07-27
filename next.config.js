/** @type {import('next').NextConfig} */
const { withBotId } = require('botid/next/config');
const { withSentryConfig } = require('@sentry/nextjs');

const baseConfig = {
  reactStrictMode: true,
  serverComponentsExternalPackages: [`require-in-the-middle`],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ppynkony23.ufs.sh",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "img.clerk.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "6xxtyvziev.ufs.sh",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

// Sentry config
const sentryOptions = {
  org: "flickmart",
  project: "javascript-nextjs",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  disableLogger: true,
  automaticVercelMonitors: true,
};

let finalConfig = withBotId(baseConfig);

if (!process.env.TURBOPACK) {
  finalConfig = withSentryConfig(finalConfig, sentryOptions);
}

module.exports = finalConfig;
