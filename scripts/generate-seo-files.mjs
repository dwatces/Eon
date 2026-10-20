// Writes public/robots.txt and public/sitemap.xml for this deployment's
// public URL (lib/site-url.cjs), so each deployment advertises its own
// address. The build script runs it before `next build`; both files are
// generated, not committed.
import { writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { allSlugs } from "../data/candles.js";

const require = createRequire(import.meta.url);
const { resolveSiteUrl } = require("../lib/site-url.cjs");

// Pages worth indexing. The cart, the order summary and the API are not.
export const SITEMAP_PATHS = [
  "/",
  "/shop",
  ...allSlugs().map((slug) => `/shop/${slug}`),
  "/about",
];
export const DISALLOWED_PATHS = ["/cart", "/success", "/api/"];

const escapeXml = (value) =>
  value.replace(
    /[<>&'"]/g,
    (char) =>
      ({
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        "'": "&apos;",
        '"': "&quot;",
      })[char],
  );

export function sitemapXml(siteUrl) {
  const urls = SITEMAP_PATHS.map(
    (path) => `  <url><loc>${escapeXml(`${siteUrl}${path}`)}</loc></url>`,
  );
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    "</urlset>",
    "",
  ].join("\n");
}

export function robotsTxt(siteUrl) {
  return [
    "User-agent: *",
    ...DISALLOWED_PATHS.map((path) => `Disallow: ${path}`),
    "",
    `Sitemap: ${siteUrl}/sitemap.xml`,
    "",
  ].join("\n");
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const siteUrl = resolveSiteUrl(process.env);
  writeFileSync(
    new URL("../public/sitemap.xml", import.meta.url),
    sitemapXml(siteUrl),
  );
  writeFileSync(
    new URL("../public/robots.txt", import.meta.url),
    robotsTxt(siteUrl),
  );
  console.log(`Wrote public/robots.txt and public/sitemap.xml for ${siteUrl}`);
}
