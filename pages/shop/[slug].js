import React, { useState } from "react";
import { useShoppingCart } from "../../hooks/use-shopping-cart";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import Lightbox from "../../components/Lightbox";
import { allSlugs, getCandle } from "../../data/candles";
import { candleImages } from "../../data/candle-images";
import { descriptionFor } from "../../data/candle-copy";
import { formatNZD } from "../../lib/money";
import { AiOutlineMinus } from "react-icons/ai";
import { AiOutlinePlus } from "react-icons/ai";
import styles from "../../styles/Candles.module.css";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";

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
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const { addItem } = useShoppingCart();
  const [qty, setQty] = useState(1);
  const [cartClicked, setCartClicked] = useState(false);

  const handleOnAddToCart = () => {
    addItem(candle.slug, qty);
    setCartClicked(true);
  };

  return (
    <>
      <Head>
        <title>{candle.name}</title>
      </Head>
      <main className={styles.main}>
        <div className={styles.galleryContainer}>
          <div className={styles.galleryImage}>
            <button
              className={styles.buttonImage}
              type="button"
              onClick={() => setLightboxIndex(1)}
            >
              <Image
                src={photos[1].src}
                alt={photos[1].alt}
                className={styles.candleSize}
                priority
              />
            </button>
          </div>
          <div className={styles.galleryImage}>
            <button
              className={styles.buttonImage}
              type="button"
              onClick={() => setLightboxIndex(2)}
            >
              <Image
                src={photos[2].src}
                alt={photos[2].alt}
                className={styles.candleSize}
                priority
              />
            </button>
          </div>
          <div className={styles.galleryImage}>
            <button
              className={styles.buttonImage}
              type="button"
              onClick={() => setLightboxIndex(3)}
            >
              <Image
                src={photos[3].src}
                alt={photos[3].alt}
                className={styles.candleSize}
                priority
              />
            </button>
          </div>
        </div>
        <div className={styles.galleryMainContainer}>
          <div className={styles.mainImage}>
            <IoIosArrowBack
              onClick={() => setLightboxIndex(0)}
              className={`${styles.mobileGallery} ${styles.galleryBack}`}
            />
            <button
              className={styles.buttonImage}
              type="button"
              onClick={() => setLightboxIndex(0)}
            >
              <Image
                src={photos[0].src}
                alt={photos[0].alt}
                className={styles.candleMain}
                priority
              />
            </button>
            <IoIosArrowForward
              onClick={() => setLightboxIndex(0)}
              className={`${styles.mobileGallery} ${styles.galleryForward}`}
            />
          </div>
        </div>
        <div className={styles.candleContent}>
          <div className={styles.candleContentHeader}>
            <h1 className={styles.candleTitle}>{candle.name}</h1>
            <div className={styles.candleDescription}>
              <div className={styles.containerBuy}>
                <p className={styles.candleRetail}>
                  {formatNZD(candle.unitAmount)}
                </p>

                <p className={styles.quantity}>Quantity:</p>
                <button
                  className={styles.candleQuantity}
                  onClick={() => setQty(qty - 1)}
                  disabled={qty <= 1}
                  aria-label="decrease quantity by one"
                >
                  <AiOutlineMinus />
                </button>
                <p>{qty}</p>
                <button
                  className={styles.candleQuantity}
                  onClick={() => setQty(qty + 1)}
                  aria-label="increase quantity by one"
                >
                  <AiOutlinePlus />
                </button>
                {!cartClicked ? (
                  <button
                    className={styles.submitButton}
                    onClick={handleOnAddToCart}
                    type="button"
                  >
                    Add to cart
                  </button>
                ) : (
                  <Link href="/cart" className={styles.submitButton}>
                    Checkout
                  </Link>
                )}
              </div>

              <p>{descriptionFor(candle.slug)}</p>
            </div>
          </div>
        </div>
        <Lightbox
          images={photos}
          index={lightboxIndex}
          onIndexChange={setLightboxIndex}
          onClose={() => setLightboxIndex(null)}
          label={`${candle.name} candle photos`}
        />
      </main>
    </>
  );
}
