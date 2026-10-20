import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

// The colour tokens in styles/globals.css, checked against WCAG 2.2:
// body text at least 4.5:1, large text and UI parts (focus rings,
// decoration that carries meaning) at least 3:1.

const css = readFileSync(
  new URL("../styles/globals.css", import.meta.url),
  "utf8",
);

function readTokens(source) {
  const root = source.match(/:root\s*{([\s\S]*?)\n}/)[1];
  const raw = {};
  for (const [, name, value] of root.matchAll(/--([\w-]+):\s*([^;]+);/g)) {
    raw[name] = value.trim();
  }
  const resolve = (value) => {
    const ref = value.match(/^var\(--([\w-]+)\)$/);
    return ref ? resolve(raw[ref[1]]) : value;
  };
  return Object.fromEntries(
    Object.entries(raw).map(([name, value]) => [name, resolve(value)]),
  );
}

const tokens = readTokens(css);

function luminance(hex) {
  const value = hex.replace("#", "");
  const channels = [0, 2, 4].map((i) => parseInt(value.slice(i, i + 2), 16));
  const [r, g, b] = channels.map((c) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a, b) {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}

const colour = (name) => (name.startsWith("#") ? name : tokens[name]);

// [foreground, background] pairs the stylesheets actually use.
const TEXT_PAIRS = [
  ...["ink", "ink-soft", "muted", "accent"].flatMap((fg) =>
    ["cream", "cream-deep", "surface"].map((bg) => [fg, bg]),
  ),
  ["ink-soft", "sage-soft"], // About: the packaging band
  ["#ffffff", "accent"], // buttons, the cart count
  ["#ffffff", "accent-hover"], // buttons on hover
  ["#ffffff", "ink"], // the skip link
];

const LARGE_OR_UI_PAIRS = [
  ["terracotta", "cream"], // large display text and decoration only
  ...["cream", "cream-deep", "surface"].map((bg) => ["focus-ring", bg]),
];

describe("colour tokens", () => {
  it("are all plain hex colours once var() references are resolved", () => {
    for (const name of [
      "ink",
      "ink-soft",
      "muted",
      "accent",
      "accent-hover",
      "focus-ring",
      "cream",
      "cream-deep",
      "surface",
    ]) {
      expect(tokens[name], name).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });

  it.each(TEXT_PAIRS)("%s on %s is at least 4.5:1", (fg, bg) => {
    expect(contrast(colour(fg), colour(bg))).toBeGreaterThanOrEqual(4.5);
  });

  it.each(LARGE_OR_UI_PAIRS)("%s on %s is at least 3:1", (fg, bg) => {
    expect(contrast(colour(fg), colour(bg))).toBeGreaterThanOrEqual(3);
  });

  it("computes the WCAG ratio (black on white is 21:1)", () => {
    expect(contrast("#000000", "#ffffff")).toBeCloseTo(21, 5);
    expect(contrast("#847a6d", "#faf5ee")).toBeCloseTo(3.88, 2);
  });
});
