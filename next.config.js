const { resolveSiteUrl } = require("./lib/site-url.cjs");

// Everything the site loads comes from its own origin: no third-party
// scripts, fonts or analytics. The build script uses webpack, which adds
// no inline scripts, so script-src stays 'self'. A Turbopack build (for
// example a hosting build command of plain `next build`) adds an inline
// bootstrap script to every page, so it falls back to 'unsafe-inline'
// rather than shipping pages that run no JavaScript. Styles allow inline
// because next/font and React style attributes need it.
const builtWithTurbopack = Boolean(process.env.TURBOPACK);

const contentSecurityPolicy = [
  "default-src 'self'",
  builtWithTurbopack
    ? "script-src 'self' 'unsafe-inline'"
    : "script-src 'self'",
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
  // The dev server loads one JSON manifest through a script tag, which
  // nosniff blocks, so nosniff is for production builds only.
  ...(isDev ? [] : [{ key: "X-Content-Type-Options", value: "nosniff" }]),
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
  // Keep `next dev` from adding a generated rules file to the project.
  agentRules: false,
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
