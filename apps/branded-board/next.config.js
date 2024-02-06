const { withSentryConfig } = require("@sentry/nextjs");

module.exports = {
  reactStrictMode: true,
  transpilePackages: [
    "@eden/package-ui",
    "@eden/package-context",
    "@eden/package-graphql",
    "@eden/package-mock",
  ],
  images: {
    domains: [
      "pbs.twimg.com",
      "app.lottiefiles.com",
      "storage.cloud.google.com",
      "storage.googleapis.com",
    ],
    formats: ["image/avif"],
  },
  async rewrites() {
    return [
      {
        source: "/robots.txt",
        destination: "/api/seo/robots",
      },
      {
        source: "/sitemap.xml",
        destination: "/api/seo/sitemap",
      },
    ];
  },
};

const sentryConfig = {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options

  // Suppresses source map uploading logs during build
  silent: true,
  org: "eausoftech",
  project: "eden-test",
};

const sentryWebPluginConfig = {
  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Transpiles SDK to be compatible with IE11 (increases bundle size)
  transpileClientSDK: true,

  // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
  tunnelRoute: "/monitoring",

  // Hides source maps from generated client bundles
  hideSourceMaps: true,

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors.
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: true,
};

module.exports = withSentryConfig(
  module.exports,
  sentryConfig,
  sentryWebPluginConfig
);
