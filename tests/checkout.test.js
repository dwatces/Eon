import { describe, expect, it } from "vitest";
import { MAX_LINES, buildOrder, parseCheckoutBody } from "../lib/checkout.js";

describe("parseCheckoutBody", () => {
  it("accepts a valid cart", () => {
    expect(
      parseCheckoutBody({
        items: [
          { slug: "summer", quantity: 10 },
          { slug: "love", quantity: 1 },
        ],
      }),
    ).toEqual({
      items: [
        { slug: "summer", quantity: 10 },
        { slug: "love", quantity: 1 },
      ],
    });
  });

  it("allows one line per candle", () => {
    expect(MAX_LINES).toBe(4);
  });

  it("explains errors in plain words", () => {
    expect(parseCheckoutBody(null).error).toMatch(/JSON object/);
    expect(parseCheckoutBody([]).error).toMatch(/JSON object/);
    expect(
      parseCheckoutBody({ items: [{ slug: "love", quantity: 0 }] }).error,
    ).toBe("Quantities must be whole numbers from 1 to 10.");
  });
});

describe("buildOrder", () => {
  it("prices 2 x Love and 1 x Dreams from the catalogue", () => {
    const order = buildOrder([
      { slug: "love", quantity: 2 },
      { slug: "dreams", quantity: 1 },
    ]);
    expect(order.subtotal).toBe(6000);
    expect(order.shipping).toBe(500);
    expect(order.total).toBe(6500);
    expect(order.currency).toBe("NZD");
    expect(order.lines.map((line) => line.lineTotal)).toEqual([4000, 2000]);
  });
});
