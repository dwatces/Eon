import { FALLBACK_SITE_URL } from "./site-url.cjs";

// Inlined at build time from next.config.js (see lib/site-url.cjs).
export const siteUrl = process.env.SITE_URL || FALLBACK_SITE_URL;

export const absoluteUrl = (path = "/") =>
  `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;

const LOOPBACK = new Set(["localhost", "127.0.0.1", "[::1]"]);

const hostOf = (value) => {
  if (typeof value !== "string" || !value.trim()) return null;
  try {
    const url = new URL(
      value.includes("://") ? value.trim() : `https://${value.trim()}`,
    );
    return url.host.toLowerCase();
  } catch {
    return null;
  }
};

// Picks the origin that Stripe sends the shopper back to after checkout.
//
// The request's Host header is only trusted when it is on an allow-list:
// the site URL and the URLs Vercel gives this deployment, plus localhost
// and 127.0.0.1 outside Vercel production. Anything else, including a
// spoofed Origin header, falls back to the site URL.
export function resolveReturnOrigin(
  req,
  { env = process.env, site = siteUrl } = {},
) {
  const allowed = new Set(
    [
      site,
      env.VERCEL_URL,
      env.VERCEL_BRANCH_URL,
      env.VERCEL_PROJECT_PRODUCTION_URL,
    ]
      .map(hostOf)
      .filter(Boolean),
  );
  const host = hostOf(req?.headers?.host);
  if (host) {
    const hostname = host.replace(/:\d+$/, "");
    if (LOOPBACK.has(hostname) && env.VERCEL_ENV !== "production") {
      return `http://${host}`;
    }
    if (allowed.has(host)) return `https://${host}`;
  }
  return site;
}
