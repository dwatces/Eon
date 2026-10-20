import { describe, expect, it } from "vitest";
import {
  resolveCheckoutMode,
  stripeHostOptions,
} from "../lib/checkout-mode.js";

describe("resolveCheckoutMode", () => {
  it("is demo with no key, a blank key or a non-string key", () => {
    expect(resolveCheckoutMode({}).mode).toBe("demo");
    expect(resolveCheckoutMode({ STRIPE_SECRET_KEY: "" }).mode).toBe("demo");
    expect(resolveCheckoutMode({ STRIPE_SECRET_KEY: " \n " }).mode).toBe(
      "demo",
    );
  });

  it("uses Stripe for test keys, trimmed", () => {
    expect(
      resolveCheckoutMode({ STRIPE_SECRET_KEY: "sk_test_x" }),
    ).toMatchObject({
      mode: "stripe",
      live: false,
      key: "sk_test_x",
    });
    expect(resolveCheckoutMode({ STRIPE_SECRET_KEY: " rk_test_x " }).key).toBe(
      "rk_test_x",
    );
  });

  it("needs EON_ALLOW_LIVE_PAYMENTS=true for any other key", () => {
    expect(resolveCheckoutMode({ STRIPE_SECRET_KEY: "sk_live_x" })).toEqual({
      mode: "demo",
      reason: "live-key-without-opt-in",
    });
    expect(
      resolveCheckoutMode({
        STRIPE_SECRET_KEY: "sk_live_x",
        EON_ALLOW_LIVE_PAYMENTS: "yes",
      }).mode,
    ).toBe("demo");
    expect(
      resolveCheckoutMode({
        STRIPE_SECRET_KEY: "sk_live_x",
        EON_ALLOW_LIVE_PAYMENTS: "true",
      }),
    ).toMatchObject({ mode: "stripe", live: true });
  });
});

describe("stripeHostOptions", () => {
  it("is empty unless a loopback stub URL is set", () => {
    expect(stripeHostOptions({})).toEqual({});
    expect(
      stripeHostOptions({ EON_STRIPE_API_BASE: "https://api.stripe.com" }),
    ).toEqual({});
    expect(
      stripeHostOptions({ EON_STRIPE_API_BASE: "http://evil.example:7309" }),
    ).toEqual({});
    expect(stripeHostOptions({ EON_STRIPE_API_BASE: "nonsense" })).toEqual({});
  });

  it("points the SDK at a local stub", () => {
    expect(
      stripeHostOptions({ EON_STRIPE_API_BASE: "http://127.0.0.1:7309" }),
    ).toEqual({
      host: "127.0.0.1",
      port: 7309,
      protocol: "http",
    });
  });
});
