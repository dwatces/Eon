import { afterEach, describe, expect, it } from "vitest";
import { getStaticProps as cartProps } from "../pages/cart.js";
import * as successPage from "../pages/success.js";
import { setCheckoutEnv } from "./helpers/env.js";

let restore = () => {};
afterEach(() => restore());

const props = () => cartProps().props;

describe("build-time props for /cart", () => {
  it("are demo with no key", () => {
    restore = setCheckoutEnv({});
    expect(props()).toEqual({ paymentsLive: false });
  });

  it("say Stripe test mode takes no real payment", () => {
    restore = setCheckoutEnv({ STRIPE_SECRET_KEY: "sk_test_props_0000" });
    expect(props()).toEqual({ paymentsLive: false });
  });

  it("stay demo for a live key without the opt-in", () => {
    restore = setCheckoutEnv({ STRIPE_SECRET_KEY: "sk_live_props_0000" });
    expect(props()).toEqual({ paymentsLive: false });
  });

  it("are live only with a live key and the opt-in", () => {
    restore = setCheckoutEnv({
      STRIPE_SECRET_KEY: "sk_live_props_0000",
      EON_ALLOW_LIVE_PAYMENTS: "true",
    });
    expect(props()).toEqual({ paymentsLive: true });
  });

  it("never carry the key", () => {
    for (const key of ["sk_test_props_0000", "sk_live_props_0000"]) {
      restore = setCheckoutEnv({
        STRIPE_SECRET_KEY: key,
        EON_ALLOW_LIVE_PAYMENTS: "true",
      });
      const json = JSON.stringify(props());
      expect(json).not.toContain("sk_");
      expect(json).not.toContain("props_0000");
      restore();
    }
  });
});

describe("/success", () => {
  it("has no build-time props: the server checks each order", () => {
    expect(successPage.getStaticProps).toBeUndefined();
    expect(successPage.getServerSideProps).toBeUndefined();
  });
});
