// Every product photo for each candle, as static imports with alt text:
// the card photos (data/card-images.js) plus the gallery's flower, lit
// and crystal shots. Only the product page needs all of them.

import { cardImages } from "./card-images";
import loveFlower from "../assets/images/candles/love-flower.webp";
import loveLit from "../assets/images/candles/love-lit.webp";
import loveCrystal from "../assets/images/candles/love-crystal.webp";
import happinessFlower from "../assets/images/candles/happiness-flower.webp";
import happinessLit from "../assets/images/candles/happiness-lit.webp";
import happinessCrystal from "../assets/images/candles/happiness-crystal.webp";
import dreamsFlower from "../assets/images/candles/dreams-flower.webp";
import dreamsLit from "../assets/images/candles/dreams-lit.webp";
import dreamsCrystal from "../assets/images/candles/dreams-crystal.webp";
import summerFlower from "../assets/images/candles/summer-flower.webp";
import summerLit from "../assets/images/candles/summer-lit.webp";
import summerCrystal from "../assets/images/candles/summer-crystal.webp";

export const candleImages = {
  love: {
    ...cardImages.love,
    flower: { src: loveFlower, alt: "Love candle with red carnations" },
    lit: { src: loveLit, alt: "Love candle lit, with the lid off" },
    crystal: { src: loveCrystal, alt: "Love candle with rose quartz crystals" },
  },
  happiness: {
    ...cardImages.happiness,
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
    ...cardImages.dreams,
    flower: { src: dreamsFlower, alt: "Dreams candle with purple flowers" },
    lit: { src: dreamsLit, alt: "Dreams candle lit, with the lid off" },
    crystal: {
      src: dreamsCrystal,
      alt: "Dreams candle with amethyst crystals",
    },
  },
  summer: {
    ...cardImages.summer,
    flower: {
      src: summerFlower,
      alt: "Summer candle with white chrysanthemums",
    },
    lit: { src: summerLit, alt: "Summer candle lit, with the lid off" },
    crystal: {
      src: summerCrystal,
      alt: "Summer candle with green crystal stones",
    },
  },
};

export const imageFor = (slug, kind = "lid") =>
  candleImages[slug]?.[kind] ?? null;
