const { resolveSiteUrl } = require("./lib/site-url.cjs");

module.exports = {
  // One public URL for canonical links, the sitemap and Stripe return URLs.
  env: {
    SITE_URL: resolveSiteUrl(process.env),
  },
  // Next 12 only lints pages, components and lib by default.
  eslint: {
    dirs: ["pages", "components", "lib", "hooks", "data", "tests", "e2e"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
        ],
      },
    ];
  },
};
