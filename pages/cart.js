import Link from "next/link";
import Image from "next/image";
import { useShoppingCart } from "../hooks/use-shopping-cart";
import axios from "axios";
import getStripe from "../components/get-stripe";
import styles from "../styles/Cart.module.css";

const Cart = () => {
  const { cartDetails, cartCount, removeItem } = useShoppingCart();

  const redirectToCheckout = async () => {
    const {
      data: { id },
    } = await axios.post("/api/checkout_sessions", {
      items: Object.entries(cartDetails).map(([_, { id, quantity }]) => ({
        price: id,
        quantity,
      })),
    });

    const stripe = await getStripe();
    await stripe.redirectToCheckout({ sessionId: id });
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
              <p>
                Check out our candles <Link href="/shop">here</Link>
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
                      />
                    </div>
                    <div className={styles.cartItemDetails}>
                      <h3>{name}</h3>
                      <p>Quantity: {quantity}</p>
                      <p>Price: {price}/per</p>
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
                )
              )}
            </div>{" "}
            <p className={styles.proceed}>
              Click below to proceed to Stripe to complete your order:
            </p>
            <div className={styles.cartCheckout}>
              <button
                className={styles.buttonCheckout}
                onClick={() => redirectToCheckout()}
              >
                Checkout
              </button>
            </div>
          </>
        ) : null}
      </main>
    </>
  );
};

export default Cart;
