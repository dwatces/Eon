import { test, expect } from "./fixtures";

const INDEXED = [
  "/",
  "/shop",
  "/shop/love",
  "/shop/happiness",
  "/shop/dreams",
  "/shop/summer",
  "/about",
];
const NOT_INDEXED = ["/cart", "/success"];

// The build writes robots.txt for its own site URL; read it back from there.
async function siteUrl(request) {
  const robots = await (await request.get("/robots.txt")).text();
  return robots.match(/^Sitemap: (.+)\/sitemap\.xml$/m)[1];
}

test("robots.txt keeps private pages out and points to the sitemap", async ({
  request,
}) => {
  const response = await request.get("/robots.txt");
  expect(response.status()).toBe(200);
  const robots = await response.text();
  for (const path of ["/cart", "/success", "/api/"]) {
    expect(robots).toContain(`Disallow: ${path}`);
  }
  expect(robots).toMatch(/^Sitemap: https:\/\/\S+\/sitemap\.xml$/m);
});

test("every sitemap URL is an indexed page that loads", async ({ request }) => {
  const site = await siteUrl(request);
  const xml = await (await request.get("/sitemap.xml")).text();
  const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, url]) => {
    expect(url.startsWith(site)).toBe(true);
    return url.slice(site.length);
  });
  expect(paths).toEqual(INDEXED);
  expect(xml).not.toContain("lastmod");
  for (const path of paths) {
    expect((await request.get(path)).status(), path).toBe(200);
  }
});

test("each page has one canonical link on the site URL, unique titles and the right robots tag", async ({
  page,
  request,
}) => {
  const site = await siteUrl(request);
  const titles = new Set();
  for (const path of [...INDEXED, ...NOT_INDEXED]) {
    await page.goto(path);
    await page.waitForLoadState("networkidle");
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical, path).toHaveCount(1);
    await expect(canonical, path).toHaveAttribute("href", `${site}${path}`);
    await expect(page.locator('meta[name="description"]')).toHaveCount(1);
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
      "content",
      `${site}${path}`,
    );
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      "content",
      `${site}/og-eon.jpg`,
    );
    const robots = page.locator('meta[name="robots"]');
    if (NOT_INDEXED.includes(path)) {
      await expect(robots, path).toHaveAttribute("content", "noindex");
    } else {
      await expect(robots, path).toHaveCount(0);
    }
    const title = await page.title();
    expect(title, path).toMatch(/Eon Candles$/);
    titles.add(title);
  }
  expect(titles.size).toBe(INDEXED.length + NOT_INDEXED.length);
});

test("the product title names the candle", async ({ page }) => {
  await page.goto("/shop/love");
  await expect(page).toHaveTitle("Love candle | Eon Candles");
  await page.goto("/");
  await expect(page).toHaveTitle("Eon Candles");
});

test("the social card image is a 1200 x 630 JPEG", async ({ page }) => {
  const response = await page.goto("/og-eon.jpg");
  expect(response.headers()["content-type"]).toBe("image/jpeg");
  const size = await page.evaluate(() => {
    const img = document.querySelector("img");
    return [img.naturalWidth, img.naturalHeight];
  });
  expect(size).toEqual([1200, 630]);
});

test.describe("missing pages", () => {
  test.use({ allowedConsole: [/status of 404/] });

  test("have no canonical link", async ({ page }) => {
    await page.goto("/nope");
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
  });
});
