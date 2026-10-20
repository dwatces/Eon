import {
  resolveCheckoutMode,
  stripeHostOptions,
} from "../../../lib/checkout-mode";
import {
  isSessionId,
  sameStripeMode,
  sessionOutcome,
} from "../../../lib/checkout-session";

// GET /api/checkout_sessions/cs_... : asks Stripe whether a Checkout
// session is paid, so the order page only thanks shoppers for real orders.
// The answer holds the outcome and the total, never the shopper's details.

const NOT_FOUND = "We couldn't find that checkout.";
const CHECK_FAILED = "We couldn't check your order. Please try again.";

/** @param {any} err */
const isMissing = (err) =>
  err?.type === "StripeInvalidRequestError" &&
  (err?.statusCode === 404 || err?.code === "resource_missing");

/**
 * @param {import("next").NextApiRequest} req
 * @param {import("next").NextApiResponse} res
 */
export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Use GET to check an order." });
  }

  const id = req.query.id;
  const checkout = resolveCheckoutMode(process.env);
  // Demo mode has no Stripe sessions, and a malformed or other-mode id
  // can't be one of ours. None of these reach Stripe.
  if (
    checkout.mode !== "stripe" ||
    !isSessionId(id) ||
    !sameStripeMode(id, checkout.live)
  ) {
    return res.status(404).json({ error: NOT_FOUND });
  }

  try {
    const { default: Stripe } = await import("stripe");
    const stripe = new Stripe(checkout.key, stripeHostOptions(process.env));
    const session = await stripe.checkout.sessions.retrieve(id);
    return res.status(200).json(sessionOutcome(session));
  } catch (err) {
    if (isMissing(err)) return res.status(404).json({ error: NOT_FOUND });
    const type = typeof err?.type === "string" ? err.type : "UnknownError";
    const code = typeof err?.code === "string" ? ` ${err.code}` : "";
    console.error(`Order check: Stripe error ${type}${code}`);
    return res.status(502).json({ error: CHECK_FAILED });
  }
}
