import styles from "../styles/Shop.module.css";
import { useShoppingCart } from "../hooks/use-shopping-cart";
import { AiOutlineCheck } from "react-icons/ai";
import { FaHandPeace } from "react-icons/fa";


const Success = () => {
  const { clearCart } = useShoppingCart();

  clearCart();

  return (
    <main className={styles.main}>
      <div className={styles.orderComplete}>
        <h1 className={styles.orderConfirm}>
          Thanks for your order, you beautiful human <AiOutlineCheck />
        </h1>

        <h2 className={styles.orderInvoice}>
          You will be emailed an invoice and tracking number soon!
          <FaHandPeace className={styles.distance} />
        </h2>
      </div>
    </main>
  );
};

export default Success;
