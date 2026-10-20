// Every product photo for each candle, as static imports with alt text:
// the card photos (data/card-images.js) plus the gallery's flower, lit
// and crystal shots. Only the product page needs all of them.

import { cardImages } from "./card-images";
import loveFlower from "../public/Flower-love.webp";
import loveLit from "../public/lit-love.webp";
import loveCrystal from "../public/crystal-love.webp";
import happinessFlower from "../public/Flower-Happy2.webp";
import happinessLit from "../public/lit-happy.webp";
import happinessCrystal from "../public/Crystal-Happy.webp";
import dreamsFlower from "../public/Flower-Dream.webp";
import dreamsLit from "../public/lit-dreams.webp";
import dreamsCrystal from "../public/Crystal-dreams.webp";
import summerFlower from "../public/Flower-Summer.webp";
import summerLit from "../public/lit-summer.webp";
import summerCrystal from "../public/crystal-summer.webp";

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
    crystal: { src: summerCrystal, alt: "Summer candle with crystal stones" },
  },
};

export const imageFor = (slug, kind = "lid") =>
  candleImages[slug]?.[kind] ?? null;
