// Checking a Stripe Checkout session before the order page thanks anyone.
//
// Stripe adds ?session_id=cs_... to the return URL, but anyone can type
// one. The order page asks the server, the server asks Stripe, and only a
// completed, paid session counts as an order.

// The shape of a Checkout Session id. Anything else is never sent to Stripe.
export const SESSION_ID = /^cs_(test|live)_[A-Za-z0-9]{1,250}$/;

/**
 * @param {unknown} value
 * @returns {value is string}
 */
export function isSessionId(value) {
  return typeof value === "string" && SESSION_ID.test(value);
}

/**
 * Whether a session id belongs to the same Stripe mode as the key. A test
 * key can't see live sessions and a live key can't see test ones, so a
 * mismatch is answered without asking Stripe.
 * @param {string} id
 * @param {boolean} liveKey
 */
export const sameStripeMode = (id, liveKey) =>
  id.startsWith("cs_live_") === liveKey;

/**
 * @typedef {{status: "paid", total: number, currency: string, live: boolean}
 *   | {status: "unpaid"}} SessionOutcome
 */

/**
 * What the order page may know about a session: whether it is paid, the
 * total and whether it was a live payment. Nothing about the shopper, such
 * as their name, email or address, leaves the server.
 * @param {Pick<import("stripe").Stripe.Checkout.Session,
 *   "status" | "payment_status" | "amount_total" | "currency" | "livemode">} session
 * @returns {SessionOutcome}
 */
export function sessionOutcome(session) {
  const paid =
    session.status === "complete" &&
    (session.payment_status === "paid" ||
      session.payment_status === "no_payment_required");
  if (!paid) return { status: "unpaid" };
  return {
    status: "paid",
    total: typeof session.amount_total === "number" ? session.amount_total : 0,
    currency: String(session.currency || "nzd").toUpperCase(),
    live: session.livemode === true,
  };
}
