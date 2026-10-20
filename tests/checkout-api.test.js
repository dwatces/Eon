import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createMocks } from "node-mocks-http";
import { setCheckoutEnv } from "./helpers/env.js";

const create = vi.fn();
const StripeCtor = vi.fn(function Stripe() {
  return { checkout: { sessions: { create } } };
});
vi.mock("stripe", () => ({ default: StripeCtor }));

const { default: handler, config } =
  await import("../pages/api/checkout_sessions.js");

const STRIPE_URL = "https://checkout.stripe.com/c/pay/cs_test_123";

async function call({
  method = "POST",
  body = { items: [{ slug: "love", quantity: 2 }] },
  headers = {},
} = {}) {
  const { req, res } = createMocks({
    method,
    body,
    headers: {
      host: "127.0.0.1:7301",
      "content-type": "application/json",
      ...headers,
    },
  });
  await handler(req, res);
  const raw = res._getData();
  return {
    status: res._getStatusCode(),
    headers: res._getHeaders(),
    raw: typeof raw === "string" ? raw : JSON.stringify(raw),
    json: res._isJSON() ? res._getJSONData() : null,
  };
}

let restoreEnv;
let warn;
let error;
beforeEach(() => {
  create.mockReset();
  create.mockResolvedValue({
    id: "cs_test_123",
    url: STRIPE_URL,
    customer_email: "a@b.c",
  });
  StripeCtor.mockClear();
  warn = vi.spyOn(console, "warn").mockImplementation(() => {});
  error = vi.spyOn(console, "error").mockImplementation(() => {});
});
afterEach(() => restoreEnv?.());

describe("POST /api/checkout_sessions", () => {
  it("limits the request body to 8 kB", () => {
    expect(config.api.bodyParser.sizeLimit).toBe("8kb");
  });

  it("rejects other methods with 405 JSON and Allow: POST", async () => {
    restoreEnv = setCheckoutEnv({});
    for (const method of ["GET", "PUT", "DELETE"]) {
      const r = await call({ method });
      expect(r.status).toBe(405);
      expect(r.headers.allow).toBe("POST");
      expect(r.json).toEqual({ error: expect.any(String) });
    }
  });

  it("rejects bodies that are not JSON with 415", async () => {
    restoreEnv = setCheckoutEnv({});
    const r = await call({
      headers: { "content-type": "application/x-www-form-urlencoded" },
    });
    expect(r.status).toBe(415);
    const missing = await call({ headers: { "content-type": "" } });
    expect(missing.status).toBe(415);
  });

  it("never lets the response be cached", async () => {
    restoreEnv = setCheckoutEnv({});
    expect((await call()).headers["cache-control"]).toBe("no-store");
    expect((await call({ method: "GET" })).headers["cache-control"]).toBe(
      "no-store",
    );
  });

  it("returns a demo order priced on the server when no key is set", async () => {
    restoreEnv = setCheckoutEnv({});
    const r = await call();
    expect(r.status).toBe(200);
    expect(r.json).toEqual({
      mode: "demo",
      order: {
        lines: [
          {
            slug: "love",
            name: "Love",
            quantity: 2,
            unitAmount: 2000,
            lineTotal: 4000,
          },
        ],
        subtotal: 4000,
        shipping: 500,
        total: 4500,
        currency: "NZD",
      },
    });
    expect(StripeCtor).not.toHaveBeenCalled();
  });

  it("treats a blank key as demo mode", async () => {
    restoreEnv = setCheckoutEnv({ STRIPE_SECRET_KEY: "   " });
    const r = await call();
    expect(r.json.mode).toBe("demo");
    expect(StripeCtor).not.toHaveBeenCalled();
  });

  it("stays in demo mode with a live key and no opt-in, warns once and never logs the key", async () => {
    restoreEnv = setCheckoutEnv({ STRIPE_SECRET_KEY: "sk_live_canary123" });
    const r = await call();
    expect(r.json.mode).toBe("demo");
    expect(StripeCtor).not.toHaveBeenCalled();
    expect(warn).toHaveBeenCalledTimes(1);
    expect(String(warn.mock.calls[0][0])).not.toContain("sk_");
    expect(String(warn.mock.calls[0][0])).toContain("EON_ALLOW_LIVE_PAYMENTS");

    // Later checkouts on the same server stay quiet.
    const again = await call();
    expect(again.json.mode).toBe("demo");
    expect(warn).toHaveBeenCalledTimes(1);
  });

  it("creates an NZ-only Stripe session with server prices for a test key", async () => {
    restoreEnv = setCheckoutEnv({ STRIPE_SECRET_KEY: "sk_test_canary123" });
    const r = await call({
      body: {
        items: [
          { slug: "love", quantity: 2 },
          { slug: "dreams", quantity: 1 },
        ],
      },
    });
    expect(r.status).toBe(200);
    expect(Object.keys(r.json)).toEqual(["mode", "url"]);
    expect(r.json).toEqual({ mode: "stripe", url: STRIPE_URL });
    expect(StripeCtor).toHaveBeenCalledTimes(1);
    expect(create).toHaveBeenCalledTimes(1);
    expect(create.mock.calls[0][0]).toMatchInlineSnapshot(`
      {
        "billing_address_collection": "auto",
        "cancel_url": "http://127.0.0.1:7301/cart",
        "line_items": [
          {
            "price_data": {
              "currency": "nzd",
              "product_data": {
                "name": "Love candle",
              },
              "unit_amount": 2000,
            },
            "quantity": 2,
          },
          {
            "price_data": {
              "currency": "nzd",
              "product_data": {
                "name": "Dreams candle",
              },
              "unit_amount": 2000,
            },
            "quantity": 1,
          },
        ],
        "mode": "payment",
        "shipping_address_collection": {
          "allowed_countries": [
            "NZ",
          ],
        },
        "shipping_options": [
          {
            "shipping_rate_data": {
              "delivery_estimate": {
                "maximum": {
                  "unit": "business_day",
                  "value": 3,
                },
                "minimum": {
                  "unit": "business_day",
                  "value": 1,
                },
              },
              "display_name": "New Zealand",
              "fixed_amount": {
                "amount": 500,
                "currency": "nzd",
              },
              "type": "fixed_amount",
            },
          },
        ],
        "success_url": "http://127.0.0.1:7301/success?session_id={CHECKOUT_SESSION_ID}",
      }
    `);
  });

  it("accepts a restricted test key", async () => {
    restoreEnv = setCheckoutEnv({ STRIPE_SECRET_KEY: "rk_test_canary123" });
    expect((await call()).json.mode).toBe("stripe");
  });

  it("uses Stripe with a live key only when live payments are switched on", async () => {
    restoreEnv = setCheckoutEnv({
      STRIPE_SECRET_KEY: "sk_live_canary123",
      EON_ALLOW_LIVE_PAYMENTS: "true",
    });
    const r = await call();
    expect(r.json).toEqual({ mode: "stripe", url: STRIPE_URL });
    expect(StripeCtor).toHaveBeenCalledTimes(1);
  });

  it("builds return URLs on the site URL when Origin and Host are not trusted", async () => {
    restoreEnv = setCheckoutEnv({ STRIPE_SECRET_KEY: "sk_test_canary123" });
    await call({
      headers: { host: "evil.example", origin: "https://evil.example" },
    });
    const params = create.mock.calls[0][0];
    expect(params.success_url).toBe(
      "https://eon-ht82.vercel.app/success?session_id={CHECKOUT_SESSION_ID}",
    );
    expect(params.cancel_url).toBe("https://eon-ht82.vercel.app/cart");
  });

  it.each([
    ["an unknown slug", { items: [{ slug: "hapiness", quantity: 1 }] }],
    [
      "a duplicate slug",
      {
        items: [
          { slug: "love", quantity: 1 },
          { slug: "love", quantity: 1 },
        ],
      },
    ],
    [
      "a client price",
      {
        items: [{ slug: "love", quantity: 1, price_data: { unit_amount: 1 } }],
      },
    ],
    ["a client amount", { items: [{ slug: "love", quantity: 1, amount: 1 }] }],
    [
      "a legacy price id",
      { items: [{ price: "price_1KTa4GIILjXbtSkjqSx6HWRR", quantity: 1 }] },
    ],
    ["quantity 0", { items: [{ slug: "love", quantity: 0 }] }],
    ["quantity 11", { items: [{ slug: "love", quantity: 11 }] }],
    ["quantity 1.5", { items: [{ slug: "love", quantity: 1.5 }] }],
    ['quantity "2"', { items: [{ slug: "love", quantity: "2" }] }],
    [
      "five lines",
      {
        items: ["love", "happiness", "dreams", "summer", "love"].map(
          (slug) => ({
            slug,
            quantity: 1,
          }),
        ),
      },
    ],
    ["items that are not an array", { items: { love: 1 } }],
    ["an empty cart", { items: [] }],
    [
      "an extra top-level field",
      { items: [{ slug: "love", quantity: 1 }], total: 1 },
    ],
    ["a null body", null],
    ["a string body", "items=love"],
  ])("rejects %s with 400", async (_label, body) => {
    restoreEnv = setCheckoutEnv({ STRIPE_SECRET_KEY: "sk_test_canary123" });
    const r = await call({ body });
    expect(r.status).toBe(400);
    expect(r.json).toEqual({ error: expect.any(String) });
    expect(create).not.toHaveBeenCalled();
  });

  it("falls back to demo when Stripe refuses the key", async () => {
    restoreEnv = setCheckoutEnv({ STRIPE_SECRET_KEY: "sk_test_canary123" });
    for (const type of ["StripeAuthenticationError", "StripePermissionError"]) {
      warn.mockClear();
      create.mockRejectedValueOnce(
        Object.assign(new Error("Invalid API Key provided: sk_test_****123"), {
          type,
        }),
      );
      const r = await call();
      expect(r.status).toBe(200);
      expect(r.json.mode).toBe("demo");
      expect(r.json.order.total).toBe(4500);
      expect(String(warn.mock.calls[0][0])).toContain(type);
      expect(String(warn.mock.calls[0][0])).not.toContain("sk_");
    }
  });

  it("returns a generic 502 for other Stripe errors without leaking details", async () => {
    restoreEnv = setCheckoutEnv({ STRIPE_SECRET_KEY: "sk_test_canary123" });
    create.mockRejectedValueOnce(
      Object.assign(new Error("Secret detail from Stripe sk_test_canary123"), {
        type: "StripeAPIError",
        code: "api_error",
      }),
    );
    const r = await call();
    expect(r.status).toBe(502);
    expect(r.json).toEqual({
      error: "We couldn't start checkout. Please try again.",
    });
    expect(r.raw).not.toContain("Secret detail");
    expect(r.raw).not.toContain("sk_");
    const logged = error.mock.calls.map((args) => args.join(" ")).join("\n");
    expect(logged).toContain("StripeAPIError");
    expect(logged).not.toContain("sk_");
    expect(logged).not.toContain("Secret detail");
  });

  it("returns a generic 502 when Stripe sends no checkout URL", async () => {
    restoreEnv = setCheckoutEnv({ STRIPE_SECRET_KEY: "sk_test_canary123" });
    create.mockResolvedValueOnce({ id: "cs_test_123" });
    const r = await call();
    expect(r.status).toBe(502);
    expect(r.json).toEqual({
      error: "We couldn't start checkout. Please try again.",
    });
  });

  it("never puts a key or session details in any response", async () => {
    restoreEnv = setCheckoutEnv({ STRIPE_SECRET_KEY: "sk_test_canary123" });
    const r = await call();
    expect(r.raw).not.toContain("sk_");
    expect(r.raw).not.toContain("customer_email");
    expect(r.json).not.toHaveProperty("id");
  });
});
