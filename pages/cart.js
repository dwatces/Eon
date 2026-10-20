import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useShoppingCart } from "../hooks/use-shopping-cart";
import styles from "../styles/Cart.module.css";
import { getCandle } from "../data/candles";
import { formatNZD } from "../lib/money";

const Cart = () => {
  const { cartDetails, cartCount, removeItem } = useShoppingCart();

  const [checkoutState, setCheckoutState] = useState({ status: "idle" });

  const startCheckout = async () => {
    if (checkoutState.status === "pending") return;
    setCheckoutState({ status: "pending" });
    try {
      const response = await fetch("/api/checkout_sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: Object.values(cartDetails).map(({ name, quantity }) => ({
            slug: name,
            quantity,
          })),
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
      <main className={styles.main}>
        <div>
          {cartCount > 0 ? (
            <>
              <h2 className={styles.title}>Your Shopping Cart</h2>
              <p className={styles.cartCount}>{cartCount} items</p>
              <p className={styles.underline}></p>
            </>
          ) : (
            <>
              <h2>Your Shopping Cart is Empty</h2>
              <p className={styles.shopLink}>
                <Link href="/shop">Check out our candles here</Link>
              </p>
            </>
          )}
        </div>
        {cartCount > 0 ? (
          <>
            <div>
              {Object.entries(cartDetails).map(
                ([id, { name, price, quantity }]) => (
                  <div key={id} className={styles.cartItem}>
                    <div className={styles.cartItemImage}>
                      <Image
                        src={`/${id}.png`}
                        alt={`${name}`}
                        width={200}
                        height={200}
                        priority
                      />
                    </div>
                    <div className={styles.cartItemDetails}>
                      <h3>{name}</h3>
                      <p>Quantity: {quantity}</p>
                      <p>
                        Price:{" "}
                        {getCandle(name)
                          ? formatNZD(getCandle(name).unitAmount)
                          : price}{" "}
                        each
                      </p>
                    </div>
                    <div className={styles.cartItemRemove}>
                      <button
                        className={styles.button}
                        onClick={() => removeItem({ id })}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ),
              )}
            </div>{" "}
            <p className={styles.proceed}>
              This is a portfolio demo shop: checkout shows an order summary and
              takes no payment.
            </p>
            <div className={styles.cartCheckout}>
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
            </div>
            <div role="status" className={styles.checkoutMessage}>
              {checkoutState.status === "demo" && (
                <p>
                  Demo order: {formatNZD(checkoutState.order.subtotal)} plus{" "}
                  {formatNZD(checkoutState.order.shipping)} New Zealand
                  shipping, {formatNZD(checkoutState.order.total)} in total. No
                  payment was taken and no order was placed.
                </p>
              )}
              {checkoutState.status === "error" && (
                <p>We couldn&apos;t start checkout. Please try again.</p>
              )}
            </div>
          </>
        ) : null}
      </main>
    </>
  );
};

export default Cart;
