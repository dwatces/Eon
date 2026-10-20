import { describe, expect, it, vi } from "vitest";
import {
  CheckoutError,
  isStripeCheckoutUrl,
  requestCheckout,
} from "../lib/checkout-client.js";

const ORDER = {
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
};

const reply = (status, body) =>
  vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: () =>
      body === undefined
        ? Promise.reject(new Error("no json"))
        : Promise.resolve(body),
  });

describe("isStripeCheckoutUrl", () => {
  it("accepts Stripe's hosted checkout pages", () => {
    expect(
      isStripeCheckoutUrl("https://checkout.stripe.com/c/pay/cs_test_a1"),
    ).toBe(true);
  });

  it.each([
    ["http://checkout.stripe.com/c/pay/cs_test_a1"],
    ["https://checkout.stripe.com.evil.example/c/pay"],
    ["https://evil.example/?https://checkout.stripe.com/"],
    ["https://user@checkout.stripe.com/c/pay"],
    ["https://checkout.stripe.com:8443/c/pay"],
    ["https://stripe.com/"],
    ["javascript:alert(1)"],
    ["/success"],
    [""],
    [null],
    [42],
  ])("rejects %s", (url) => {
    expect(isStripeCheckoutUrl(url)).toBe(false);
  });
});

describe("requestCheckout", () => {
  const items = [{ slug: "love", name: "Love", quantity: 2, unitAmount: 2000 }];

  it("posts only slugs and quantities as JSON", async () => {
    const fetchImpl = reply(200, { mode: "demo", order: ORDER });
    await requestCheckout(items, fetchImpl);
    const [url, init] = fetchImpl.mock.calls[0];
    expect(url).toBe("/api/checkout_sessions");
    expect(init.method).toBe("POST");
    expect(init.headers["Content-Type"]).toBe("application/json");
    expect(JSON.parse(init.body)).toEqual({
      items: [{ slug: "love", quantity: 2 }],
    });
  });

  it("returns the demo order", async () => {
    await expect(
      requestCheckout(items, reply(200, { mode: "demo", order: ORDER })),
    ).resolves.toEqual({ kind: "demo", order: ORDER });
  });

  it("returns a Stripe checkout URL", async () => {
    const url = "https://checkout.stripe.com/c/pay/cs_test_a1";
    await expect(
      requestCheckout(items, reply(200, { mode: "stripe", url })),
    ).resolves.toEqual({ kind: "stripe", url });
  });

  it("refuses to send the shopper anywhere but Stripe", async () => {
    await expect(
      requestCheckout(
        items,
        reply(200, { mode: "stripe", url: "https://evil.example/pay" }),
      ),
    ).rejects.toBeInstanceOf(CheckoutError);
  });

  it.each([
    ["a server error", reply(500, { error: "Nope" })],
    ["a response that is not JSON", reply(200, undefined)],
    ["an unknown mode", reply(200, { mode: "other" })],
    ["a network failure", vi.fn().mockRejectedValue(new TypeError("offline"))],
  ])("throws a CheckoutError for %s", async (_label, fetchImpl) => {
    await expect(requestCheckout(items, fetchImpl)).rejects.toBeInstanceOf(
      CheckoutError,
    );
  });
});
