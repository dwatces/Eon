import { candles } from "../data/candles";

// Saved carts are still keyed by these ids. They go once the cart is
// keyed by slug.
const SAVED_CART_IDS = {
  love: "price_1KTa4GIILjXbtSkjqSx6HWRR",
  happiness: "price_1KTa3qIILjXbtSkjkD1GsKS9",
  dreams: "price_1KTa3YIILjXbtSkj77yFEYtG",
  summer: "price_1KTa2yIILjXbtSkj71FY8dLm",
};

export const products = candles.map((candle) => ({
  id: SAVED_CART_IDS[candle.slug],
  name: candle.slug,
  price: candle.unitAmount,
  currency: "NZD",
}));
