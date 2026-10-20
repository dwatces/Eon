import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { allSlugs } from "../data/candles.js";
import { candleImages, imageFor } from "../data/candle-images.js";

const PLACEHOLDER_ALT = /^\s|\s$|main|topdown|banner|desktop/i;

describe("candle images", () => {
  it("has a photo set for every candle in the catalogue", () => {
    expect(Object.keys(candleImages).sort()).toEqual(allSlugs().sort());
  });

  it("points every image at a file that exists", () => {
    for (const set of Object.values(candleImages)) {
      for (const image of Object.values(set)) {
        expect(existsSync(image.src.src), image.src.src).toBe(true);
      }
    }
  });

  it("gives every image descriptive alt text naming its candle", () => {
    for (const [slug, set] of Object.entries(candleImages)) {
      for (const image of Object.values(set)) {
        expect(image.alt).not.toMatch(PLACEHOLDER_ALT);
        expect(image.alt.toLowerCase()).toContain(slug);
      }
    }
  });

  it("looks images up by slug and kind", () => {
    expect(imageFor("love", "top").alt).toBe("Love candle seen from above");
    expect(imageFor("nope")).toBeNull();
  });
});
