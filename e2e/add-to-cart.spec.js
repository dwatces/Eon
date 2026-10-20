import { test, expect } from "./fixtures";

const message = (page) =>
  page.locator("main div[role=status]").filter({ hasText: /\S/ });

test("adding confirms, updates the badge and allows another add", async ({
  page,
}) => {
  await page.goto("/shop/love");
  await page.getByRole("button", { name: "Increase quantity" }).click();
  await page.getByRole("button", { name: "Add to cart" }).click();
  await expect(message(page)).toContainText(
    "Added 2 Love candles to your cart.",
  );
  await expect(page.getByRole("link", { name: "Cart, 2 items" })).toBeVisible();

  await page.getByRole("button", { name: "Decrease quantity" }).click();
  await page.getByRole("button", { name: "Add to cart" }).click();
  await expect(message(page)).toContainText(
    "Added 1 Love candle to your cart.",
  );
  await expect(page.getByRole("link", { name: "Cart, 3 items" })).toBeVisible();

  await message(page).getByRole("link", { name: "View cart" }).click();
  await expect(page).toHaveURL(/\/cart$/);
  expect(
    await page.evaluate(() => JSON.parse(localStorage.getItem("eon-cart"))),
  ).toEqual({ v: 2, lines: { love: 3 } });
});

test("the quantity stops at 10", async ({ page }) => {
  await page.goto("/shop/dreams");
  const increase = page.getByRole("button", { name: "Increase quantity" });
  for (let i = 0; i < 9; i++) await increase.click();
  await expect(page.getByRole("group", { name: "Quantity" })).toContainText(
    "10",
  );
  await expect(increase).toBeDisabled();
  // A forced click at the limit changes nothing.
  await increase.click({ force: true });
  await expect(page.getByRole("group", { name: "Quantity" })).toContainText(
    "10",
  );
  await expect(
    page.getByRole("button", { name: "Decrease quantity" }),
  ).toBeEnabled();
});

test("a keyboard-only add works", async ({ page }) => {
  await page.goto("/shop/summer");
  await page.getByRole("button", { name: "Decrease quantity" }).focus();
  await page.keyboard.press("Tab");
  await page.keyboard.press("Space");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Enter");
  await expect(message(page)).toContainText(
    "Added 2 Summer candles to your cart.",
  );
});

test("the message says when the order limit applies", async ({ page }) => {
  await page.addInitScript(() => {
    if (!sessionStorage.getItem("seeded")) {
      localStorage.setItem(
        "eon-cart",
        JSON.stringify({ v: 2, lines: { happiness: 9 } }),
      );
      sessionStorage.setItem("seeded", "1");
    }
  });
  await page.goto("/shop/happiness");
  await page.getByRole("button", { name: "Increase quantity" }).click();
  await page.getByRole("button", { name: "Add to cart" }).click();
  await expect(message(page)).toContainText(
    "Added 1 Happiness candle. Your cart now has 10, the most for one order.",
  );
  await expect(
    page.getByRole("link", { name: "Cart, 10 items" }),
  ).toBeVisible();
});

test("every product page says the shop is a demo", async ({ page }) => {
  await page.goto("/shop/love");
  await expect(page.locator("main")).toContainText(
    "Demo shop: no real orders or payments are taken.",
  );
});
