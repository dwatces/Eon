import { useRef, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import OrderSummary from "../components/OrderSummary";
import ProductCard from "../components/ProductCard";
import QuantityStepper from "../components/QuantityStepper";
import { useShoppingCart } from "../hooks/use-shopping-cart";
import { SHIPPING, candles } from "../data/candles";
import { imageFor } from "../data/candle-images";
import { paymentsLive } from "../lib/checkout-mode";
import { requestCheckout } from "../lib/checkout-client";
import { saveDemoOrder } from "../lib/demo-order";
import { formatNZD } from "../lib/money";
import styles from "../styles/Cart.module.css";

// One boolean, decided at build time: whether checkout can take real
// money. It never carries the key itself.
export function getStaticProps() {
  return { props: { paymentsLive: paymentsLive(process.env) } };
}

const itemCount = (count) => `${count} ${count === 1 ? "item" : "items"}`;

function EmptyCart() {
  return (
    <>
      <p className={styles.intro}>
        Your cart is empty. Here are the four candles in the range.
      </p>
      <ul className={styles.suggestions}>
        {candles.map((candle) => (
          <li key={candle.slug}>
            <ProductCard
              candle={candle}
              variant="tile"
              headingLevel={2}
              sizes="(min-width: 640px) 170px, 45vw"
            />
          </li>
        ))}
      </ul>
    </>
  );
}

function CartLine({ line, onQuantity, onRemove }) {
  const { slug, name, quantity, unitAmount, lineTotal } = line;
  return (
    <li className={styles.cartItem}>
      <div className={styles.cartItemImage}>
        <Image
          src={imageFor(slug, "top").src}
          alt=""
          width={88}
          height={88}
          sizes="88px"
        />
      </div>
      <div className={styles.cartItemDetails}>
        <h2 className={styles.lineName}>
          <Link href={`/shop/${slug}`}>{name}</Link>
        </h2>
        <p>{formatNZD(unitAmount)} each</p>
      </div>
      <p className={styles.lineTotal}>
        <span className={styles.visuallyHidden}>Line total: </span>
        {formatNZD(lineTotal)}
      </p>
      <div className={styles.controls}>
        <QuantityStepper
          value={quantity}
          onChange={(next) => onQuantity(slug, next)}
          label={`Quantity of ${name}`}
          itemName={`${name} candle`}
          hideLabel
        />
        <button
          type="button"
          className={styles.button}
          onClick={() => onRemove(slug)}
          aria-label={`Remove ${name} candle`}
        >
          Remove
        </button>
      </div>
    </li>
  );
}

// The Checkout button. A demo order goes to /success through
// sessionStorage; if storage is blocked, the summary is shown here.
function Checkout({ items, live }) {
  const router = useRouter();
  const [state, setState] = useState({ status: "idle" });
  const busy = useRef(false);

  const start = async () => {
    if (busy.current) return;
    busy.current = true;
    setState({ status: "pending" });
    try {
      const result = await requestCheckout(items);
      if (result.kind === "stripe") {
        window.location.assign(result.url);
        return;
      }
      try {
        saveDemoOrder(window.sessionStorage, result.order);
      } catch {
        busy.current = false;
        setState({ status: "demo-inline", order: result.order });
        return;
      }
      await router.push("/success?demo=1");
    } catch {
      busy.current = false;
      setState({ status: "error" });
    }
  };

  const pending = state.status === "pending";

  return (
    <>
      <p className={styles.proceed}>
        {live
          ? "Checkout continues on Stripe, which takes the payment."
          : "This shop is a portfolio demo. Checkout takes no real payment."}
      </p>
      <button
        type="button"
        className={styles.buttonCheckout}
        onClick={start}
        disabled={pending}
        aria-busy={pending}
      >
        {pending ? "Starting checkout…" : "Checkout"}
      </button>
      <div role="status" className={styles.checkoutMessage}>
        {state.status === "demo-inline" && (
          <>
            <OrderSummary order={state.order} caption="Demo order summary" />
            <p>
              This is a portfolio demo. No payment was taken and no order was
              placed.
            </p>
          </>
        )}
      </div>
      <div role="alert" className={styles.checkoutError}>
        {state.status === "error" && (
          <p>
            We couldn&apos;t start checkout. Nothing was charged. Please try
            again.
          </p>
        )}
      </div>
    </>
  );
}

export default function Cart({ paymentsLive: live = false }) {
  const {
    hydrated,
    items,
    count,
    subtotal,
    shipping,
    total,
    setQuantity,
    removeLine,
  } = useShoppingCart();

  return (
    <>
      <Head>
        <title>Your cart</title>
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>Your cart</h1>
        {!hydrated ? (
          <p className={styles.intro}>Loading your cart…</p>
        ) : count === 0 ? (
          <EmptyCart />
        ) : (
          <>
            <p className={styles.cartCount}>{itemCount(count)}</p>
            <ul className={styles.lines}>
              {items.map((line) => (
                <CartLine
                  key={line.slug}
                  line={line}
                  onQuantity={setQuantity}
                  onRemove={removeLine}
                />
              ))}
            </ul>
            <section className={styles.summary} aria-labelledby="order-summary">
              <h2 id="order-summary" className={styles.summaryTitle}>
                Order summary
              </h2>
              <dl className={styles.totals}>
                <div>
                  <dt>Subtotal</dt>
                  <dd>{formatNZD(subtotal)}</dd>
                </div>
                <div>
                  <dt>
                    Shipping{" "}
                    <span className={styles.shippingNote}>
                      ({SHIPPING.label})
                    </span>
                  </dt>
                  <dd>{formatNZD(shipping)}</dd>
                </div>
                <div className={styles.total}>
                  <dt>Total (NZD)</dt>
                  <dd>{formatNZD(total)}</dd>
                </div>
              </dl>
              <Checkout items={items} live={live} />
            </section>
          </>
        )}
      </main>
    </>
  );
}
