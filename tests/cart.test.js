import { describe, expect, it } from "vitest";
import {
  LEGACY_STORAGE_KEY,
  STORAGE_KEY,
  cartCount,
  cartLines,
  cartReducer,
  cartShipping,
  cartSubtotal,
  cartTotal,
  emptyCart,
  loadCart,
  migrateLegacyCart,
  parseStoredCart,
  saveCart,
} from "../lib/cart.js";

const deepFreeze = (value) => {
  Object.values(value).forEach((child) => {
    if (child && typeof child === "object") deepFreeze(child);
  });
  return Object.freeze(value);
};

const reduce = (actions, start = emptyCart) =>
  actions.reduce(
    (state, action) => cartReducer(deepFreeze(state), action),
    start,
  );

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

describe("cartReducer", () => {
  it("adds the same candle twice without mutating state", () => {
    const state = reduce([
      { type: "ADD", slug: "love", quantity: 1 },
      { type: "ADD", slug: "love", quantity: 1 },
    ]);
    expect(state.lines).toEqual({ love: 2 });
    expect(cartCount(state)).toBe(2);
  });

  it("clamps quantities to 1 to 10", () => {
    const state = reduce([
      { type: "ADD", slug: "love", quantity: 4 },
      { type: "SET_QTY", slug: "love", quantity: 11 },
    ]);
    expect(state.lines.love).toBe(10);
    expect(
      reduce([{ type: "SET_QTY", slug: "love", quantity: 0 }], state).lines
        .love,
    ).toBe(1);
    expect(
      reduce([{ type: "ADD", slug: "love", quantity: 5 }], state).lines.love,
    ).toBe(10);
  });

  it("ignores unknown candles and bad quantities", () => {
    const state = reduce([
      { type: "ADD", slug: "hapiness", quantity: 1 },
      { type: "ADD", slug: "love", quantity: 0 },
      { type: "ADD", slug: "love", quantity: 1.5 },
      { type: "ADD", slug: "love", quantity: "2" },
      { type: "SET_QTY", slug: "dreams", quantity: 3 },
      { type: "NOPE" },
    ]);
    expect(state.lines).toEqual({});
  });

  it("removes a whole line and clears the cart", () => {
    const state = reduce([
      { type: "ADD", slug: "love", quantity: 3 },
      { type: "ADD", slug: "dreams", quantity: 1 },
      { type: "REMOVE_LINE", slug: "love" },
    ]);
    expect(state.lines).toEqual({ dreams: 1 });
    expect(reduce([{ type: "CLEAR" }], state)).toBe(emptyCart);
  });

  it("loads lines through the same validation", () => {
    const state = reduce([
      { type: "LOAD", lines: { love: 2, nope: 4, dreams: 40, summer: -1 } },
    ]);
    expect(state.lines).toEqual({ love: 2, dreams: 10 });
  });
});

describe("cart totals", () => {
  it("prices 2 x Love and 1 x Dreams in cents", () => {
    const state = reduce([
      { type: "ADD", slug: "love", quantity: 2 },
      { type: "ADD", slug: "dreams", quantity: 1 },
    ]);
    expect(cartSubtotal(state)).toBe(6000);
    expect(cartShipping(state)).toBe(500);
    expect(cartTotal(state)).toBe(6500);
    expect(cartLines(state)).toEqual([
      {
        slug: "love",
        name: "Love",
        quantity: 2,
        unitAmount: 2000,
        lineTotal: 4000,
      },
      {
        slug: "dreams",
        name: "Dreams",
        quantity: 1,
        unitAmount: 2000,
        lineTotal: 2000,
      },
    ]);
  });

  it("charges no shipping on an empty cart", () => {
    expect(cartShipping(emptyCart)).toBe(0);
    expect(cartTotal(emptyCart)).toBe(0);
  });
});

describe("stored carts", () => {
  it.each([
    ['{"cartCount":2}'],
    ["not json"],
    [null],
    ["[]"],
    ['{"v":1,"lines":{"love":1}}'],
    ['{"v":2,"lines":["love"]}'],
  ])("loads %s as an empty cart", (raw) => {
    expect(parseStoredCart(raw)).toEqual(emptyCart);
    expect(migrateLegacyCart(raw)).toEqual(emptyCart);
  });

  it("migrates the old cart by each entry's name", () => {
    const legacy = JSON.stringify({
      cartDetails: {
        price_1KTa4GIILjXbtSkjqSx6HWRR: {
          id: "price_1KTa4GIILjXbtSkjqSx6HWRR",
          name: "love",
          price: "$20",
          currency: "NZD",
          quantity: 2,
        },
        price_unknown: { id: "price_unknown", name: "candle", quantity: 1 },
      },
      cartCount: 3,
      totalPrice: null,
    });
    expect(migrateLegacyCart(legacy).lines).toEqual({ love: 2 });
  });

  it("loads, migrates and removes the old key", () => {
    const storage = new MemoryStorage({
      [LEGACY_STORAGE_KEY]: JSON.stringify({
        cartDetails: { x: { name: "summer", quantity: 3 } },
      }),
    });
    expect(loadCart(storage).lines).toEqual({ summer: 3 });
    expect(storage.getItem(LEGACY_STORAGE_KEY)).toBeNull();
    expect(JSON.parse(storage.getItem(STORAGE_KEY))).toEqual({
      v: 2,
      lines: { summer: 3 },
    });
  });

  it("removes a corrupt old cart and starts empty", () => {
    const storage = new MemoryStorage({
      [LEGACY_STORAGE_KEY]: '{"cartCount":2}',
    });
    expect(loadCart(storage)).toEqual(emptyCart);
    expect(storage.getItem(LEGACY_STORAGE_KEY)).toBeNull();
  });

  it("prefers the current key and round-trips through save", () => {
    const storage = new MemoryStorage();
    const state = reduce([{ type: "ADD", slug: "happiness", quantity: 2 }]);
    saveCart(storage, state);
    expect(loadCart(storage)).toEqual(state);
  });

  it("never throws when storage is blocked", () => {
    const blocked = {
      getItem() {
        throw new Error("SecurityError");
      },
      setItem() {
        throw new Error("QuotaExceededError");
      },
    };
    expect(loadCart(blocked)).toEqual(emptyCart);
    expect(() => saveCart(blocked, emptyCart)).not.toThrow();
  });
});
