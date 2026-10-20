import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { createMocks } from "node-mocks-http";
import handler from "../pages/api/checkout_sessions.js";
import { setCheckoutEnv } from "./helpers/env.js";
import { STUB_SESSION_URL, startStripeStub } from "./helpers/stripe-stub.mjs";

// The checkout route with the real Stripe SDK (not a mock), pointed at a
// local stub through EON_STRIPE_API_BASE. This checks what the SDK really
// sends and how its real error types are handled. Nothing leaves the
// machine: the test network guard would fail the test if it did.

const TEST_KEY = "sk_test_local_stub_only";

let stub;
let restoreEnv;
beforeAll(async () => {
  stub = await startStripeStub();
});
afterAll(() => stub.close());
afterEach(() => {
  restoreEnv?.();
  stub.requests.length = 0;
  stub.setMode("ok");
});

async function checkout(items) {
  restoreEnv = setCheckoutEnv({
    STRIPE_SECRET_KEY: TEST_KEY,
    EON_STRIPE_API_BASE: stub.url,
  });
  const { req, res } = createMocks({
    method: "POST",
    body: { items },
    headers: { host: "127.0.0.1:7301", "content-type": "application/json" },
  });
  await handler(req, res);
  const raw = JSON.stringify(res._getJSONData());
  return { status: res._getStatusCode(), json: res._getJSONData(), raw };
}

describe("checkout with the real Stripe SDK against a local stub", () => {
  it("sends catalogue prices, NZ shipping and local return URLs", async () => {
    const r = await checkout([
      { slug: "love", quantity: 2 },
      { slug: "dreams", quantity: 1 },
    ]);
    expect(r.status).toBe(200);
    expect(r.json).toEqual({ mode: "stripe", url: STUB_SESSION_URL });

    expect(stub.requests).toHaveLength(1);
    const [sent] = stub.requests;
    expect(sent).toMatchObject({
      method: "POST",
      path: "/v1/checkout/sessions",
      auth: "present",
    });
    expect(sent.form).toMatchObject({
      mode: "payment",
      "line_items[0][quantity]": "2",
      "line_items[0][price_data][currency]": "nzd",
      "line_items[0][price_data][unit_amount]": "2000",
      "line_items[0][price_data][product_data][name]": "Love candle",
      "line_items[1][quantity]": "1",
      "line_items[1][price_data][product_data][name]": "Dreams candle",
      "shipping_address_collection[allowed_countries][0]": "NZ",
      "shipping_options[0][shipping_rate_data][fixed_amount][amount]": "500",
      "shipping_options[0][shipping_rate_data][fixed_amount][currency]": "nzd",
      success_url:
        "http://127.0.0.1:7301/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "http://127.0.0.1:7301/cart",
    });
    // Nothing the browser could set reaches Stripe as a price.
    expect(Object.keys(sent.form).some((k) => /\[price\]$/.test(k))).toBe(
      false,
    );
  });

  it("falls back to demo mode when Stripe rejects the key", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    stub.setMode("auth");
    const r = await checkout([{ slug: "summer", quantity: 1 }]);
    expect(r.status).toBe(200);
    expect(r.json.mode).toBe("demo");
    expect(r.json.order.total).toBe(2500);
    const logged = warn.mock.calls.flat().join(" ");
    expect(logged).toContain("StripeAuthenticationError");
    expect(logged).not.toContain("sk_");
  });

  it("answers a Stripe server error with a generic 502", async () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    stub.setMode("error");
    const r = await checkout([{ slug: "love", quantity: 1 }]);
    expect(r.status).toBe(502);
    expect(r.json).toEqual({
      error: "We couldn't start checkout. Please try again.",
    });
    expect(r.raw).not.toContain("Stub failure");
    const logged = error.mock.calls.flat().join(" ");
    expect(logged).toContain("StripeAPIError");
    expect(logged).not.toContain("sk_");
  });
});
