import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createMocks } from "node-mocks-http";
import { setCheckoutEnv } from "./helpers/env.js";

// GET /api/checkout_sessions/:id with the Stripe SDK mocked. The same
// route against the real SDK and a local stub is in
// checkout-api-stripe-sdk.test.js.

const retrieve = vi.fn();
const StripeCtor = vi.fn(function Stripe() {
  return { checkout: { sessions: { retrieve } } };
});
vi.mock("stripe", () => ({ default: StripeCtor }));

const { default: handler } =
  await import("../pages/api/checkout_sessions/[id].js");

const TEST_KEY = "sk_test_mocked";
const LIVE_KEY = "sk_live_mocked";

const PAID = {
  id: "cs_test_a1",
  status: "complete",
  payment_status: "paid",
  amount_total: 4500,
  currency: "nzd",
  livemode: false,
  customer_details: { email: "shopper@example.test", name: "A Shopper" },
};

async function call({ id = "cs_test_a1", method = "GET" } = {}) {
  const { req, res } = createMocks({ method, query: { id } });
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
let error;
beforeEach(() => {
  retrieve.mockReset();
  retrieve.mockResolvedValue(PAID);
  StripeCtor.mockClear();
  error = vi.spyOn(console, "error").mockImplementation(() => {});
  restoreEnv = setCheckoutEnv({ STRIPE_SECRET_KEY: TEST_KEY });
});
afterEach(() => restoreEnv?.());

const stripeError = (type, extra = {}) =>
  Object.assign(new Error("from Stripe"), { type, ...extra });

describe("GET /api/checkout_sessions/:id", () => {
  it("answers a paid session with the outcome and total only", async () => {
    const r = await call();
    expect(r.status).toBe(200);
    expect(r.json).toEqual({
      status: "paid",
      total: 4500,
      currency: "NZD",
      live: false,
    });
    expect(r.raw).not.toContain("shopper@example.test");
    expect(r.headers["cache-control"]).toBe("no-store");
    expect(retrieve).toHaveBeenCalledWith("cs_test_a1");
    expect(StripeCtor.mock.calls[0][0]).toBe(TEST_KEY);
  });

  it("answers an open session as unpaid", async () => {
    retrieve.mockResolvedValue({ ...PAID, status: "open" });
    const r = await call();
    expect(r.status).toBe(200);
    expect(r.json).toEqual({ status: "unpaid" });
  });

  it("only allows GET", async () => {
    const r = await call({ method: "POST" });
    expect(r.status).toBe(405);
    expect(r.headers.allow).toBe("GET");
    expect(retrieve).not.toHaveBeenCalled();
  });

  it("never asks Stripe about an id that isn't a session id", async () => {
    for (const id of [
      "cs_test_<img>",
      "pi_test_a1",
      "cs_test_a1/../../v1/charges",
      ["cs_test_a1", "cs_test_b2"],
    ]) {
      const r = await call({ id });
      expect(r.status, String(id)).toBe(404);
    }
    expect(StripeCtor).not.toHaveBeenCalled();
  });

  it("finds no order in demo mode, without contacting Stripe", async () => {
    restoreEnv();
    restoreEnv = setCheckoutEnv({});
    expect((await call()).status).toBe(404);

    restoreEnv();
    restoreEnv = setCheckoutEnv({ STRIPE_SECRET_KEY: LIVE_KEY });
    expect((await call({ id: "cs_live_a1" })).status).toBe(404);
    expect(StripeCtor).not.toHaveBeenCalled();
  });

  it("finds no order for a session from the other Stripe mode", async () => {
    expect((await call({ id: "cs_live_a1" })).status).toBe(404);

    restoreEnv();
    restoreEnv = setCheckoutEnv({
      STRIPE_SECRET_KEY: LIVE_KEY,
      EON_ALLOW_LIVE_PAYMENTS: "true",
    });
    expect((await call({ id: "cs_test_a1" })).status).toBe(404);
    expect(StripeCtor).not.toHaveBeenCalled();

    retrieve.mockResolvedValue({ ...PAID, id: "cs_live_a1", livemode: true });
    const live = await call({ id: "cs_live_a1" });
    expect(live.json).toMatchObject({ status: "paid", live: true });
  });

  it("answers a session Stripe doesn't know with a 404", async () => {
    retrieve.mockRejectedValue(
      stripeError("StripeInvalidRequestError", {
        statusCode: 404,
        code: "resource_missing",
      }),
    );
    const r = await call();
    expect(r.status).toBe(404);
    expect(r.json).toEqual({ error: "We couldn't find that checkout." });
    expect(error).not.toHaveBeenCalled();
  });

  it("answers any other Stripe error with a generic 502", async () => {
    for (const err of [
      stripeError("StripeAuthenticationError"),
      stripeError("StripeInvalidRequestError", {
        statusCode: 400,
        code: "parameter_invalid",
      }),
      stripeError("StripeAPIError"),
      new Error("socket hang up"),
    ]) {
      retrieve.mockRejectedValueOnce(err);
      const r = await call();
      expect(r.status).toBe(502);
      expect(r.json).toEqual({
        error: "We couldn't check your order. Please try again.",
      });
      expect(r.raw).not.toContain("from Stripe");
    }
    const logged = error.mock.calls.flat().join(" ");
    expect(logged).toContain("StripeAuthenticationError");
    expect(logged).toContain("UnknownError");
    expect(logged).not.toContain(TEST_KEY);
  });
});
