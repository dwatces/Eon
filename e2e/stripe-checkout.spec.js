import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { test, expect } from "./fixtures";
import { axeViolations } from "./axe";
import {
  STUB_SESSION_ID,
  STUB_SESSION_URL,
  startStripeStub,
} from "../tests/helpers/stripe-stub.mjs";

// Stripe test mode, end to end, without Stripe. A second server runs the
// same production build with a test key and EON_STRIPE_API_BASE pointing
// at a local stub, so the real Stripe SDK in the API route sends its
// request to the stub. The browser's visit to Stripe Checkout is answered
// locally by the stubbedHosts fixture. Nothing leaves the machine.

const PORT = Number(process.env.E2E_STRIPE_PORT || 7305);
const STUB_PORT = Number(process.env.E2E_STRIPE_STUB_PORT || 7309);
const BASE = `http://127.0.0.1:${PORT}`;

test.use({ baseURL: BASE, stubbedHosts: ["checkout.stripe.com"] });

let stub;
let server;

async function waitForServer(url, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(url);
      if (res.status === 405) return;
    } catch {
      // not listening yet
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`The Stripe-mode server did not start on ${url}`);
}

test.beforeAll(async () => {
  // The flow is the same at every width, so it runs once.
  test.skip(test.info().project.name !== "desktop");
  test.setTimeout(90_000);
  stub = await startStripeStub({ port: STUB_PORT });
  const log = fs.openSync(test.info().outputPath("stripe-server.log"), "w");
  server = spawn(
    process.execPath,
    [
      path.join("node_modules", "next", "dist", "bin", "next"),
      "start",
      "-H",
      "127.0.0.1",
      "-p",
      String(PORT),
    ],
    {
      env: {
        ...process.env,
        STRIPE_SECRET_KEY: "sk_test_local_stub_only",
        EON_ALLOW_LIVE_PAYMENTS: "",
        EON_STRIPE_API_BASE: stub.url,
      },
      stdio: ["ignore", log, log],
      detached: true,
    },
  );
  await waitForServer(`${BASE}/api/checkout_sessions`, 60_000);
});

test.afterAll(async () => {
  if (server?.pid) {
    try {
      process.kill(-server.pid, "SIGTERM");
    } catch {
      // already gone
    }
  }
  await stub?.close();
});

test.beforeEach(async ({ page }) => {
  stub.requests.length = 0;
  stub.setMode("ok");
  await page.addInitScript(() => {
    if (!sessionStorage.getItem("seeded")) {
      localStorage.setItem(
        "eon-cart",
        JSON.stringify({ v: 2, lines: { love: 2, summer: 1 } }),
      );
      sessionStorage.setItem("seeded", "1");
    }
  });
});

test("with a Stripe test key, checkout hands off to Stripe with server prices", async ({
  page,
}) => {
  await page.goto("/cart");
  await expect(page.locator("main")).toContainText(
    "This shop is a portfolio demo. Checkout takes no real payment.",
  );
  await page.getByRole("button", { name: /checkout/i }).click();
  await expect(page).toHaveURL(STUB_SESSION_URL);

  expect(stub.requests).toHaveLength(1);
  const [sent] = stub.requests;
  expect(sent).toMatchObject({
    method: "POST",
    path: "/v1/checkout/sessions",
    auth: "present",
  });
  expect(sent.form).toMatchObject({
    "line_items[0][price_data][product_data][name]": "Love candle",
    "line_items[0][price_data][unit_amount]": "2000",
    "line_items[0][quantity]": "2",
    "line_items[1][price_data][product_data][name]": "Summer candle",
    "line_items[1][quantity]": "1",
    "shipping_options[0][shipping_rate_data][fixed_amount][amount]": "500",
    "shipping_address_collection[allowed_countries][0]": "NZ",
    success_url: `${BASE}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${BASE}/cart`,
  });

  // Coming back without paying (Stripe's cancel link) finds the cart as
  // it was: nothing is emptied until an order is confirmed.
  await page.goto("/cart");
  await expect(page.getByRole("link", { name: "Cart, 3 items" })).toBeVisible();
});

test("if Stripe rejects the key, checkout falls back to the demo summary", async ({
  page,
}) => {
  stub.setMode("auth");
  await page.goto("/cart");
  await page.getByRole("button", { name: /checkout/i }).click();
  await expect(page).toHaveURL(/\/success\?demo=1$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Demo order summary",
  );
  await expect(
    page.getByRole("table", { name: "Your demo order" }),
  ).toContainText("Total (NZD)$65.00");
  expect(stub.requests).toHaveLength(1);
});

test("back from a paid Stripe checkout, the order is checked, then the cart empties", async ({
  page,
}) => {
  // Stripe's success URL. The page asks the server, the server asks the
  // stub, and the stub says this session is complete and paid.
  await page.goto(`/success?session_id=${STUB_SESSION_ID}`);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Thank you");
  await expect(page.locator("main")).toContainText(
    "Stripe has confirmed your test payment of $65.00 NZD.",
  );
  await expect(page.getByRole("link", { name: "Cart, 0 items" })).toBeVisible();
  expect(stub.requests).toEqual([
    expect.objectContaining({
      method: "GET",
      path: `/v1/checkout/sessions/${STUB_SESSION_ID}`,
    }),
  ]);
  expect(await axeViolations(page)).toEqual([]);
});

test.describe("when the order can't be confirmed", () => {
  // The order check answers 404 for an unknown session and 502 when Stripe
  // fails, and Chrome logs every failed request as a console error.
  test.use({ allowedConsole: [/status of (404|502)/] });

  test("a forged session id thanks nobody and leaves the cart alone", async ({
    page,
  }) => {
    await page.goto("/success?session_id=cs_test_forgedbyverifier");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "We couldn't confirm this order",
    );
    // Every response is read to the end, so the page settles.
    await page.waitForLoadState("networkidle", { timeout: 5000 });
    await expect(page.locator("main")).not.toContainText("Thank you");
    await expect(
      page.getByRole("link", { name: "Cart, 3 items" }),
    ).toBeVisible();
    expect(stub.requests).toHaveLength(1);
    expect(await axeViolations(page)).toEqual([]);

    // The cart is still there after a reload.
    await page.goto("/cart");
    await expect(
      page.getByRole("link", { name: "Cart, 3 items" }),
    ).toBeVisible();
  });

  test("if Stripe can't be reached, the order page says so and keeps the cart", async ({
    page,
  }) => {
    stub.setMode("error");
    await page.goto(`/success?session_id=${STUB_SESSION_ID}`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "We couldn't check your order",
    );
    await expect(
      page.getByRole("link", { name: "Cart, 3 items" }),
    ).toBeVisible();
    expect(await axeViolations(page)).toEqual([]);

    stub.setMode("ok");
    await page.getByRole("button", { name: "Try again" }).click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Thank you",
    );
    await expect(
      page.getByRole("link", { name: "Cart, 0 items" }),
    ).toBeVisible();
  });
});
