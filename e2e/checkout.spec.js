import { test, expect } from "./fixtures";

const checkoutButton = (page) =>
  page.getByRole("button", { name: /checkout/i });

// Two Love candles in the cart through the shop itself.
async function fillCart(page) {
  await page.goto("/shop/love");
  await page.getByRole("button", { name: "Increase quantity" }).click();
  await page.getByRole("button", { name: "Add to cart" }).click();
  await expect(page.getByRole("link", { name: "Cart, 2 items" })).toBeVisible();
  await page.goto("/cart");
  await expect(checkoutButton(page)).toBeEnabled();
}

test("demo checkout shows the server's order summary and empties the cart", async ({
  page,
}) => {
  await fillCart(page);
  await expect(page.locator("main")).toContainText(
    "This shop is a portfolio demo. Checkout takes no real payment.",
  );

  const response = page.waitForResponse("**/api/checkout_sessions");
  const started = Date.now();
  await checkoutButton(page).click();
  expect((await response).status()).toBe(200);
  await expect(page).toHaveURL(/\/success\?demo=1$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Demo order summary",
  );
  expect(Date.now() - started).toBeLessThan(1000);

  const summary = page.getByRole("table", { name: "Your demo order" });
  await expect(summary.getByRole("row", { name: /Love/ })).toContainText(
    "2$40.00",
  );
  await expect(summary).toContainText("Subtotal$40.00");
  await expect(summary).toContainText("Shipping (New Zealand)$5.00");
  await expect(summary).toContainText("Total (NZD)$45.00");
  await expect(page.locator("main")).toContainText(
    "This is a portfolio demo. No payment was taken and no order was placed.",
  );
  await expect(page.getByRole("link", { name: "Cart, 0 items" })).toBeVisible();

  // A reload shows the summary again but never empties a newer cart.
  await page.goto("/shop/dreams");
  await page.getByRole("button", { name: "Add to cart" }).click();
  await page.goto("/success?demo=1");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Demo order summary",
  );
  await expect(page.getByRole("link", { name: "Cart, 1 item" })).toBeVisible();
});

test.describe("when the checkout API fails", () => {
  test.use({ allowedConsole: [/status of 500/] });

  test("an alert explains it and the button works again", async ({ page }) => {
    await fillCart(page);
    await page.route("**/api/checkout_sessions", (route) =>
      route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ error: "Boom" }),
      }),
    );
    await checkoutButton(page).click();
    await expect(page.locator("main").getByRole("alert")).toContainText(
      "We couldn't start checkout. Nothing was charged.",
    );
    await expect(checkoutButton(page)).toBeEnabled();
    await expect(checkoutButton(page)).toHaveText("Checkout");
    await expect(page).toHaveURL(/\/cart$/);
  });
});

test("the button is busy while checkout starts, and only one request is sent", async ({
  page,
}) => {
  await fillCart(page);
  let requests = 0;
  let release;
  const held = new Promise((resolve) => (release = resolve));
  await page.route("**/api/checkout_sessions", async (route) => {
    requests += 1;
    await held;
    await route.continue();
  });
  await checkoutButton(page).click();
  await expect(checkoutButton(page)).toBeDisabled();
  await expect(checkoutButton(page)).toHaveAttribute("aria-busy", "true");
  await expect(checkoutButton(page)).toHaveText("Starting checkout…");
  await checkoutButton(page).click({ force: true });
  release();
  await expect(page).toHaveURL(/\/success\?demo=1$/);
  expect(requests).toBe(1);
});

test("a checkout URL that isn't Stripe's is refused", async ({ page }) => {
  await fillCart(page);
  await page.route("**/api/checkout_sessions", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ mode: "stripe", url: "https://evil.example/pay" }),
    }),
  );
  await checkoutButton(page).click();
  await expect(page.locator("main").getByRole("alert")).toContainText(
    "We couldn't start checkout.",
  );
  await expect(page).toHaveURL(/\/cart$/);
});

test("with storage blocked, the demo summary shows on the cart page", async ({
  page,
}) => {
  await fillCart(page);
  await page.evaluate(() => {
    Object.defineProperty(window, "sessionStorage", {
      configurable: true,
      get() {
        throw new DOMException("Blocked", "SecurityError");
      },
    });
  });
  await checkoutButton(page).click();
  await expect(
    page.getByRole("table", { name: "Demo order summary" }),
  ).toContainText("Total (NZD)$45.00");
  await expect(page.locator("main")).toContainText("No payment was taken");
  await expect(page).toHaveURL(/\/cart$/);
});

test("a direct visit to /success shows no order and keeps the cart", async ({
  page,
}) => {
  await fillCart(page);
  for (const path of ["/success", "/success?demo=1"]) {
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "There's no order to show here",
    );
    await expect(
      page.getByRole("link", { name: "Cart, 2 items" }),
    ).toBeVisible();
  }
});

test.describe("a typed-in Stripe session id in demo mode", () => {
  // The order check answers 404, which Chrome logs as a console error.
  test.use({ allowedConsole: [/status of 404/] });

  test("is checked with the server, thanks nobody and keeps the cart", async ({
    page,
  }) => {
    await fillCart(page);
    const check = page.waitForResponse("**/api/checkout_sessions/cs_test_*");
    await page.goto("/success?session_id=cs_test_a1B2c3");
    expect((await check).status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "We couldn't confirm this order",
    );
    await expect(page.locator("main")).not.toContainText("Thank you");
    await expect(
      page.getByRole("link", { name: "Cart, 2 items" }),
    ).toBeVisible();
  });
});

test("the checkout API only accepts POST", async ({ request }) => {
  const response = await request.get("/api/checkout_sessions");
  expect(response.status()).toBe(405);
  expect(response.headers()["allow"]).toBe("POST");
});
