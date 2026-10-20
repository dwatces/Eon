import { test, expect } from "./fixtures";

test("demo checkout prices the cart on the server and takes no payment", async ({
  page,
}) => {
  await page.goto("/shop/love");
  await page.getByRole("button", { name: /add to cart/i }).click();
  await page.goto("/cart");
  await expect(page.locator("main")).toContainText(/love/i);

  const response = page.waitForResponse("**/api/checkout_sessions");
  await page.getByRole("button", { name: /checkout/i }).click();
  expect((await response).status()).toBe(200);

  const status = page.getByRole("status");
  await expect(status).toContainText("$25.00 in total");
  await expect(status).toContainText("No payment was taken");
  await expect(page).toHaveURL(/\/cart$/);
});

test("the checkout API only accepts POST", async ({ request }) => {
  const response = await request.get("/api/checkout_sessions");
  expect(response.status()).toBe(405);
  expect(response.headers()["allow"]).toBe("POST");
});
