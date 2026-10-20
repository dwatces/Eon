import Image from "next/image";
import Link from "next/link";
import { imageFor } from "../data/candle-images";
import { formatNZD } from "../lib/money";
import styles from "./ProductCard.module.css";

// One candle as a card that links to its product page. The candle's name
// is the link text; a stretched link makes the whole card clickable.
//
// variant "card": the photo of the tin, name, scent notes and price (shop).
// variant "tile": the top-down photo with name and price (home page).
export default function ProductCard({
  candle,
  variant = "card",
  headingLevel = 2,
  sizes,
  priority = false,
}) {
  const Heading = `h${headingLevel}`;
  const image = imageFor(candle.slug, variant === "tile" ? "top" : "lid");
  const href = `/shop/${candle.slug}`;

  return (
    <article className={`${styles.root} ${styles[variant]}`}>
      <div className={styles.picture}>
        <Image
          src={image.src}
          alt=""
          sizes={sizes}
          priority={priority}
          className={styles.image}
        />
      </div>
      <div className={styles.details}>
        <Heading className={styles.name}>
          <Link href={href} className={styles.link}>
            {candle.name}
          </Link>
        </Heading>
        {variant === "card" && (
          <>
            <p>{candle.notes.scent}</p>
            <p>
              {candle.notes.crystal} &amp; {candle.notes.botanicals}
            </p>
          </>
        )}
        <p className={styles.price}>{formatNZD(candle.unitAmount)}</p>
      </div>
    </article>
  );
}
