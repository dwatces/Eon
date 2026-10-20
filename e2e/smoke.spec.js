import { test, expect } from "./fixtures";

const routes = [
  "/",
  "/shop",
  "/shop/love",
  "/shop/happiness",
  "/shop/dreams",
  "/shop/summer",
  "/about",
  "/cart",
  "/success",
];

for (const path of routes) {
  test(`${path} renders without errors or horizontal scroll`, async ({
    page,
  }) => {
    const response = await page.goto(path);
    expect(response.status()).toBe(200);
    await page.waitForLoadState("networkidle");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    expect(overflow).toBe(false);
    await expect(page.locator("footer")).toContainText(
      "This is a portfolio demo shop: no real orders or payments are taken.",
    );
  });
}

test.describe("missing pages", () => {
  test.use({ allowedConsole: [/status of 404/] });

  for (const path of ["/nope", "/shop/hapiness", "/shop/unknown"]) {
    test(`${path} returns 404`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response.status()).toBe(404);
    });
  }

  test("the 404 page has a heading, a way home and a noindex tag", async ({
    page,
  }) => {
    await page.goto("/nope");
    const main = page.getByRole("main");
    await expect(main.getByRole("heading", { level: 1 })).toHaveText(
      "Page not found",
    );
    await expect(main.getByRole("link", { name: "Home" })).toHaveAttribute(
      "href",
      "/",
    );
    await expect(
      main.getByRole("link", { name: "Shop the candles" }),
    ).toHaveAttribute("href", "/shop");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      "noindex",
    );
    await expect(page.locator("footer")).toBeVisible();
  });
});

const candles = [
  ["love", "Love"],
  ["happiness", "Happiness"],
  ["dreams", "Dreams"],
  ["summer", "Summer"],
];

for (const [slug, name] of candles) {
  test(`/shop/${slug} has one visible h1, the candle's name`, async ({
    page,
  }) => {
    await page.goto(`/shop/${slug}`);
    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText(name);
    await expect(h1).toBeVisible();
  });
}

test("the shop and home page each list the four candles once", async ({
  page,
}) => {
  for (const path of ["/shop", "/"]) {
    await page.goto(path);
    const links = page
      .locator("main")
      .getByRole("link", { name: /^(Love|Happiness|Dreams|Summer)$/ });
    await expect(links).toHaveText(["Love", "Happiness", "Dreams", "Summer"]);
    await expect(links.first()).toHaveAttribute("href", "/shop/love");
  }
});

test("product pages show the catalogue price and a visible h1", async ({
  page,
}) => {
  await page.goto("/shop/summer");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Summer");
  await expect(page.locator("main")).toContainText("$20.00");
  await expect(page.locator("main")).not.toContainText("$30");
});
