// The two photos used on cards and in the cart: the top-down shot and
// the tin with its lid propped open. Kept apart from the gallery photos
// (data/candle-images.js), so pages that only show cards load just these
// eight images' details.

import loveLid from "../assets/images/candles/love-lid.webp";
import happinessLid from "../assets/images/candles/happiness-lid.webp";
import dreamsLid from "../assets/images/candles/dreams-lid.webp";
import summerLid from "../assets/images/candles/summer-lid.webp";
import loveTop from "../assets/images/candles/love-top.webp";
import happinessTop from "../assets/images/candles/happiness-top.webp";
import dreamsTop from "../assets/images/candles/dreams-top.webp";
import summerTop from "../assets/images/candles/summer-top.webp";

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
