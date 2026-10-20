import { describe, expect, it } from "vitest";
import {
  isSessionId,
  sameStripeMode,
  sessionOutcome,
} from "../lib/checkout-session.js";

describe("isSessionId", () => {
  it("accepts Stripe Checkout session ids", () => {
    expect(isSessionId("cs_test_a1B2c3")).toBe(true);
    expect(isSessionId("cs_live_a1B2c3")).toBe(true);
  });

  it("rejects anything else", () => {
    for (const value of [
      undefined,
      ["cs_test_a1"],
      "",
      "cs_test_",
      "cs_other_a1",
      "pi_test_a1",
      "cs_test_<img>",
      "cs_test_a1/../../v1/charges",
      `cs_test_${"a".repeat(251)}`,
    ]) {
      expect(isSessionId(value), String(value)).toBe(false);
    }
  });
});

describe("sameStripeMode", () => {
  it("matches test ids to test keys and live ids to live keys", () => {
    expect(sameStripeMode("cs_test_a1", false)).toBe(true);
    expect(sameStripeMode("cs_live_a1", true)).toBe(true);
    expect(sameStripeMode("cs_live_a1", false)).toBe(false);
    expect(sameStripeMode("cs_test_a1", true)).toBe(false);
  });
});

describe("sessionOutcome", () => {
  const paid = {
    status: "complete",
    payment_status: "paid",
    amount_total: 6500,
    currency: "nzd",
    livemode: false,
  };

  it("reports a completed, paid session with its total", () => {
    expect(sessionOutcome(paid)).toEqual({
      status: "paid",
      total: 6500,
      currency: "NZD",
      live: false,
    });
    expect(sessionOutcome({ ...paid, livemode: true }).live).toBe(true);
    expect(
      sessionOutcome({ ...paid, payment_status: "no_payment_required" }).status,
    ).toBe("paid");
  });

  it("passes on nothing about the shopper", () => {
    const outcome = sessionOutcome({
      ...paid,
      customer_details: { email: "a@b.c", name: "A B" },
    });
    expect(Object.keys(outcome).sort()).toEqual([
      "currency",
      "live",
      "status",
      "total",
    ]);
  });

  it("treats an open, expired or unpaid session as no order", () => {
    expect(sessionOutcome({ ...paid, status: "open" })).toEqual({
      status: "unpaid",
    });
    expect(sessionOutcome({ ...paid, status: "expired" })).toEqual({
      status: "unpaid",
    });
    expect(sessionOutcome({ ...paid, payment_status: "unpaid" })).toEqual({
      status: "unpaid",
    });
  });

  it("fills in a missing total or currency", () => {
    expect(
      sessionOutcome({ ...paid, amount_total: null, currency: null }),
    ).toEqual({ status: "paid", total: 0, currency: "NZD", live: false });
  });
});
