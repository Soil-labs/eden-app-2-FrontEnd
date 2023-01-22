const withTM = require("next-transpile-modules")([
  "@eden/package-ui",
  "@eden/package-context",
  "@eden/package-graphql",
  "@eden/package-mock",
]);

// import withLess from "@zeit/next-less";

module.exports = withTM({
  reactStrictMode: true,
});

// export default withLess({
//   productionBrowserSourceMaps: true,
//   onDemandEntries: {
//     maxInactiveAge: 1000 * 60 * 60,
//     pagesBufferLength: 5,
//   },
//   lessLoaderOptions: {
//     javascriptEnabled: true,
//   },
//   trailingSlash: false,
// });
