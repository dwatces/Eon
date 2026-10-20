import styles from "../styles/Shop.module.css";
import { useShoppingCart } from "../hooks/use-shopping-cart";
import { AiOutlineCheck } from "react-icons/ai";

const Success = () => {
  const { clearCart } = useShoppingCart();

  clearCart();

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
