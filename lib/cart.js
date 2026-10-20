import { MAX_QTY, SHIPPING, getCandle } from "../data/candles";

// The cart is {lines: {[slug]: quantity}}. Totals are always derived from
// the catalogue, never stored. All amounts are NZD cents.

export const STORAGE_KEY = "eon-cart";
export const LEGACY_STORAGE_KEY = "cart";
const VERSION = 2;

export const emptyCart = Object.freeze({ lines: Object.freeze({}) });

const isWholeNumber = (value) =>
  typeof value === "number" && Number.isInteger(value);

const clampQty = (quantity) => Math.min(MAX_QTY, Math.max(1, quantity));

const isPlainObject = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);

export function cartReducer(state, action) {
  switch (action.type) {
    case "ADD": {
      const { slug, quantity = 1 } = action;
      if (!getCandle(slug) || !isWholeNumber(quantity) || quantity < 1) {
        return state;
      }
      const next = clampQty((state.lines[slug] ?? 0) + quantity);
      return { lines: { ...state.lines, [slug]: next } };
    }
    case "SET_QTY": {
      const { slug, quantity } = action;
      if (!(slug in state.lines) || !isWholeNumber(quantity)) return state;
      return { lines: { ...state.lines, [slug]: clampQty(quantity) } };
    }
    case "REMOVE_LINE": {
      if (!(action.slug in state.lines)) return state;
      const lines = { ...state.lines };
      delete lines[action.slug];
      return { lines };
    }
    case "CLEAR":
      return emptyCart;
    case "LOAD":
      return normaliseLines(action.lines);
    default:
      return state;
  }
}

// Keeps known candles with whole-number quantities, clamped to 1 to 10.
export function normaliseLines(input) {
  if (!isPlainObject(input)) return emptyCart;
  const lines = {};
  for (const [slug, quantity] of Object.entries(input)) {
    if (getCandle(slug) && isWholeNumber(quantity) && quantity >= 1) {
      lines[slug] = clampQty(quantity);
    }
  }
  return { lines };
}

// Selectors
export const cartCount = (state) =>
  Object.values(state.lines).reduce((sum, quantity) => sum + quantity, 0);

export const cartLines = (state) =>
  Object.entries(state.lines).map(([slug, quantity]) => {
    const candle = getCandle(slug);
    return {
      slug,
      name: candle.name,
      quantity,
      unitAmount: candle.unitAmount,
      lineTotal: candle.unitAmount * quantity,
    };
  });

export const cartSubtotal = (state) =>
  cartLines(state).reduce((sum, line) => sum + line.lineTotal, 0);

export const cartShipping = (state) =>
  cartCount(state) > 0 ? SHIPPING.amount : 0;

export const cartTotal = (state) => cartSubtotal(state) + cartShipping(state);

// Storage

const parseJson = (raw) => {
  if (typeof raw !== "string") return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

// Reads the current {v: 2, lines} format. Anything else is an empty cart.
export function parseStoredCart(raw) {
  const data = parseJson(raw);
  if (!isPlainObject(data) || data.v !== VERSION) return emptyCart;
  return normaliseLines(data.lines);
}

// Reads the old format: {cartDetails: {[priceId]: {name, quantity, ...}}},
// where each entry's name is the candle's slug.
export function migrateLegacyCart(raw) {
  const data = parseJson(raw);
  if (!isPlainObject(data) || !isPlainObject(data.cartDetails)) {
    return emptyCart;
  }
  const lines = {};
  for (const entry of Object.values(data.cartDetails)) {
    if (!isPlainObject(entry)) continue;
    const { name, quantity } = entry;
    if (typeof name !== "string" || !getCandle(name)) continue;
    if (!isWholeNumber(quantity) || quantity < 1) continue;
    lines[name] = (lines[name] ?? 0) + quantity;
  }
  return normaliseLines(lines);
}

export const serialiseCart = (state) =>
  JSON.stringify({ v: VERSION, lines: state.lines });

// Loads the saved cart, migrating and removing the old key if present.
// Never throws: blocked or corrupt storage gives an empty cart.
export function loadCart(storage) {
  try {
    const current = storage.getItem(STORAGE_KEY);
    if (current !== null) return parseStoredCart(current);
    const legacy = storage.getItem(LEGACY_STORAGE_KEY);
    if (legacy === null) return emptyCart;
    const cart = migrateLegacyCart(legacy);
    storage.setItem(STORAGE_KEY, serialiseCart(cart));
    storage.removeItem(LEGACY_STORAGE_KEY);
    return cart;
  } catch {
    return emptyCart;
  }
}

export function saveCart(storage, state) {
  try {
    storage.setItem(STORAGE_KEY, serialiseCart(state));
  } catch {
    // Storage can be full or blocked; the cart still works for this visit.
  }
}
