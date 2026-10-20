// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

// The order page has three states: the demo order summary, a thank-you
// after a Stripe checkout, and "no order" for any other visit. The demo
// state is covered end to end in e2e/checkout.spec.js. The Stripe state
// needs a build with a Stripe key, which the end-to-end server doesn't
// have, so it is covered here.

const CART = JSON.stringify({ v: 2, lines: { love: 2 } });
const savedCart = () => JSON.parse(localStorage.getItem("eon-cart"));

// Fresh modules for each render, so the cart store reads storage again.
async function renderSuccess({ query, stripeEnabled }) {
  vi.resetModules();
  // tests/setup.js mocks next/router with one shared router object.
  const { default: router } = await import("next/router");
  router.query = query;
  const { CartProvider } = await import("../../hooks/use-shopping-cart");
  const { default: Success } = await import("../../pages/success");
  return render(
    <CartProvider>
      <Success stripeEnabled={stripeEnabled} />
    </CartProvider>,
  );
}

const heading = () => screen.getByRole("heading", { level: 1 });

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  localStorage.setItem("eon-cart", CART);
});

describe("/success after a Stripe checkout", () => {
  it("thanks the shopper and empties the cart", async () => {
    await renderSuccess({
      query: { session_id: "cs_test_a1B2c3" },
      stripeEnabled: true,
    });
    expect(heading()).toHaveProperty("textContent", "Thank you");
    expect(savedCart()).toEqual({ v: 2, lines: {} });
  });

  it("empties the cart once per session, not on a later visit", async () => {
    const view = await renderSuccess({
      query: { session_id: "cs_test_a1B2c3" },
      stripeEnabled: true,
    });
    view.unmount();
    localStorage.setItem("eon-cart", CART);
    await renderSuccess({
      query: { session_id: "cs_test_a1B2c3" },
      stripeEnabled: true,
    });
    expect(heading()).toHaveProperty("textContent", "Thank you");
    expect(savedCart()).toEqual({ v: 2, lines: { love: 2 } });
  });

  it("shows no order for a session id that isn't Stripe's shape", async () => {
    await renderSuccess({
      query: { session_id: "cs_test_<img>" },
      stripeEnabled: true,
    });
    expect(heading()).toHaveProperty(
      "textContent",
      "There's no order to show here",
    );
    expect(savedCart()).toEqual({ v: 2, lines: { love: 2 } });
  });

  it("shows no order when this build doesn't use Stripe", async () => {
    await renderSuccess({
      query: { session_id: "cs_test_a1B2c3" },
      stripeEnabled: false,
    });
    expect(heading()).toHaveProperty(
      "textContent",
      "There's no order to show here",
    );
    expect(savedCart()).toEqual({ v: 2, lines: { love: 2 } });
  });
});
