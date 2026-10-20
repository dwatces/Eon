import { useEffect, useSyncExternalStore } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import OrderSummary from "../components/OrderSummary";
import { useShoppingCart } from "../hooks/use-shopping-cart";
import { stripeCheckoutEnabled } from "../lib/checkout-mode";
import { markCartCleared, readDemoOrder } from "../lib/demo-order";
import styles from "../styles/Success.module.css";

// Stripe sends shoppers here with ?session_id=cs_... after checkout.
const STRIPE_SESSION_ID = /^cs_(test|live)_[A-Za-z0-9]+$/;
const CLEARED_SESSION_KEY = "eon-cleared-session";

// One boolean, decided at build time: whether this build hands checkout
// to Stripe at all. Without it, a session_id in the URL means nothing.
export function getStaticProps() {
  return { props: { stripeEnabled: stripeCheckoutEnabled(process.env) } };
}

const noSubscription = () => () => {};
const useHydrated = () =>
  useSyncExternalStore(
    noSubscription,
    () => true,
    () => false,
  );

const sessionStore = () => {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
};

// Which of the three states to show. Reads sessionStorage, so it only
// runs in the browser after hydration.
function resolveView(query, stripeEnabled) {
  if (query.demo === "1") {
    const storage = sessionStore();
    const saved = storage ? readDemoOrder(storage) : null;
    if (saved) return { kind: "demo", ...saved };
    return { kind: "none" };
  }
  const sessionId =
    typeof query.session_id === "string" ? query.session_id : "";
  if (stripeEnabled && STRIPE_SESSION_ID.test(sessionId)) {
    return { kind: "stripe", sessionId };
  }
  return { kind: "none" };
}

// A Stripe session empties the cart once, not on every later visit.
function firstVisitFor(sessionId) {
  const storage = sessionStore();
  if (!storage) return true;
  try {
    if (storage.getItem(CLEARED_SESSION_KEY) === sessionId) return false;
    storage.setItem(CLEARED_SESSION_KEY, sessionId);
  } catch {
    // Blocked storage: clear anyway.
  }
  return true;
}

export default function Success({ stripeEnabled = false }) {
  const { clearCart, hydrated: cartReady } = useShoppingCart();
  const { query, isReady } = useRouter();
  const hydrated = useHydrated();
  const view =
    hydrated && isReady ? resolveView(query, stripeEnabled) : { kind: "wait" };

  const clearForDemo = view.kind === "demo" && !view.cartCleared;
  const stripeSession = view.kind === "stripe" ? view.sessionId : null;

  useEffect(() => {
    if (!cartReady) return;
    if (clearForDemo) {
      clearCart();
      const storage = sessionStore();
      if (storage) markCartCleared(storage);
    } else if (stripeSession && firstVisitFor(stripeSession)) {
      clearCart();
    }
  }, [cartReady, clearForDemo, stripeSession, clearCart]);

  return (
    <>
      <Head>
        <title>Order summary</title>
      </Head>
      <main className={styles.main}>
        {view.kind === "wait" && (
          <p className={styles.text} aria-busy="true">
            Loading…
          </p>
        )}
        {view.kind === "demo" && (
          <>
            <h1 className={styles.title}>Demo order summary</h1>
            <p className={styles.text}>
              This is a portfolio demo. No payment was taken and no order was
              placed.
            </p>
            <div className={styles.summary}>
              <OrderSummary order={view.order} caption="Your demo order" />
            </div>
            <p className={styles.actions}>
              <Link href="/shop" className={styles.link}>
                Keep browsing
              </Link>
            </p>
          </>
        )}
        {view.kind === "stripe" && (
          <>
            <h1 className={styles.title}>Thank you</h1>
            <p className={styles.text}>Stripe has confirmed your checkout.</p>
            <p className={styles.actions}>
              <Link href="/shop" className={styles.link}>
                Keep browsing
              </Link>
            </p>
          </>
        )}
        {view.kind === "none" && (
          <>
            <h1 className={styles.title}>There&apos;s no order to show here</h1>
            <p className={styles.text}>
              Your cart hasn&apos;t changed. Orders only appear here straight
              after checkout.
            </p>
            <p className={styles.actions}>
              <Link href="/shop" className={styles.link}>
                Browse the candles
              </Link>
              <Link href="/cart" className={styles.link}>
                Go to your cart
              </Link>
            </p>
          </>
        )}
      </main>
    </>
  );
}
