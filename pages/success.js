import { useEffect } from "react";
import { useRouter } from "next/router";
import styles from "../styles/Shop.module.css";
import { useShoppingCart } from "../hooks/use-shopping-cart";
import { AiOutlineCheck } from "react-icons/ai";

// Stripe sends shoppers here with ?session_id=cs_... after checkout.
const STRIPE_SESSION_ID = /^cs_(test|live)_[A-Za-z0-9]+$/;

const Success = () => {
  const { clearCart, hydrated } = useShoppingCart();
  const { query, isReady } = useRouter();
  const sessionId =
    typeof query.session_id === "string" ? query.session_id : "";

  // Only a completed Stripe checkout empties the cart, never a direct visit.
  useEffect(() => {
    if (isReady && hydrated && STRIPE_SESSION_ID.test(sessionId)) clearCart();
  }, [isReady, hydrated, sessionId, clearCart]);

  return (
    <main className={styles.main}>
      <div className={styles.orderComplete}>
        <h1 className={styles.orderConfirm}>
          Thanks for your order, you beautiful human <AiOutlineCheck />
        </h1>
      </div>
    </main>
  );
};

export default Success;
