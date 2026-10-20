import Seo from "../components/Seo";
import ProductCard from "../components/ProductCard";
import { candles } from "../data/candles";
import styles from "../styles/Shop.module.css";

// One column up to 480px, two up to 1199px, then four across a 1180px
// container (1.5rem gutters and gaps).
const CARD_SIZES =
  "(min-width: 1200px) 265px, (min-width: 481px) calc((100vw - 4.5rem) / 2), calc(100vw - 3rem)";

export default function Shop() {
  return (
    <>
      <Seo
        title="Our candles"
        description="The four Eon candles: Love, Happiness, Dreams and Summer. Hand-poured vegan soy wax with crystals and botanicals, $20.00 each."
        path="/shop"
      />
      <main id="main" className={styles.main}>
        <header className={styles.intro}>
          <h1 className={styles.title}>Our candles</h1>
          <p className={styles.lede}>
            Four hand-poured vegan soy candles, each paired with crystal chips
            and botanicals.
          </p>
        </header>
        <ul className={styles.candleContainer}>
          {candles.map((candle, index) => (
            <li key={candle.slug}>
              {/* Every card loads straight away, since all four are on
                  screen on a wide display. The first, the largest image
                  on a phone, gets high priority and React's one preload;
                  the rest stay out of the preloads at low priority. */}
              <ProductCard
                candle={candle}
                sizes={CARD_SIZES}
                loading="eager"
                fetchPriority={index === 0 ? "high" : "low"}
              />
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
