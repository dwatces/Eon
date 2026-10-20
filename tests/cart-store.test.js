import { describe, expect, it, vi } from "vitest";
import { emptyCart, LEGACY_STORAGE_KEY, STORAGE_KEY } from "../lib/cart.js";
import { createCartStore } from "../lib/cart-store.js";

class MemoryStorage {
  constructor(entries = {}) {
    this.map = new Map(Object.entries(entries));
  }
  getItem(key) {
    return this.map.has(key) ? this.map.get(key) : null;
  }
  setItem(key, value) {
    this.map.set(key, String(value));
  }
  removeItem(key) {
    this.map.delete(key);
  }
}

const fakeWindow = () => {
  const handlers = new Set();
  return {
    addEventListener: (type, handler) =>
      type === "storage" && handlers.add(handler),
    removeEventListener: (type, handler) => handlers.delete(handler),
    fire: (event) => handlers.forEach((handler) => handler(event)),
    handlers,
  };
};

describe("cart store", () => {
  it("gives the server an empty cart", () => {
    const store = createCartStore(() => null, null);
    expect(store.getServerSnapshot()).toBe(emptyCart);
    expect(store.getSnapshot()).toBe(emptyCart);
  });

  it("loads and migrates the saved cart once, returning a stable snapshot", () => {
    const storage = new MemoryStorage({
      [LEGACY_STORAGE_KEY]: JSON.stringify({
        cartDetails: { a: { name: "love", quantity: 2 } },
      }),
    });
    const store = createCartStore(() => storage, null);
    const first = store.getSnapshot();
    expect(first.lines).toEqual({ love: 2 });
    expect(store.getSnapshot()).toBe(first);
    expect(storage.getItem(LEGACY_STORAGE_KEY)).toBeNull();
  });

  it("saves each change and notifies subscribers", () => {
    const storage = new MemoryStorage();
    const store = createCartStore(() => storage, fakeWindow());
    const listener = vi.fn();
    store.subscribe(listener);
    store.dispatch({ type: "ADD", slug: "summer", quantity: 2 });
    expect(listener).toHaveBeenCalledTimes(1);
    expect(JSON.parse(storage.getItem(STORAGE_KEY))).toEqual({
      v: 2,
      lines: { summer: 2 },
    });
    store.dispatch({ type: "ADD", slug: "nope", quantity: 1 });
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("follows changes from other tabs and stops listening when unsubscribed", () => {
    const win = fakeWindow();
    const store = createCartStore(() => new MemoryStorage(), win);
    const listener = vi.fn();
    const unsubscribe = store.subscribe(listener);
    win.fire({
      key: STORAGE_KEY,
      newValue: JSON.stringify({ v: 2, lines: { dreams: 3 } }),
    });
    expect(store.getSnapshot().lines).toEqual({ dreams: 3 });
    win.fire({ key: "something-else", newValue: "x" });
    expect(listener).toHaveBeenCalledTimes(1);
    win.fire({ key: null });
    expect(store.getSnapshot()).toBe(emptyCart);
    unsubscribe();
    expect(win.handlers.size).toBe(0);
  });
});
