// @vitest-environment jsdom
import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// The order page has three states: the demo order summary, the result of
// a Stripe checkout, and "no order" for any other visit. A session id is
// always checked with the server, which answers 404 in demo mode. The demo state is
// covered end to end in e2e/checkout.spec.js, and the Stripe hand-off and
// return in e2e/stripe-checkout.spec.js. Here the Stripe state is checked
// against every answer the order check can give.

const CART = JSON.stringify({ v: 2, lines: { love: 2 } });
const savedCart = () => JSON.parse(localStorage.getItem("eon-cart"));

const PAID = { status: "paid", total: 4500, currency: "NZD", live: false };

// The order check the page sends to /api/checkout_sessions/:id.
function answer(status, body) {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

// Fresh modules for each render, so the cart store reads storage again.
async function renderSuccess({ query }) {
  vi.resetModules();
  // tests/setup.js mocks next/router with one shared router object.
  const { default: router } = await import("next/router");
  router.query = query;
  const { CartProvider } = await import("../../hooks/use-shopping-cart");
  const { default: Success } = await import("../../pages/success");
  return render(
    <CartProvider>
      <Success />
    </CartProvider>,
  );
}

const heading = () => screen.getByRole("heading", { level: 1 });
const findHeading = (name) => screen.findByRole("heading", { level: 1, name });

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  localStorage.setItem("eon-cart", CART);
});
afterEach(() => vi.unstubAllGlobals());

describe("/success after a Stripe checkout", () => {
  it("checks the session, then thanks the shopper and empties the cart", async () => {
    const fetchMock = answer(200, PAID);
    await renderSuccess({
      query: { session_id: "cs_test_a1B2c3" },
    });
    // Nothing changes until the server has answered.
    expect(heading()).toHaveProperty("textContent", "Checking your order");
    expect(savedCart()).toEqual(JSON.parse(CART));

    await findHeading("Thank you");
    expect(screen.getByText(/test payment of \$45\.00 NZD/)).toBeTruthy();
    expect(screen.getByText(/no real card was charged/)).toBeTruthy();
    expect(savedCart()).toEqual({ v: 2, lines: {} });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toBe(
      "/api/checkout_sessions/cs_test_a1B2c3",
    );
  });

  it("leaves out the test note for a live payment", async () => {
    answer(200, { ...PAID, live: true });
    await renderSuccess({
      query: { session_id: "cs_live_a1B2c3" },
    });
    await findHeading("Thank you");
    expect(
      screen.getByText("Stripe has confirmed your payment of $45.00 NZD."),
    ).toBeTruthy();
    expect(screen.queryByText(/no real card/)).toBeNull();
  });

  it("empties the cart once per session, not on a later visit", async () => {
    answer(200, PAID);
    const view = await renderSuccess({
      query: { session_id: "cs_test_a1B2c3" },
    });
    await findHeading("Thank you");
    view.unmount();
    localStorage.setItem("eon-cart", CART);
    await renderSuccess({
      query: { session_id: "cs_test_a1B2c3" },
    });
    await findHeading("Thank you");
    expect(savedCart()).toEqual({ v: 2, lines: { love: 2 } });
  });

  it("keeps the cart for a session Stripe doesn't know (a forged id)", async () => {
    answer(404, { error: "We couldn't find that checkout." });
    await renderSuccess({
      query: { session_id: "cs_test_forged" },
    });
    await findHeading("We couldn't confirm this order");
    expect(screen.queryByText(/Thank you/)).toBeNull();
    expect(savedCart()).toEqual({ v: 2, lines: { love: 2 } });
    expect(
      screen
        .getByRole("link", { name: "Go to your cart" })
        .getAttribute("href"),
    ).toBe("/cart");
  });

  it("keeps the cart for a session that isn't paid", async () => {
    answer(200, { status: "unpaid" });
    await renderSuccess({
      query: { session_id: "cs_test_open" },
    });
    await findHeading("We couldn't confirm this order");
    expect(savedCart()).toEqual({ v: 2, lines: { love: 2 } });
  });

  it("says when the check failed, keeps the cart and can try again", async () => {
    answer(502, { error: "We couldn't check your order. Please try again." });
    await renderSuccess({
      query: { session_id: "cs_test_a1B2c3" },
    });
    await findHeading("We couldn't check your order");
    expect(savedCart()).toEqual({ v: 2, lines: { love: 2 } });

    const fetchMock = answer(200, PAID);
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(heading()).toHaveProperty("textContent", "Checking your order");
    await findHeading("Thank you");
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(savedCart()).toEqual({ v: 2, lines: {} });
  });

  it("shows no order for a session id that isn't Stripe's shape", async () => {
    const fetchMock = answer(200, PAID);
    await renderSuccess({
      query: { session_id: "cs_test_<img>" },
    });
    expect(heading()).toHaveProperty(
      "textContent",
      "There's no order to show here",
    );
    expect(savedCart()).toEqual({ v: 2, lines: { love: 2 } });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
