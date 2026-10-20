// The Eon candle range: one entry per candle, in display order.
//
// Plain data only (no image imports), so the checkout API and the unit
// tests can import it without a bundler. Images and alt text live in
// data/candle-images.js. Prices are integer New Zealand cents.

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
    description:
      "Our rose otto, ylang ylang, orange, and patchouli scented candle smells divine and has been precisely paired with rose quartz chips and rose buds to amplify and attract love into your life. Rose Quartz is a very popular crystal, and one of our favourites for its powerful and varied benefits. Rose Quartz is calming; providing a reassuring and gentle atmosphere to any room. Rose quartz promotes love, friendship, healing and deep inner peace but most importantly, rose quartz has the powerful ability to dispel negativity and replace it with positive energies. This is why we chose to imbue our rose otto, ylang ylang, orange, and patchouli crystal with rose quarts, we truely believe it will amplify the loves in your life to new heights!",
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
    description:
      "Fill the room with positive energies and appreciation for all the good in life with the beautiful scents of wild orange, clary sage, and lemon. This candle comes paired with citrine chips that channel happiness, and jasmine flower petals for clarity and perspective. Citrine is a powerful crystal with a deep, cheerful colouring, it promotes optimism, happiness and it is believed to manifest financial good fortunes. The sight and scents of this candle will help you appreciate the little things and spread cheer and happiness throughout your home and life.",
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
    description:
      "Follow your dreams with our lavender, chamomile, and frankincense candle. Paired with the powerful energy of amethyst crystals to provide clarity of mind, and cornflowers to bring wealth and good fortune. Amethyst stones are a symbol of peace, of cleansing and calming energies. The relaxing scent of this candle paired with the clarity of mind form the amethyst crystals will help ground you and help you focus on what really matters to you in life whatever that may be. We truely believe this candle helps us reach for the stars.",
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
    description:
      "Bring on the summer vibes with our coconut, mango, and lime scented candle. Paired with both aventurine crystal shards for good blessings and lavender flowers for peace and grace. This candle smells like summers by the beach, the scent will bring you back to good times in the sun with family and friends and the powerful adventurine crystal shards will help you seize the day. Adventurine is a stone of positive prosperity, it promotes compassion, leadership and perseverance by amplifying the natural strengths within you. It also helps you let go of negative emotions and focus on the positives.",
    imageKeys: ["lid", "flower", "lit", "crystal"],
  },
]);

export const getCandle = (slug) =>
  candles.find((candle) => candle.slug === slug) ?? null;

export const allSlugs = () => candles.map((candle) => candle.slug);
