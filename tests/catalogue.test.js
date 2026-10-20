import { describe, expect, it } from "vitest";
import {
  MAX_QTY,
  SHIPPING,
  allSlugs,
  candles,
  getCandle,
} from "../data/candles.js";
import { candleCopy, descriptionFor } from "../data/candle-copy.js";

describe("candle catalogue", () => {
  it("has the four candles in display order", () => {
    expect(allSlugs()).toEqual(["love", "happiness", "dreams", "summer"]);
  });

  it("has unique, URL-safe slugs", () => {
    const slugs = allSlugs();
    expect(new Set(slugs).size).toBe(slugs.length);
    slugs.forEach((slug) => expect(slug).toMatch(/^[a-z0-9-]+$/));
  });

  it("prices every candle in positive integer cents", () => {
    candles.forEach((candle) => {
      expect(Number.isInteger(candle.unitAmount)).toBe(true);
      expect(candle.unitAmount).toBeGreaterThan(0);
    });
  });

  it("gives every candle a display name, notes and a description", () => {
    candles.forEach((candle) => {
      expect(candle.name).toMatch(/^[A-Z]/);
      expect(candle.notes.scent).toBeTruthy();
      expect(candle.notes.crystal).toBeTruthy();
      expect(candle.notes.botanicals).toBeTruthy();
      expect(descriptionFor(candle.slug).length).toBeGreaterThan(100);
    });
    expect(Object.keys(candleCopy)).toEqual(allSlugs());
  });

  it("holds no Stripe identifiers", () => {
    expect(JSON.stringify(candles)).not.toMatch(/price_|prod_/);
  });

  it("looks candles up by slug", () => {
    expect(getCandle("dreams").name).toBe("Dreams");
    expect(getCandle("hapiness")).toBeNull();
    expect(getCandle(undefined)).toBeNull();
  });

  it("cannot be changed at runtime", () => {
    expect(Object.isFrozen(candles)).toBe(true);
    expect(Object.isFrozen(candles[0].notes)).toBe(true);
    expect(() => {
      candles[0].unitAmount = 1;
    }).toThrow();
  });

  it("keeps the order limits and the flat NZ shipping rate", () => {
    expect(MAX_QTY).toBe(10);
    expect(SHIPPING.amount).toBe(500);
    expect(SHIPPING.countries).toEqual(["NZ"]);
  });
});
