import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import ProductCard from "../components/ProductCard";
import QuantityStepper from "../components/QuantityStepper";
import { useShoppingCart } from "../hooks/use-shopping-cart";
import { SHIPPING, candles } from "../data/candles";
import { imageFor } from "../data/candle-images";
import { formatNZD } from "../lib/money";
import styles from "../styles/Cart.module.css";

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

export default function Cart() {
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

  const [checkoutState, setCheckoutState] = useState({ status: "idle" });

  const startCheckout = async () => {
    if (checkoutState.status === "pending") return;
    setCheckoutState({ status: "pending" });
    try {
      const response = await fetch("/api/checkout_sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map(({ slug, quantity }) => ({ slug, quantity })),
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Checkout failed");
      if (
        data.mode === "stripe" &&
        typeof data.url === "string" &&
        data.url.startsWith("https://checkout.stripe.com/")
      ) {
        window.location.assign(data.url);
        return;
      }
      if (data.mode === "demo" && data.order) {
        setCheckoutState({ status: "demo", order: data.order });
        return;
      }
      throw new Error("Unexpected checkout response");
    } catch {
      setCheckoutState({ status: "error" });
    }
  };

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
              <p className={styles.proceed}>
                This is a portfolio demo shop: checkout shows an order summary
                and takes no payment.
              </p>
              <button
                type="button"
                className={styles.buttonCheckout}
                onClick={startCheckout}
                disabled={checkoutState.status === "pending"}
                aria-busy={checkoutState.status === "pending"}
              >
                {checkoutState.status === "pending"
                  ? "Starting checkout…"
                  : "Checkout"}
              </button>
              <div role="status" className={styles.checkoutMessage}>
                {checkoutState.status === "demo" && (
                  <p>
                    Demo order: {formatNZD(checkoutState.order.subtotal)} plus{" "}
                    {formatNZD(checkoutState.order.shipping)} New Zealand
                    shipping, {formatNZD(checkoutState.order.total)} in total.
                    No payment was taken and no order was placed.
                  </p>
                )}
                {checkoutState.status === "error" && (
                  <p>We couldn&apos;t start checkout. Please try again.</p>
                )}
              </div>
            </section>
          </>
        )}
      </main>
    </>
  );
}
