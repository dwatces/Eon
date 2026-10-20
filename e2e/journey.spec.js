import { test, expect } from "./fixtures";

// The whole shopping journey, by clicking only, from the home page to the
// demo order summary and back to an empty cart.

test("a shopper browses, adds candles, checks out in demo mode and ends with an empty cart", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Shop the candles" }).click();
  await expect(page).toHaveURL(/\/shop$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Our candles",
  );

  await page.getByRole("link", { name: "Happiness", exact: true }).click();
  await expect(page).toHaveURL(/\/shop\/happiness$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Happiness");
  await page.getByRole("button", { name: "Increase quantity" }).click();
  await page.getByRole("button", { name: "Add to cart" }).click();
  const status = page.locator("main div[role=status]");
  await expect(status).toContainText("Added 2 Happiness candles");
  await expect(page.getByRole("link", { name: "Cart, 2 items" })).toBeVisible();

  // A second candle from the "More candles" list on the product page.
  await page
    .getByRole("region", { name: "More candles" })
    .getByRole("link", { name: "Summer", exact: true })
    .click();
  await expect(page).toHaveURL(/\/shop\/summer$/);
  await page.getByRole("button", { name: "Add to cart" }).click();
  await expect(status).toContainText("Added 1 Summer candle");
  await status.getByRole("link", { name: "View cart" }).click();

  await expect(page).toHaveURL(/\/cart$/);
  const summary = page.getByRole("region", { name: "Order summary" });
  await expect(summary).toContainText("Subtotal$60.00");
  await expect(summary).toContainText("Total (NZD)$65.00");

  await page.getByRole("button", { name: /checkout/i }).click();
  await expect(page).toHaveURL(/\/success\?demo=1$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Demo order summary",
  );
  const order = page.getByRole("table", { name: "Your demo order" });
  await expect(order.getByRole("row", { name: /Happiness/ })).toContainText(
    "2$40.00",
  );
  await expect(order.getByRole("row", { name: /Summer/ })).toContainText(
    "1$20.00",
  );
  await expect(order).toContainText("Total (NZD)$65.00");
  await expect(page.locator("main")).toContainText("No payment was taken");

  await page.getByRole("link", { name: "Cart, 0 items" }).click();
  await expect(page).toHaveURL(/\/cart$/);
  await expect(page.locator("main")).toContainText("Your cart is empty.");
});
