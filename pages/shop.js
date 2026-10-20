import Head from "next/head";
import ProductCard from "../components/ProductCard";
import { candles } from "../data/candles";
import styles from "../styles/Shop.module.css";

const CARD_SIZES = "(min-width: 1180px) 380px, (min-width: 640px) 50vw, 100vw";

export default function Shop() {
  return (
    <>
      <Head>
        <title>Candle Shop</title>
        <meta name="description" content="Shop for Eons candle products" />
      </Head>
      <main className={styles.main}>
        <h1 className={styles.visuallyHidden}>Our candles</h1>
        <ul className={styles.candleContainer}>
          {candles.map((candle, index) => (
            <li key={candle.slug}>
              <ProductCard
                candle={candle}
                sizes={CARD_SIZES}
                priority={index === 0}
              />
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
