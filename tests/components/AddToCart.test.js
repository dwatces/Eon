// @vitest-environment jsdom
import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AddToCart, { addedMessage } from "../../components/AddToCart";
import { CartProvider } from "../../hooks/use-shopping-cart";
import { getCandle } from "../../data/candles";

const love = getCandle("love");

const savedCart = () => JSON.parse(localStorage.getItem("eon-cart"));

// The stepper's <output> is a status region too, so pick the message one.
const message = () =>
  screen.getAllByRole("status").find((el) => el.tagName === "DIV");

const renderAddToCart = () =>
  render(
    <CartProvider>
      <AddToCart candle={love} />
    </CartProvider>,
  );

describe("addedMessage", () => {
  it("counts candles in plain words", () => {
    expect(addedMessage("Love", 0, 1)).toBe(
      "Added 1 Love candle to your cart.",
    );
    expect(addedMessage("Love", 3, 2)).toBe(
      "Added 2 Love candles to your cart.",
    );
  });

  it("says when the order limit cut the quantity", () => {
    expect(addedMessage("Love", 9, 3)).toBe(
      "Added 1 Love candle. Your cart now has 10, the most for one order.",
    );
    expect(addedMessage("Love", 10, 1)).toBe(
      "Your cart already has 10 Love candles, the most for one order.",
    );
  });
});

describe("AddToCart", () => {
  beforeEach(() => {
    // The cart store is shared across tests; start each one empty.
    localStorage.clear();
    window.dispatchEvent(new StorageEvent("storage", { key: null }));
  });

  it("has a status region before anything is added", () => {
    renderAddToCart();
    expect(message().textContent).toBe("");
    expect(screen.getByText(/no real orders or payments/)).toBeTruthy();
  });

  it("adds the chosen quantity, confirms it and stays usable", () => {
    renderAddToCart();
    fireEvent.click(screen.getByRole("button", { name: "Increase quantity" }));
    fireEvent.click(screen.getByRole("button", { name: "Add to cart" }));
    expect(message().textContent).toContain(
      "Added 2 Love candles to your cart.",
    );
    expect(savedCart()).toEqual({ v: 2, lines: { love: 2 } });

    fireEvent.click(screen.getByRole("button", { name: "Decrease quantity" }));
    act(() => {
      fireEvent.click(screen.getByRole("button", { name: "Add to cart" }));
    });
    expect(screen.getByRole("button", { name: "Add to cart" })).toBeTruthy();
    expect(message().textContent).toContain(
      "Added 1 Love candle to your cart.",
    );
    expect(savedCart()).toEqual({ v: 2, lines: { love: 3 } });
    expect(
      screen.getByRole("link", { name: "View cart" }).getAttribute("href"),
    ).toBe("/cart");
  });

  it("brings the message into view after each add, not before", () => {
    // jsdom has no scrollIntoView; the component must not need one.
    const scroll = vi.fn();
    Element.prototype.scrollIntoView = scroll;
    try {
      renderAddToCart();
      expect(scroll).not.toHaveBeenCalled();
      fireEvent.click(screen.getByRole("button", { name: "Add to cart" }));
      fireEvent.click(screen.getByRole("button", { name: "Add to cart" }));
      expect(scroll).toHaveBeenCalledTimes(2);
      expect(scroll).toHaveBeenLastCalledWith({ block: "nearest" });
      expect(scroll.mock.contexts[0]).toBe(message());
    } finally {
      delete Element.prototype.scrollIntoView;
    }
  });
});
