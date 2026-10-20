// Product photos for each candle, as static imports with alt text.
// Only UI components import this file; the checkout API and the unit
// tests for the catalogue use data/candles.js instead.

import loveLid from "../public/lid-love.webp";
import loveFlower from "../public/Flower-love.webp";
import loveLit from "../public/lit-love.webp";
import loveCrystal from "../public/crystal-love.webp";
import happinessLid from "../public/lid-happiness.webp";
import happinessFlower from "../public/Flower-Happy2.webp";
import happinessLit from "../public/lit-happy.webp";
import happinessCrystal from "../public/Crystal-Happy.webp";
import dreamsLid from "../public/lid-dreams.webp";
import dreamsFlower from "../public/Flower-Dream.webp";
import dreamsLit from "../public/lit-dreams.webp";
import dreamsCrystal from "../public/Crystal-dreams.webp";
import summerLid from "../public/lid-summer.webp";
import summerFlower from "../public/Flower-Summer.webp";
import summerLit from "../public/lit-summer.webp";
import summerCrystal from "../public/crystal-summer.webp";
import loveTop from "../public/top-love.webp";
import happinessTop from "../public/top-happy.webp";
import dreamsTop from "../public/top-dream.webp";
import summerTop from "../public/top-summer.webp";

export const candleImages = {
  love: {
    top: { src: loveTop, alt: "Love candle seen from above" },
    lid: { src: loveLid, alt: "Love candle in a gold tin, lid propped open" },
    flower: { src: loveFlower, alt: "Love candle with red carnations" },
    lit: { src: loveLit, alt: "Love candle lit, with the lid off" },
    crystal: { src: loveCrystal, alt: "Love candle with rose quartz crystals" },
  },
  happiness: {
    top: { src: happinessTop, alt: "Happiness candle seen from above" },
    lid: {
      src: happinessLid,
      alt: "Happiness candle in a gold tin, lid propped open",
    },
    flower: {
      src: happinessFlower,
      alt: "Happiness candle with orange flowers",
    },
    lit: { src: happinessLit, alt: "Happiness candle lit, with the lid off" },
    crystal: {
      src: happinessCrystal,
      alt: "Happiness candle with citrine crystals",
    },
  },
  dreams: {
    top: { src: dreamsTop, alt: "Dreams candle seen from above" },
    lid: {
      src: dreamsLid,
      alt: "Dreams candle in a gold tin, lid propped open",
    },
    flower: { src: dreamsFlower, alt: "Dreams candle with purple flowers" },
    lit: { src: dreamsLit, alt: "Dreams candle lit, with the lid off" },
    crystal: {
      src: dreamsCrystal,
      alt: "Dreams candle with amethyst crystals",
    },
  },
  summer: {
    top: { src: summerTop, alt: "Summer candle seen from above" },
    lid: {
      src: summerLid,
      alt: "Summer candle in a gold tin, lid propped open",
    },
    flower: {
      src: summerFlower,
      alt: "Summer candle with white chrysanthemums",
    },
    lit: { src: summerLit, alt: "Summer candle lit, with the lid off" },
    crystal: { src: summerCrystal, alt: "Summer candle with crystal stones" },
  },
};

export const imageFor = (slug, kind = "lid") =>
  candleImages[slug]?.[kind] ?? null;
