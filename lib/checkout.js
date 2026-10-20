import {
  CURRENCY,
  MAX_QTY,
  SHIPPING,
  candles,
  getCandle,
} from "../data/candles";

export const MAX_LINES = candles.length;

const isPlainObject = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);

const fail = (error) => ({ error });

// Checks a checkout request body: {items: [{slug, quantity}]}.
// The browser only says which candles and how many. Prices, names and
// shipping always come from the catalogue on the server.
export function parseCheckoutBody(body) {
  if (!isPlainObject(body)) return fail("Send your cart as a JSON object.");
  const extra = Object.keys(body).filter((key) => key !== "items");
  if (extra.length) return fail(`Unexpected field: ${extra[0]}.`);

  const { items } = body;
  if (!Array.isArray(items)) return fail("Your cart needs a list of items.");
  if (items.length === 0) return fail("Your cart is empty.");
  if (items.length > MAX_LINES) {
    return fail(`A cart can hold at most ${MAX_LINES} different candles.`);
  }

  const seen = new Set();
  const clean = [];
  for (const item of items) {
    if (!isPlainObject(item)) return fail("Each cart item must be an object.");
    const unexpected = Object.keys(item).filter(
      (key) => key !== "slug" && key !== "quantity",
    );
    if (unexpected.length) return fail(`Unexpected field: ${unexpected[0]}.`);

    const { slug, quantity } = item;
    if (typeof slug !== "string" || !getCandle(slug)) {
      return fail("One of the candles in your cart isn't in our range.");
    }
    if (seen.has(slug)) return fail("Each candle can only appear once.");
    seen.add(slug);

    if (
      typeof quantity !== "number" ||
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      quantity > MAX_QTY
    ) {
      return fail(`Quantities must be whole numbers from 1 to ${MAX_QTY}.`);
    }
    clean.push({ slug, quantity });
  }
  return { items: clean };
}

// Prices a validated cart from the catalogue. All amounts in NZD cents.
export function buildOrder(items) {
  const lines = items.map(({ slug, quantity }) => {
    const candle = getCandle(slug);
    return {
      slug,
      name: candle.name,
      quantity,
      unitAmount: candle.unitAmount,
      lineTotal: candle.unitAmount * quantity,
    };
  });
  const subtotal = lines.reduce((sum, line) => sum + line.lineTotal, 0);
  return {
    lines,
    subtotal,
    shipping: SHIPPING.amount,
    total: subtotal + SHIPPING.amount,
    currency: CURRENCY.toUpperCase(),
  };
}

// Stripe Checkout Session parameters for a priced order.
export function buildSessionParams(order, origin) {
  return {
    mode: "payment",
    billing_address_collection: "auto",
    shipping_address_collection: {
      allowed_countries: [...SHIPPING.countries],
    },
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: { amount: SHIPPING.amount, currency: CURRENCY },
          display_name: SHIPPING.displayName,
          delivery_estimate: {
            minimum: { unit: "business_day", value: SHIPPING.minBusinessDays },
            maximum: { unit: "business_day", value: SHIPPING.maxBusinessDays },
          },
        },
      },
    ],
    line_items: order.lines.map((line) => ({
      quantity: line.quantity,
      price_data: {
        currency: CURRENCY,
        unit_amount: line.unitAmount,
        product_data: { name: `${line.name} candle` },
      },
    })),
    success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/cart`,
  };
}
