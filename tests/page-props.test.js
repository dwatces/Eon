import { afterEach, describe, expect, it } from "vitest";
import { getStaticProps as cartProps } from "../pages/cart.js";
import { getStaticProps as successProps } from "../pages/success.js";
import { setCheckoutEnv } from "./helpers/env.js";

let restore = () => {};
afterEach(() => restore());

const both = () => [cartProps().props, successProps().props];

describe("build-time props for /cart and /success", () => {
  it("are demo with no key", () => {
    restore = setCheckoutEnv({});
    expect(both()).toEqual([{ paymentsLive: false }, { stripeEnabled: false }]);
  });

  it("say Stripe test mode takes no real payment", () => {
    restore = setCheckoutEnv({ STRIPE_SECRET_KEY: "sk_test_props_0000" });
    expect(both()).toEqual([{ paymentsLive: false }, { stripeEnabled: true }]);
  });

  it("stay demo for a live key without the opt-in", () => {
    restore = setCheckoutEnv({ STRIPE_SECRET_KEY: "sk_live_props_0000" });
    expect(both()).toEqual([{ paymentsLive: false }, { stripeEnabled: false }]);
  });

  it("are live only with a live key and the opt-in", () => {
    restore = setCheckoutEnv({
      STRIPE_SECRET_KEY: "sk_live_props_0000",
      EON_ALLOW_LIVE_PAYMENTS: "true",
    });
    expect(both()).toEqual([{ paymentsLive: true }, { stripeEnabled: true }]);
  });

  it("never carry the key", () => {
    for (const key of ["sk_test_props_0000", "sk_live_props_0000"]) {
      restore = setCheckoutEnv({
        STRIPE_SECRET_KEY: key,
        EON_ALLOW_LIVE_PAYMENTS: "true",
      });
      const json = JSON.stringify(both());
      expect(json).not.toContain("sk_");
      expect(json).not.toContain("props_0000");
      restore();
    }
  });
});
