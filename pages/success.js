import { useEffect } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import styles from "../styles/Shop.module.css";
import { useShoppingCart } from "../hooks/use-shopping-cart";
import { fetcher } from "../lib/utils";
import { AiOutlineCheck } from "react-icons/ai";
import { FaHandPeace } from "react-icons/fa";

const Success = () => {
  const {
    query: { session_id },
  } = useRouter();

  const { clearCart } = useShoppingCart();

  const { data, error } = useSWR(
    () => `/api/checkout_sessions/${session_id}`,
    fetcher
  );

  clearCart();

  return (
    <main className={styles.main}>
      <div className={styles.orderComplete}>
        <h1 className={styles.orderConfirm}>
          Thanks for your order, you beautiful human! <AiOutlineCheck />
        </h1>

        <h2>
          You will be emailed your tracking number within the day
          <FaHandPeace className={styles.distance} />
        </h2>
      </div>
    </main>
  );
};

export default Success;
