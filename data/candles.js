// The Eon candle range: one entry per candle, in display order.
//
// Plain data only (no image imports), so the checkout API and the unit
// tests can import it without a bundler. Prices are integer New Zealand
// cents. Product descriptions live in data/candle-copy.js and images in
// data/candle-images.js and data/card-images.js, so the cart (on every
// page) stays small.

export const CURRENCY = "nzd";

// Most of one candle in a single order.
export const MAX_QTY = 10;

// Flat-rate New Zealand shipping, the same rate the shop has always used.
export const SHIPPING = Object.freeze({
  amount: 500,
  displayName: "New Zealand",
  label: "New Zealand only, 1 to 3 business days",
  countries: Object.freeze(["NZ"]),
  minBusinessDays: 1,
  maxBusinessDays: 3,
});

const deepFreeze = (value) => {
  Object.values(value).forEach((child) => {
    if (child && typeof child === "object") deepFreeze(child);
  });
  return Object.freeze(value);
};

export const candles = deepFreeze([
  {
    slug: "love",
    name: "Love",
    unitAmount: 2000,
    notes: {
      scent: "Rose Otto, Ylang Ylang, Orange & Patchouli",
      crystal: "Rose Quartz Chips",
      botanicals: "Rose Bud",
    },
    imageKeys: ["lid", "flower", "lit", "crystal"],
  },
  {
    slug: "happiness",
    name: "Happiness",
    unitAmount: 2000,
    notes: {
      scent: "Wild Orange, Clary Sage & Lemon",
      crystal: "Citrine Chips",
      botanicals: "Jasmine Flower Petals",
    },
    imageKeys: ["lid", "flower", "lit", "crystal"],
  },
  {
    slug: "dreams",
    name: "Dreams",
    unitAmount: 2000,
    notes: {
      scent: "Lavender, Chamomile & Frankincense",
      crystal: "Amethyst Chips",
      botanicals: "Cornflowers",
    },
    imageKeys: ["lid", "flower", "lit", "crystal"],
  },
  {
    slug: "summer",
    name: "Summer",
    unitAmount: 2000,
    notes: {
      scent: "Coconut, Mango & Lime",
      crystal: "Aventurine Chips",
      botanicals: "Lavender Flowers",
    },
    imageKeys: ["lid", "flower", "lit", "crystal"],
  },
]);

export const getCandle = (slug) =>
  candles.find((candle) => candle.slug === slug) ?? null;

export const allSlugs = () => candles.map((candle) => candle.slug);
