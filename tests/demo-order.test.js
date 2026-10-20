import { describe, expect, it } from "vitest";
import {
  DEMO_ORDER_KEY,
  isValidOrder,
  markCartCleared,
  readDemoOrder,
  saveDemoOrder,
} from "../lib/demo-order.js";
import { buildOrder } from "../lib/checkout.js";

const memoryStorage = () => {
  const data = new Map();
  return {
    getItem: (key) => (data.has(key) ? data.get(key) : null),
    setItem: (key, value) => data.set(key, String(value)),
    removeItem: (key) => data.delete(key),
  };
};

const blockedStorage = {
  getItem() {
    throw new Error("blocked");
  },
  setItem() {
    throw new Error("blocked");
  },
};

const order = buildOrder([
  { slug: "love", quantity: 2 },
  { slug: "dreams", quantity: 1 },
]);

describe("demo order hand-off", () => {
  it("accepts the order the checkout API builds", () => {
    expect(isValidOrder(order)).toBe(true);
  });

  it.each([
    ["no lines", { ...order, lines: [] }],
    ["a wrong subtotal", { ...order, subtotal: order.subtotal + 1 }],
    ["a wrong total", { ...order, total: 1 }],
    ["another currency", { ...order, currency: "USD" }],
    [
      "an unknown candle",
      { ...order, lines: [{ ...order.lines[0], slug: "nope" }] },
    ],
    [
      "a renamed candle",
      { ...order, lines: [{ ...order.lines[0], name: "<b>Love</b>" }] },
    ],
    [
      "a quantity over 10",
      {
        ...order,
        lines: [{ ...order.lines[0], quantity: 11, lineTotal: 22000 }],
      },
    ],
    ["not an object", "order"],
  ])("rejects an order with %s", (_label, value) => {
    expect(isValidOrder(value)).toBe(false);
  });

  it("saves and reads back the order, not yet cleared", () => {
    const storage = memoryStorage();
    saveDemoOrder(storage, order);
    expect(readDemoOrder(storage)).toEqual({ order, cartCleared: false });
  });

  it("remembers that the cart was emptied for this order", () => {
    const storage = memoryStorage();
    saveDemoOrder(storage, order);
    markCartCleared(storage);
    expect(readDemoOrder(storage)).toEqual({ order, cartCleared: true });
  });

  it("reads nothing from empty, corrupt or tampered storage", () => {
    const storage = memoryStorage();
    expect(readDemoOrder(storage)).toBeNull();
    storage.setItem(DEMO_ORDER_KEY, "{not json");
    expect(readDemoOrder(storage)).toBeNull();
    storage.setItem(
      DEMO_ORDER_KEY,
      JSON.stringify({ v: 1, order: { ...order, total: 0 } }),
    );
    expect(readDemoOrder(storage)).toBeNull();
  });

  it("lets the caller know when storage is blocked", () => {
    expect(() => saveDemoOrder(blockedStorage, order)).toThrow();
    expect(readDemoOrder(blockedStorage)).toBeNull();
    expect(() => markCartCleared(blockedStorage)).not.toThrow();
  });
});
