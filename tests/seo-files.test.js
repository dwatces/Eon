import { describe, expect, it } from "vitest";
import {
  DISALLOWED_PATHS,
  SITEMAP_PATHS,
  robotsTxt,
  sitemapXml,
} from "../scripts/generate-seo-files.mjs";

const SITE = "https://eon-ht82.vercel.app";

describe("generated SEO files", () => {
  it("list the seven indexable pages, the four candles included", () => {
    expect(SITEMAP_PATHS).toEqual([
      "/",
      "/shop",
      "/shop/love",
      "/shop/happiness",
      "/shop/dreams",
      "/shop/summer",
      "/about",
    ]);
  });

  it("write a sitemap of absolute URLs with no lastmod", () => {
    const xml = sitemapXml(SITE);
    expect(xml).toContain(
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    );
    expect(xml.match(/<loc>/g)).toHaveLength(7);
    expect(xml).toContain("<loc>https://eon-ht82.vercel.app/</loc>");
    expect(xml).toContain(
      "<loc>https://eon-ht82.vercel.app/shop/happiness</loc>",
    );
    expect(xml).not.toContain("lastmod");
    expect(xml).not.toContain("#");
  });

  it("keep the cart, the order summary and the API out of robots", () => {
    const robots = robotsTxt(SITE);
    for (const path of DISALLOWED_PATHS) {
      expect(robots).toContain(`Disallow: ${path}\n`);
    }
    expect(robots).toContain(`Sitemap: ${SITE}/sitemap.xml`);
    expect(robots.startsWith("User-agent: *\n")).toBe(true);
  });

  it("follow the deployment's own URL", () => {
    const other = "https://eon-preview.example";
    expect(robotsTxt(other)).toContain(`Sitemap: ${other}/sitemap.xml`);
    expect(sitemapXml(other)).toContain(`<loc>${other}/shop</loc>`);
  });
});
