// Decides, per request, whether checkout may hand off to Stripe.
//
// Stripe mode needs a test key (sk_test_ or rk_test_), or any key plus
// EON_ALLOW_LIVE_PAYMENTS=true. Everything else, including a missing or
// blank key, is demo mode: the order is priced on the server and no
// payment is taken. This keeps a forgotten live key from switching real
// card payments on.

const TEST_KEY = /^(sk|rk)_test_/;

/**
 * @typedef {{mode: "demo", reason: "no-key" | "live-key-without-opt-in"}
 *   | {mode: "stripe", live: boolean, key: string}} CheckoutMode
 */

/**
 * @param {Record<string, string | undefined>} [env]
 * @returns {CheckoutMode}
 */
export function resolveCheckoutMode(env = process.env) {
  const key =
    typeof env.STRIPE_SECRET_KEY === "string"
      ? env.STRIPE_SECRET_KEY.trim()
      : "";
  if (!key) return { mode: "demo", reason: "no-key" };
  if (TEST_KEY.test(key)) return { mode: "stripe", live: false, key };
  if (env.EON_ALLOW_LIVE_PAYMENTS === "true") {
    return { mode: "stripe", live: true, key };
  }
  return { mode: "demo", reason: "live-key-without-opt-in" };
}

/**
 * Test-only: point the Stripe SDK at a local stub instead of Stripe.
 * Honoured only for localhost or 127.0.0.1, so it can never redirect
 * real requests elsewhere.
 * @param {Record<string, string | undefined>} [env]
 * @returns {import("stripe").Stripe.StripeConfig}
 */
export function stripeHostOptions(env = process.env) {
  const value =
    typeof env.EON_STRIPE_API_BASE === "string"
      ? env.EON_STRIPE_API_BASE.trim()
      : "";
  if (!value) return {};
  try {
    const url = new URL(value);
    if (!["127.0.0.1", "localhost"].includes(url.hostname)) return {};
    return {
      host: url.hostname,
      port: Number(url.port) || (url.protocol === "https:" ? 443 : 80),
      protocol: url.protocol === "https:" ? "https" : "http",
    };
  } catch {
    return {};
  }
}

// For the cart page, at build time: whether checkout can take real money.
// A boolean only, never the key.
export const paymentsLive = (env = process.env) => {
  const checkout = resolveCheckoutMode(env);
  return checkout.mode === "stripe" && checkout.live === true;
};
