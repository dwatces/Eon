import { describe, expect, it } from "vitest";
import { nextIndex, prevIndex } from "../lib/gallery.js";

describe("gallery index helpers", () => {
  it("moves forward and wraps from the last photo to the first", () => {
    expect(nextIndex(0, 4)).toBe(1);
    expect(nextIndex(3, 4)).toBe(0);
  });

  it("moves back and wraps from the first photo to the last", () => {
    expect(prevIndex(1, 4)).toBe(0);
    expect(prevIndex(0, 4)).toBe(3);
  });

  it("stays at 0 for an empty gallery", () => {
    expect(nextIndex(0, 0)).toBe(0);
    expect(prevIndex(0, 0)).toBe(0);
  });
});
