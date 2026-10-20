import { useState } from "react";
import Link from "next/link";
import QuantityStepper from "./QuantityStepper";
import { useShoppingCart } from "../hooks/use-shopping-cart";
import { MAX_QTY } from "../data/candles";
import styles from "./AddToCart.module.css";

const candles = (count, name) =>
  `${count} ${name} ${count === 1 ? "candle" : "candles"}`;

// What the status line says after an add, given how many of this candle
// were in the cart before and how many the shopper asked for.
export function addedMessage(name, before, requested, max = MAX_QTY) {
  const after = Math.min(max, before + requested);
  const added = after - before;
  if (added <= 0) {
    return `Your cart already has ${candles(max, name)}, the most for one order.`;
  }
  if (added < requested) {
    return `Added ${candles(added, name)}. Your cart now has ${max}, the most for one order.`;
  }
  return `Added ${candles(added, name)} to your cart.`;
}

// Quantity, the Add to cart button and a polite status message. The
// button always adds; the shopper can add again or go to the cart.
export default function AddToCart({ candle }) {
  const { addItem, lines } = useShoppingCart();
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState({ count: 0, message: "" });

  const handleAdd = () => {
    const before = lines[candle.slug] ?? 0;
    addItem(candle.slug, quantity);
    setStatus(({ count }) => ({
      count: count + 1,
      message: addedMessage(candle.name, before, quantity),
    }));
  };

  return (
    <div className={styles.addToCart}>
      <QuantityStepper value={quantity} onChange={setQuantity} />
      <button type="button" className={styles.button} onClick={handleAdd}>
        Add to cart
      </button>
      <p className={styles.note}>
        Demo shop: no real orders or payments are taken.
      </p>
      {/* Always in the page, so screen readers hear the first message.
          A new key per add makes a repeated message count as new. */}
      <div role="status" className={styles.status}>
        {status.message && (
          <p key={status.count}>
            {status.message} <Link href="/cart">View cart</Link>
          </p>
        )}
      </div>
    </div>
  );
}
