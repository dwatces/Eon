const { resolveSiteUrl } = require("./lib/site-url.cjs");

// Everything the site loads comes from its own origin: no third-party
// scripts, fonts or analytics. Production builds use webpack, which adds
// no inline scripts, so script-src can stay 'self'. Styles allow inline
// because next/font and React style attributes need it.
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  "frame-ancestors 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

// The dev server needs eval for fast refresh, so it gets no CSP.
const isDev = process.env.NODE_ENV === "development";

const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  ...(isDev
    ? []
    : [{ key: "Content-Security-Policy", value: contentSecurityPolicy }]),
];

module.exports = {
  // One public URL for canonical links, the sitemap and Stripe return URLs.
  env: {
    SITE_URL: resolveSiteUrl(process.env),
  },
  turbopack: { root: __dirname },
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        source: "/api/:path*",
        headers: [{ key: "Cache-Control", value: "no-store" }],
      },
    ];
  },
};
