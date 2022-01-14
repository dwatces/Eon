import React, { useState, useEffect, useRef } from "react";
import { useShoppingCart } from "../../hooks/use-shopping-cart";
import { useRouter } from "next/router";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "react-hot-toast";
import Image from "next/image";
import Layout from "../../components/Layout";
import products from "../../components/products";
import styles from "../../styles/Candles.module.css";
import altPicFlower from "../../public/Flower-love.png";
import altPicCrystal from "../../public/crystal-love.png";
import altPicLit from "../../public/lit-love.png";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

const Love = (props) => {
  const [crystal, setCrystal] = useState(false);
  const [flower, setFlower] = useState(false);
  const { cartCount, addItem } = useShoppingCart();
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const toastId = useRef();
  const firstRun = useRef(true);

  const handleOnAddToCart = () => {
    setAdding(true);
    toastId.current = toast.loading(
      `Adding ${qty} item${qty > 1 ? "s" : ""}...`
    );
    addItem(products, qty);
  };

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }

    setAdding(false);
    toast.success(`${qty} love added`, {
      id: toastId.current,
    });
    setQty(1);
  }, [cartCount]);

  return (
    <Layout>
      <main className={styles.main}>
        <div className={styles.galleryContainer}>
          <div className={styles.galleryImage}>
            <Image
              src={altPicFlower}
              alt="candle"
              className={styles.candleSize}
              responsive="true"
              priority
            />
          </div>
          <div className={styles.galleryImage}>
            <Image
              src={altPicLit}
              alt="candle"
              className={styles.candleSize}
              responsive="true"
              priority
            />
          </div>
          <div className={styles.galleryImage}>
            <Image
              src={altPicCrystal}
              alt="candle"
              className={styles.candleSize}
              responsive="true"
              priority
            />
          </div>
        </div>
        <div className={styles.galleryMainContainer}>
          <div className={styles.mainImage}>
            <Image
              src={altPicFlower}
              alt="candle"
              className={styles.candleSize}
              responsive="true"
              priority
            />
          </div>
        </div>
        <div className={styles.candleContent}>
          <div className={styles.candleContentHeader}>
            <h2 className={styles.candleTitle}>love</h2>
            <p className={styles.candleDescription}>
              Our rose otto, ylang ylang, orange, and patchouli scented candle
              not only smells divine, but is precisely paired with rose quartz
              chips and rose bud to amplify and attract love in your life.
            </p>
            <div className={styles.containerBits}>
              <h3
                className={styles.containerBitsHeader}
                onMouseEnter={(e) => {
                  setCrystal(true);
                }}
              >
                <span className={styles.headerUnderline}>Rose Quartz</span>
              </h3>
              {crystal && (
                <p
                  className={styles.bitsText}
                  onMouseLeave={(e) => {
                    setCrystal(false);
                  }}
                >
                  Rose quartz signify universal love and peace. The crystal
                  helps align and amplify loving energies with spouses, family,
                  and friends, by promoting forgiveness and trust. Rose quartz
                  is particularly comforting in times of heartache and grief.
                </p>
              )}
              <h3
                className={styles.containerBitsHeader}
                onMouseEnter={(e) => {
                  setFlower(true);
                }}
              >
                <span className={styles.headerUnderline}>Rose Bud</span>
              </h3>
              {flower && (
                <p
                  className={styles.bitsText}
                  onMouseLeave={(e) => {
                    setFlower(false);
                  }}
                >
                  Red rose buds signify beauty, purity, love, and courage. This
                  special bud is handpicked by our candle creators, to channel
                  into the worlds divine love.
                </p>
              )}
            </div>
            <div className={styles.containerBuy}>
              <p className={styles.candleRetail}>
                $25<sup className={styles.candlePrice}>$30</sup>
              </p>
              {/* <form action="/api/checkout_sessions" method="POST"> */}
              <button
                className={styles.submitButton}
                onClick={handleOnAddToCart}
                type="button"
                // role="link"
              >
                ADD TO CART
              </button>
              {/* </form> */}
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default Love;
