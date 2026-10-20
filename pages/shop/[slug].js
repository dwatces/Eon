import Link from "next/link";
import { IoIosArrowBack } from "react-icons/io";
import Seo from "../../components/Seo";
import AddToCart from "../../components/AddToCart";
import ProductCard from "../../components/ProductCard";
import ProductGallery from "../../components/ProductGallery";
import { allSlugs, candles, getCandle } from "../../data/candles";
import { candleImages } from "../../data/candle-images";
import { descriptionFor } from "../../data/candle-copy";
import { formatNZD } from "../../lib/money";
import styles from "../../styles/Candles.module.css";

export function getStaticPaths() {
  return {
    paths: allSlugs().map((slug) => ({ params: { slug } })),
    fallback: false,
  };
}

// Only the slug goes into the page data. The page reads the catalogue,
// copy and photos itself, so image objects are never serialised.
export function getStaticProps({ params }) {
  return { props: { slug: params.slug } };
}

const MORE_SIZES = "(min-width: 800px) 216px, calc(33vw - 1.5rem)";

export default function CandlePage({ slug }) {
  const candle = getCandle(slug);
  // Photos in catalogue order: lid (the main photo), flower, lit, crystal.
  const photos = candle.imageKeys.map((key) => candleImages[slug][key]);
  const others = candles.filter((other) => other.slug !== slug);
  const notes = [
    ["Scent", candle.notes.scent],
    ["Crystal", candle.notes.crystal],
    ["Botanicals", candle.notes.botanicals],
  ];

  return (
    <>
      <Seo
        title={`${candle.name} candle`}
        description={`${candle.name} candle: ${candle.notes.scent}, paired with ${candle.notes.crystal.toLowerCase()} and ${candle.notes.botanicals.toLowerCase()}. Hand-poured soy wax, ${formatNZD(candle.unitAmount)}.`}
        path={`/shop/${slug}`}
      />
      <main id="main" className={styles.main}>
        <Link href="/shop" className={styles.back}>
          <IoIosArrowBack size={18} aria-hidden="true" />
          Back to all candles
        </Link>
        <div className={styles.product}>
          <div className={styles.gallery}>
            <ProductGallery key={slug} name={candle.name} photos={photos} />
          </div>
          <div className={styles.details}>
            <h1 className={styles.candleTitle}>{candle.name}</h1>
            <p className={styles.candleRetail}>
              {formatNZD(candle.unitAmount)}
            </p>
            <dl className={styles.notes}>
              {notes.map(([term, value]) => (
                <div key={term}>
                  <dt>{term}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
            <AddToCart key={slug} candle={candle} />
            <p className={styles.candleDescription}>{descriptionFor(slug)}</p>
          </div>
        </div>
        <section className={styles.more} aria-labelledby="more-candles">
          <h2 id="more-candles" className={styles.moreTitle}>
            More candles
          </h2>
          <ul className={styles.moreList}>
            {others.map((other) => (
              <li key={other.slug}>
                <ProductCard
                  candle={other}
                  variant="tile"
                  headingLevel={3}
                  sizes={MORE_SIZES}
                  compact
                />
              </li>
            ))}
          </ul>
        </section>
      </main>
    </>
  );
}
