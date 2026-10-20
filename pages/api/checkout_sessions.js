import {
  buildOrder,
  buildSessionParams,
  parseCheckoutBody,
} from "../../lib/checkout";
import {
  resolveCheckoutMode,
  stripeHostOptions,
} from "../../lib/checkout-mode";
import { resolveReturnOrigin } from "../../lib/site";

export const config = { api: { bodyParser: { sizeLimit: "8kb" } } };

const GENERIC_ERROR = "We couldn't start checkout. Please try again.";

// Stripe errors that mean the key itself is unusable (revoked, expired or
// missing permissions). Checkout then falls back to demo mode instead of
// failing for every shopper.
const KEY_ERRORS = new Set([
  "StripeAuthenticationError",
  "StripePermissionError",
]);

const isJson = (contentType = "") =>
  /^application\/json(\s*;|$)/i.test(String(contentType).trim());

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Use POST to start checkout." });
  }
  if (!isJson(req.headers["content-type"])) {
    return res.status(415).json({ error: "Send your cart as JSON." });
  }

  const parsed = parseCheckoutBody(req.body);
  if (parsed.error) return res.status(400).json({ error: parsed.error });
  const order = buildOrder(parsed.items);

  const checkout = resolveCheckoutMode(process.env);
  if (checkout.mode === "demo") {
    if (checkout.reason === "live-key-without-opt-in") {
      console.warn(
        "Checkout: a live Stripe key is set without EON_ALLOW_LIVE_PAYMENTS=true, so checkout runs in demo mode.",
      );
    }
    return res.status(200).json({ mode: "demo", order });
  }

  try {
    const { default: Stripe } = await import("stripe");
    const stripe = new Stripe(checkout.key, stripeHostOptions(process.env));
    const session = await stripe.checkout.sessions.create(
      buildSessionParams(order, resolveReturnOrigin(req)),
    );
    if (typeof session?.url !== "string") {
      throw new Error("Stripe returned no checkout URL");
    }
    return res.status(200).json({ mode: "stripe", url: session.url });
  } catch (err) {
    const type = typeof err?.type === "string" ? err.type : "UnknownError";
    if (KEY_ERRORS.has(type)) {
      console.warn(
        `Checkout: Stripe refused the configured key (${type}), so checkout runs in demo mode.`,
      );
      return res.status(200).json({ mode: "demo", order });
    }
    const code = typeof err?.code === "string" ? ` ${err.code}` : "";
    console.error(`Checkout: Stripe error ${type}${code}`);
    return res.status(502).json({ error: GENERIC_ERROR });
  }
}
