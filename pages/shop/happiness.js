import React, { useState } from "react";
import { useShoppingCart } from "../../hooks/use-shopping-cart";
import axios from "axios";
import Link from "next/link";
import "react-image-lightbox/style.css";
import Head from 'next/head'
import getStripe from "../../components/get-stripe";
import Lightbox from "react-image-lightbox";
import { ProductJsonLd } from "next-seo";
import Image from "next/image";
import Layout from "../../components/Layout";
import { products } from "../../components/products";
import { AiOutlineMinus } from "react-icons/ai";
import { AiOutlinePlus } from "react-icons/ai";
import styles from "../../styles/Candles.module.css";
import altPicFlower from "../../public/Flower-Happy2.webp";
import altPicCrystal from "../../public/Crystal-Happy.webp";
import altPicLit from "../../public/lit-happy.webp";
import mainPic from "../../public/lid-happiness.webp";

const Happiness = () => {
  const images = [
    "/lid-happiness.png",
    "/Flower-Happy2.png",
    "/Crystal-Happy.png",
    "/lit-happy.png",
  ];
  const [photoIndex, setPhotoIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [crystal, setCrystal] = useState(false);
  const [flower, setFlower] = useState(false);
  const { addItem, cartDetails } = useShoppingCart();
  const [qty, setQty] = useState(1);
  const [cartClicked, setCartClicked] = useState(false);

  const handleOnAddToCart = async () => {
    if (!cartClicked) {
      addItem(products[1], qty);
      setCartClicked(true);
    }

    if (cartClicked) {
      const {
        data: { id },
      } = await axios.post("../api/checkout_sessions", {
        items: Object.entries(cartDetails).map(([_, { id, quantity }]) => ({
          price: id,
          quantity,
        })),
      });

      const stripe = await getStripe();
      await stripe.redirectToCheckout({ sessionId: id });
    }
  };
  const open = () => {
    setIsOpen(true);
  };

  <ProductJsonLd
    productName="happiness candle"
    description="all the good in life with the beautiful scents of wild orange, clary sage, and lemon. This candle comes paired with citrine chips that channel happiness, and jasmine flower petals for clarity and perspective."
    manufacturerName="Eon"
    material="candle"
    award="best scented candle in NZ"
    aggregateRating={{
      ratingValue: "4.8",
      reviewCount: "166",
    }}
  />;

  return (
    <Layout>
      <Head>
        <title>Happiness</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <main className={styles.main}>
        <div className={styles.galleryContainer}>
          <div className={styles.galleryImage}>
            <button className={styles.buttonImage} type="button" onClick={open}>
              <Image
                src={altPicFlower}
                alt="happy flower"
                className={styles.candleSize}
                responsive="true"
                priority
              />
            </button>
          </div>
          <div className={styles.galleryImage}>
            <button className={styles.buttonImage} type="button" onClick={open}>
              <Image
                src={altPicLit}
                alt="happy lit"
                className={styles.candleSize}
                responsive="true"
                priority
              />
            </button>
          </div>
          <h1 style={{ display: "none" }}>Crystal Candle Happiness</h1>
          <div className={styles.galleryImage}>
            <button className={styles.buttonImage} type="button" onClick={open}>
              <Image
                src={altPicCrystal}
                alt="happy crystal"
                className={styles.candleSize}
                responsive="true"
                priority
              />
            </button>
          </div>
        </div>
        <div className={styles.galleryMainContainer}>
          <div className={styles.mainImage}>
            <button className={styles.buttonImage} type="button" onClick={open}>
              <Image
                src={mainPic}
                alt="happy main"
                className={styles.candleSizeMain}
                responsive="true"
                priority
              />
            </button>
          </div>
        </div>
        <div className={styles.candleContent}>
          <div className={styles.candleContentHeader}>
            <h2 className={styles.candleTitle}>happiness</h2>

            <p className={styles.candleDescription}>
              <div className={styles.containerBuy}>
                <p className={styles.candleRetail}>
                  $20<sup className={styles.candlePrice}>$30</sup>
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
                    ADD TO CART
                  </button>
                ) : (
                  <Link href="/cart">
                    <button className={styles.submitButton} type="button">
                      CHECKOUT
                    </button>
                  </Link>
                )}
              </div>
              Fill the room with positive energies and appreciation for all the
              good in life with the beautiful scents of wild orange, clary sage,
              and lemon. This candle comes paired with citrine chips that
              channel happiness, and jasmine flower petals for clarity and
              perspective. Citrine is a powerful crystal with a deep, cheerful
              colouring, it promotes optimism, happiness and it is believed to
              manifest financial good fortunes. The sight and scents of this
              candle will help you appreciate the little things and spread cheer
              and happiness throughout your home and life.
            </p>
          </div>
        </div>
        {isOpen && (
          <Lightbox
            mainSrc={images[photoIndex]}
            nextSrc={images[photoIndex + 1]}
            prevSrc={images[(photoIndex + images.length - 1) % images.length]}
            onCloseRequest={() => setIsOpen(false)}
            onMovePrevRequest={() => setPhotoIndex(0)}
            onMoveNextRequest={() => setPhotoIndex(photoIndex + 1)}
          />
        )}
      </main>
    </Layout>
  );
};

export default Happiness;
