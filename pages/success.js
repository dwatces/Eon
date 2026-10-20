import { useEffect, useState, useSyncExternalStore } from "react";
import Seo from "../components/Seo";
import Link from "next/link";
import { useRouter } from "next/router";
import OrderSummary from "../components/OrderSummary";
import { useShoppingCart } from "../hooks/use-shopping-cart";
import { checkOrder } from "../lib/checkout-client";
import { isSessionId } from "../lib/checkout-session";
import { markCartCleared, readDemoOrder } from "../lib/demo-order";
import { formatNZD } from "../lib/money";
import styles from "../styles/Success.module.css";

// Stripe sends shoppers here with ?session_id=cs_... after checkout. The
// page asks the server to check that session with Stripe before it thanks
// anyone or empties the cart, because anyone can type a session id. The
// server decides on every request whether Stripe is in use, so this page
// needs no build-time setting: in demo mode every session id is unknown.
const CLEARED_SESSION_KEY = "eon-cleared-session";

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
function resolveView(query) {
  if (query.demo === "1") {
    const storage = sessionStore();
    const saved = storage ? readDemoOrder(storage) : null;
    if (saved) return { kind: "demo", ...saved };
    return { kind: "none" };
  }
  const sessionId =
    typeof query.session_id === "string" ? query.session_id : "";
  if (isSessionId(sessionId)) {
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

// Checks a Stripe session through the API. Returns the result, or
// {kind: "checking"} while a check is running, and a function that checks
// again. Each result is tagged with the check it answers, so a stale one
// never shows.
function useOrderCheck(sessionId) {
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState(null);
  const tag = sessionId ? `${sessionId}#${attempt}` : null;

  useEffect(() => {
    if (!sessionId) return undefined;
    let current = true;
    checkOrder(sessionId).then((value) => {
      if (current) setResult({ tag: `${sessionId}#${attempt}`, value });
    });
    return () => {
      current = false;
    };
  }, [sessionId, attempt]);

  const order =
    tag && result?.tag === tag ? result.value : { kind: "checking" };
  return [order, () => setAttempt((n) => n + 1)];
}

function paidMessage(order) {
  const amount =
    order.currency === "NZD" ? ` of ${formatNZD(order.total)} NZD` : "";
  return order.live
    ? `Stripe has confirmed your payment${amount}.`
    : `Stripe has confirmed your test payment${amount}. This shop is a portfolio demo, so no real card was charged.`;
}

export default function Success() {
  const { clearCart, hydrated: cartReady } = useShoppingCart();
  const { query, isReady } = useRouter();
  const hydrated = useHydrated();
  const view = hydrated && isReady ? resolveView(query) : { kind: "wait" };

  const clearForDemo = view.kind === "demo" && !view.cartCleared;
  const stripeSession = view.kind === "stripe" ? view.sessionId : null;
  const [order, checkAgain] = useOrderCheck(stripeSession);
  // The cart empties only once Stripe has confirmed the payment.
  const paidSession = order.kind === "paid" ? stripeSession : null;

  useEffect(() => {
    if (!cartReady) return;
    if (clearForDemo) {
      clearCart();
      const storage = sessionStore();
      if (storage) markCartCleared(storage);
    } else if (paidSession && firstVisitFor(paidSession)) {
      clearCart();
    }
  }, [cartReady, clearForDemo, paidSession, clearCart]);

  return (
    <>
      <Seo
        title="Order summary"
        description="The order summary from the Eon Candles demo shop."
        path="/success"
        noindex
      />
      <main id="main" className={styles.main}>
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
              <Link href="/shop" className={styles.primary}>
                Keep browsing
              </Link>
            </p>
          </>
        )}
        {view.kind === "stripe" && (
          // One live region for the whole check, so the result is read out
          // when it replaces "Checking your order".
          <div aria-live="polite">
            {order.kind === "checking" && (
              <>
                <h1 className={styles.title}>Checking your order</h1>
                <p className={styles.text} aria-busy="true">
                  Confirming your payment with Stripe…
                </p>
              </>
            )}
            {order.kind === "paid" && (
              <>
                <h1 className={styles.title}>Thank you</h1>
                <p className={styles.text}>{paidMessage(order)}</p>
                <p className={styles.actions}>
                  <Link href="/shop" className={styles.primary}>
                    Keep browsing
                  </Link>
                </p>
              </>
            )}
            {order.kind === "unconfirmed" && (
              <>
                <h1 className={styles.title}>
                  We couldn&apos;t confirm this order
                </h1>
                <p className={styles.text}>
                  There&apos;s no completed payment for this checkout, so your
                  cart hasn&apos;t changed.
                </p>
                <p className={styles.actions}>
                  <Link href="/cart" className={styles.primary}>
                    Go to your cart
                  </Link>
                  <Link href="/shop" className={styles.link}>
                    Browse the candles
                  </Link>
                </p>
              </>
            )}
            {order.kind === "error" && (
              <>
                <h1 className={styles.title}>
                  We couldn&apos;t check your order
                </h1>
                <p className={styles.text}>
                  Stripe didn&apos;t answer just now. Your cart hasn&apos;t
                  changed.
                </p>
                <p className={styles.actions}>
                  <button
                    type="button"
                    className={styles.primary}
                    onClick={checkAgain}
                  >
                    Try again
                  </button>
                  <Link href="/cart" className={styles.link}>
                    Go to your cart
                  </Link>
                </p>
              </>
            )}
          </div>
        )}
        {view.kind === "none" && (
          <>
            <h1 className={styles.title}>There&apos;s no order to show here</h1>
            <p className={styles.text}>
              Your cart hasn&apos;t changed. Orders only appear here straight
              after checkout.
            </p>
            <p className={styles.actions}>
              <Link href="/shop" className={styles.primary}>
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
