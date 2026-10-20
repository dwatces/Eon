// The browser side of checkout: ask the API to price the cart, then either
// hand off to Stripe Checkout or show the demo order.

// Only ever send the shopper to Stripe's own checkout page.
export function isStripeCheckoutUrl(value) {
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      url.hostname === "checkout.stripe.com" &&
      url.port === "" &&
      url.username === "" &&
      url.password === ""
    );
  } catch {
    return false;
  }
}

export class CheckoutError extends Error {}

// Posts {items: [{slug, quantity}]} and returns either
// {kind: "stripe", url} or {kind: "demo", order}. Anything else throws a
// CheckoutError, so the page can show one plain message.
export async function requestCheckout(items, fetchImpl = fetch) {
  let response;
  try {
    response = await fetchImpl("/api/checkout_sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: items.map(({ slug, quantity }) => ({ slug, quantity })),
      }),
    });
  } catch {
    throw new CheckoutError("network");
  }
  const data = await response.json().catch(() => null);
  if (!response.ok || !data)
    throw new CheckoutError(`status ${response.status}`);
  if (data.mode === "stripe") {
    if (!isStripeCheckoutUrl(data.url)) throw new CheckoutError("bad url");
    return { kind: "stripe", url: data.url };
  }
  if (data.mode === "demo" && data.order) {
    return { kind: "demo", order: data.order };
  }
  throw new CheckoutError("unexpected response");
}
