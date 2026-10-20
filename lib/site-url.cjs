// Resolves the site's public URL once, at build time.
//
// CommonJS so next.config.js can require it. next.config.js exposes the
// result as process.env.SITE_URL, which Next inlines into both the server
// and the browser bundles, so both always agree.

const FALLBACK_SITE_URL = "https://eon-ht82.vercel.app";

const asOrigin = (value) => {
  if (typeof value !== "string" || !value.trim()) return null;
  try {
    const url = new URL(value.trim());
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    return `${url.protocol}//${url.host}`;
  } catch {
    return null;
  }
};

// Order: NEXT_PUBLIC_SITE_URL, then Vercel's production URL, then the
// eon-ht82 deployment. Never has a trailing slash.
function resolveSiteUrl(env = {}) {
  const explicit = asOrigin(env.NEXT_PUBLIC_SITE_URL);
  if (explicit) return explicit;
  const vercelHost =
    typeof env.VERCEL_PROJECT_PRODUCTION_URL === "string"
      ? env.VERCEL_PROJECT_PRODUCTION_URL.trim()
      : "";
  const vercel = vercelHost ? asOrigin(`https://${vercelHost}`) : null;
  if (vercel) return vercel;
  return FALLBACK_SITE_URL;
}

module.exports = { resolveSiteUrl, FALLBACK_SITE_URL };
