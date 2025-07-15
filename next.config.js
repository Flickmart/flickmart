/** @type {import('next').NextConfig} */
const nextConfig = {
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

module.exports = nextConfig;

// Injected content via Sentry wizard below

const { withSentryConfig } = require("@sentry/nextjs");

const sentryConfig = {
  org: "flickmart",
  project: "javascript-nextjs",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  disableLogger: true,
  automaticVercelMonitors: true,
};

module.exports = process.env.TURBOPACK
  ? nextConfig
  : withSentryConfig(nextConfig, sentryConfig);
