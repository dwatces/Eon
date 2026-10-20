import Seo from "../../components/Seo";
import AddToCart from "../../components/AddToCart";
import ProductGallery from "../../components/ProductGallery";
import { allSlugs, getCandle } from "../../data/candles";
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

export default function CandlePage({ slug }) {
  const candle = getCandle(slug);
  // Photos in catalogue order: lid (the main photo), flower, lit, crystal.
  const photos = candle.imageKeys.map((key) => candleImages[slug][key]);

  return (
    <>
      <Seo
        title={`${candle.name} candle`}
        description={`${candle.name} candle: ${candle.notes.scent}, paired with ${candle.notes.crystal.toLowerCase()} and ${candle.notes.botanicals.toLowerCase()}. Hand-poured soy wax, ${formatNZD(candle.unitAmount)}.`}
        path={`/shop/${slug}`}
      />
      <main id="main" className={styles.main}>
        <div className={styles.gallery}>
          <ProductGallery key={slug} name={candle.name} photos={photos} />
        </div>
        <div className={styles.candleContent}>
          <div className={styles.candleContentHeader}>
            <h1 className={styles.candleTitle}>{candle.name}</h1>
            <p className={styles.candleRetail}>
              {formatNZD(candle.unitAmount)}
            </p>
            <AddToCart key={slug} candle={candle} />
            <p className={styles.candleDescription}>{descriptionFor(slug)}</p>
          </div>
        </div>
      </main>
    </>
  );
}
