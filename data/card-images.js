// The two photos used on cards and in the cart: the top-down shot and
// the tin with its lid propped open. Kept apart from the gallery photos
// (data/candle-images.js), so pages that only show cards load just these
// eight images' details.

import loveLid from "../public/lid-love.webp";
import happinessLid from "../public/lid-happiness.webp";
import dreamsLid from "../public/lid-dreams.webp";
import summerLid from "../public/lid-summer.webp";
import loveTop from "../public/top-love.webp";
import happinessTop from "../public/top-happy.webp";
import dreamsTop from "../public/top-dream.webp";
import summerTop from "../public/top-summer.webp";

export const cardImages = {
  love: {
    top: { src: loveTop, alt: "Love candle seen from above" },
    lid: { src: loveLid, alt: "Love candle in a gold tin, lid propped open" },
  },
  happiness: {
    top: { src: happinessTop, alt: "Happiness candle seen from above" },
    lid: {
      src: happinessLid,
      alt: "Happiness candle in a gold tin, lid propped open",
    },
  },
  dreams: {
    top: { src: dreamsTop, alt: "Dreams candle seen from above" },
    lid: {
      src: dreamsLid,
      alt: "Dreams candle in a gold tin, lid propped open",
    },
  },
  summer: {
    top: { src: summerTop, alt: "Summer candle seen from above" },
    lid: {
      src: summerLid,
      alt: "Summer candle in a gold tin, lid propped open",
    },
  },
};

export const cardImage = (slug, kind = "lid") =>
  cardImages[slug]?.[kind] ?? null;
