import { test, expect } from "./fixtures";

const LEGACY_CART = JSON.stringify({
  cartDetails: {
    price_1KTa4GIILjXbtSkjqSx6HWRR: {
      id: "price_1KTa4GIILjXbtSkjqSx6HWRR",
      name: "love",
      price: "$20",
      currency: "NZD",
      quantity: 2,
    },
  },
  cartCount: 2,
  totalPrice: null,
});

const seed = (page, key, value) =>
  page.addInitScript(
    ([k, v]) => {
      if (!sessionStorage.getItem("seeded")) {
        localStorage.setItem(k, v);
        sessionStorage.setItem("seeded", "1");
      }
    },
    [key, value],
  );

const savedCart = (page) =>
  page.evaluate(() => JSON.parse(localStorage.getItem("eon-cart")));

test("adding the same candle twice gives quantity 2", async ({ page }) => {
  for (let i = 0; i < 2; i++) {
    await page.goto("/shop/love");
    await page.getByRole("button", { name: /add to cart/i }).click();
  }
  await expect
    .poll(() => savedCart(page))
    .toEqual({ v: 2, lines: { love: 2 } });
});

test("the cart survives a reload", async ({ page }) => {
  await page.goto("/shop/dreams");
  await page.getByRole("button", { name: /add to cart/i }).click();
  await page.goto("/cart");
  await expect(page.locator("main")).toContainText(/dreams/i);
  await page.reload();
  await expect(page.locator("main")).toContainText(/dreams/i);
  await expect(page.locator("main")).toContainText("Quantity: 1");
});

test("an old saved cart is migrated by candle name", async ({ page }) => {
  await seed(page, "cart", LEGACY_CART);
  await page.goto("/cart");
  await expect(page.locator("main")).toContainText(/love/i);
  await expect(page.locator("main")).toContainText("Quantity: 2");
  expect(await savedCart(page)).toEqual({ v: 2, lines: { love: 2 } });
  expect(await page.evaluate(() => localStorage.getItem("cart"))).toBeNull();
});

test("a corrupt saved cart loads as an empty cart", async ({ page }) => {
  await seed(page, "cart", '{"cartCount":2}');
  await page.goto("/cart");
  await expect(page.locator("main")).toContainText(/empty/i);
});

test("Remove takes the whole line away", async ({ page }) => {
  await seed(
    page,
    "eon-cart",
    JSON.stringify({ v: 2, lines: { love: 3, summer: 1 } }),
  );
  await page.goto("/cart");
  await page.getByRole("button", { name: "Remove Love candle" }).click();
  await expect(page.locator("main")).not.toContainText(/love/i);
  await expect(page.locator("main")).toContainText(/summer/i);
});
