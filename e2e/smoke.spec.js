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

  test("an unknown path returns 404", async ({ page }) => {
    const response = await page.goto("/nope");
    expect(response.status()).toBe(404);
  });
});

test("product pages show the catalogue price and a visible h1", async ({
  page,
}) => {
  await page.goto("/shop/summer");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Summer");
  await expect(page.locator("main")).toContainText("$20.00");
  await expect(page.locator("main")).not.toContainText("$30");
});
