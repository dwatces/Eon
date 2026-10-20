// @vitest-environment jsdom
import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ErrorBoundary, { clearSavedCart } from "../../components/ErrorBoundary";

function Thrower() {
  throw new Error("render failed");
}

describe("ErrorBoundary", () => {
  beforeEach(() => {
    // React reports caught render errors on the console; keep test output clean.
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => localStorage.clear());

  it("shows the page when nothing throws", () => {
    render(
      <ErrorBoundary resetKey="/">
        <p>Page content</p>
      </ErrorBoundary>,
    );
    expect(screen.getByText("Page content")).toBeTruthy();
  });

  it("replaces a crashed page with a way out", () => {
    render(
      <ErrorBoundary resetKey="/shop">
        <Thrower />
      </ErrorBoundary>,
    );
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Something went wrong on this page",
      }),
    ).toBeTruthy();
    expect(screen.getByRole("main")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Reload" })).toBeTruthy();
    expect(
      screen.getByRole("link", { name: "Go to the shop" }).getAttribute("href"),
    ).toBe("/shop");
    expect(
      screen.getByRole("button", { name: "Clear saved cart" }),
    ).toBeTruthy();
  });

  it("Reload reloads, and Clear saved cart empties the saved cart first", () => {
    const reload = vi.fn();
    localStorage.setItem("eon-cart", '{"v":2,"lines":{"love":1}}');
    localStorage.setItem("cart", "{}");
    localStorage.setItem("other", "kept");
    render(
      <ErrorBoundary resetKey="/" reload={reload}>
        <Thrower />
      </ErrorBoundary>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Reload" }));
    expect(reload).toHaveBeenCalledTimes(1);
    expect(localStorage.getItem("eon-cart")).not.toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Clear saved cart" }));
    expect(reload).toHaveBeenCalledTimes(2);
    expect(localStorage.getItem("eon-cart")).toBeNull();
    expect(localStorage.getItem("cart")).toBeNull();
    expect(localStorage.getItem("other")).toBe("kept");
  });

  it("recovers when the route changes", () => {
    const { rerender } = render(
      <ErrorBoundary resetKey="/a">
        <Thrower />
      </ErrorBoundary>,
    );
    expect(screen.getByRole("button", { name: "Reload" })).toBeTruthy();
    rerender(
      <ErrorBoundary resetKey="/b">
        <p>Next page</p>
      </ErrorBoundary>,
    );
    expect(screen.getByText("Next page")).toBeTruthy();
  });

  it("clearSavedCart never throws on blocked storage", () => {
    const blocked = {
      removeItem() {
        throw new Error("blocked");
      },
    };
    expect(() => clearSavedCart(blocked)).not.toThrow();
  });
});
