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

const quantityOf = (page, name) =>
  page.getByRole("group", { name: `Quantity of ${name}` }).locator("output");

const summary = (page) => page.getByRole("region", { name: "Order summary" });

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
  await expect(quantityOf(page, "Dreams")).toHaveText("1");
});

test("an old saved cart is migrated by candle name", async ({ page }) => {
  await seed(page, "cart", LEGACY_CART);
  await page.goto("/cart");
  await expect(page.locator("main")).toContainText(/love/i);
  await expect(quantityOf(page, "Love")).toHaveText("2");
  expect(await savedCart(page)).toEqual({ v: 2, lines: { love: 2 } });
  expect(await page.evaluate(() => localStorage.getItem("cart"))).toBeNull();
});

test("a corrupt saved cart loads as an empty cart", async ({ page }) => {
  await seed(page, "cart", '{"cartCount":2}');
  await page.goto("/cart");
  await expect(page.locator("main")).toContainText(/empty/i);
});

test("the cart shows line totals, NZ shipping and the total", async ({
  page,
}) => {
  await seed(
    page,
    "eon-cart",
    JSON.stringify({ v: 2, lines: { love: 2, dreams: 1 } }),
  );
  await page.goto("/cart");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Your cart");
  await expect(page.locator("main")).toContainText("3 items");
  await expect(page.getByRole("link", { name: "Love" })).toHaveAttribute(
    "href",
    "/shop/love",
  );
  await expect(page.locator("main")).toContainText("$40.00");
  await expect(summary(page)).toContainText("Subtotal$60.00");
  await expect(summary(page)).toContainText(
    "Shipping (New Zealand only, 1 to 3 business days)$5.00",
  );
  await expect(summary(page)).toContainText("Total (NZD)$65.00");
});

test("changing a quantity in the cart updates the totals", async ({ page }) => {
  await seed(page, "eon-cart", JSON.stringify({ v: 2, lines: { love: 1 } }));
  await page.goto("/cart");
  await expect(page.locator("main")).toContainText("1 item");
  await expect(page.locator("main")).not.toContainText("1 items");
  await page
    .getByRole("button", { name: "Increase quantity of Love candle" })
    .click();
  await expect(quantityOf(page, "Love")).toHaveText("2");
  await expect(page.locator("main")).toContainText("2 items");
  await expect(summary(page)).toContainText("Total (NZD)$45.00");
  expect(await savedCart(page)).toEqual({ v: 2, lines: { love: 2 } });
  await expect(page.getByRole("link", { name: "Cart, 2 items" })).toBeVisible();
});

test("an empty cart offers the four candles", async ({ page }) => {
  await page.goto("/cart");
  await expect(page.locator("main")).toContainText("Your cart is empty.");
  await expect(
    page
      .locator("main")
      .getByRole("link", { name: /^(Love|Happiness|Dreams|Summer)$/ }),
  ).toHaveCount(4);
});

test("a change in another tab shows up in this one", async ({
  page,
  context,
}) => {
  await page.goto("/cart");
  await expect(page.locator("main")).toContainText("Your cart is empty.");
  const other = await context.newPage();
  await other.goto("/shop/summer");
  await other.getByRole("button", { name: "Add to cart" }).click();
  await expect(page.getByRole("link", { name: "Summer" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Cart, 1 item" })).toBeVisible();
  await other.close();
});

test("Remove takes the whole line away", async ({ page }) => {
  await seed(
    page,
    "eon-cart",
    JSON.stringify({ v: 2, lines: { love: 3, summer: 1 } }),
  );
  await page.goto("/cart");
  await page.getByRole("button", { name: "Remove Love candle" }).click();
  await expect(page.getByRole("link", { name: "Love" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Summer" })).toBeVisible();
  expect(await savedCart(page)).toEqual({ v: 2, lines: { summer: 1 } });
});
