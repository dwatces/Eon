import { MAX_QTY, getCandle } from "../data/candles";
import { MAX_LINES } from "./checkout";

// A demo checkout hands its priced order to /success through
// sessionStorage. The record also notes whether the cart has been
// emptied for it, so a reload of /success never empties a newer cart.

export const DEMO_ORDER_KEY = "eon-demo-order";
const VERSION = 1;

const isCount = (value, min, max) =>
  Number.isInteger(value) && value >= min && value <= max;

const isCents = (value) => Number.isInteger(value) && value >= 0;

// Accepts only an order shaped like the API's demo response, with sums
// that add up and candles from the catalogue.
export function isValidOrder(order) {
  if (!order || typeof order !== "object") return false;
  const { lines, subtotal, shipping, total, currency } = order;
  if (!Array.isArray(lines) || !isCount(lines.length, 1, MAX_LINES)) {
    return false;
  }
  const linesOk = lines.every(
    (line) =>
      line &&
      typeof line === "object" &&
      getCandle(line.slug)?.name === line.name &&
      isCount(line.quantity, 1, MAX_QTY) &&
      isCents(line.unitAmount) &&
      line.lineTotal === line.unitAmount * line.quantity,
  );
  if (!linesOk) return false;
  const sum = lines.reduce((acc, line) => acc + line.lineTotal, 0);
  return (
    currency === "NZD" &&
    subtotal === sum &&
    isCents(shipping) &&
    total === subtotal + shipping
  );
}

// Throws if storage is blocked or full, so the caller can show the
// order where it is instead.
export function saveDemoOrder(storage, order) {
  storage.setItem(
    DEMO_ORDER_KEY,
    JSON.stringify({ v: VERSION, order, cartCleared: false }),
  );
}

// Returns {order, cartCleared} or null. Never throws.
export function readDemoOrder(storage) {
  try {
    const data = JSON.parse(storage.getItem(DEMO_ORDER_KEY));
    if (!data || data.v !== VERSION || !isValidOrder(data.order)) return null;
    return { order: data.order, cartCleared: data.cartCleared === true };
  } catch {
    return null;
  }
}

export function markCartCleared(storage) {
  const saved = readDemoOrder(storage);
  if (!saved) return;
  try {
    storage.setItem(
      DEMO_ORDER_KEY,
      JSON.stringify({ v: VERSION, order: saved.order, cartCleared: true }),
    );
  } catch {
    // Nothing to do: the worst case is that a reload empties the cart again.
  }
}
