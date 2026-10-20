import { test, expect } from "./fixtures";

test("the document has one html and body, in NZ English", async ({ page }) => {
  await page.goto("/");
  expect(await page.locator("html").getAttribute("lang")).toBe("en-NZ");
  expect(await page.locator("html").count()).toBe(1);
  expect(await page.locator("body").count()).toBe(1);
  expect(await page.locator('meta[name="viewport"]').count()).toBe(1);
});

test("a direct visit to /success leaves the cart alone", async ({ page }) => {
  await page.goto("/shop/love");
  await page.getByRole("button", { name: /add to cart/i }).click();
  await page.goto("/success");
  await page.waitForLoadState("networkidle");
  await expect(page.getByRole("link", { name: "Cart, 1 item" })).toBeVisible();
  expect(
    await page.evaluate(() => JSON.parse(localStorage.getItem("eon-cart"))),
  ).toEqual({ v: 2, lines: { love: 1 } });
});

test("there is exactly one cart link, named with the item count", async ({
  page,
}) => {
  await page.goto("/shop");
  await expect(page.getByRole("link", { name: /^Cart,/ })).toHaveCount(1);
  await expect(page.getByRole("link", { name: "Cart, 0 items" })).toBeVisible();
});

test.describe("mobile menu", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("the toggle reports its state and a link closes the menu", async ({
    page,
  }) => {
    await page.goto("/");
    const toggle = page.getByRole("button", { name: "Menu" });
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await page
      .locator("#site-menu")
      .getByRole("link", { name: "Shop" })
      .click();
    await expect(page).toHaveURL(/\/shop$/);
    await expect(page.locator("#site-menu")).toBeHidden();
  });
});

test("pages send a strict Content-Security-Policy", async ({ page }) => {
  const response = await page.goto("/shop/love");
  const headers = response.headers();
  const scriptSrc = headers["content-security-policy"]
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith("script-src"));
  expect(scriptSrc).toBe("script-src 'self'");
  expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(headers["x-powered-by"]).toBeUndefined();
});
