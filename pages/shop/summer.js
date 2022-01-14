import React, { useState, useEffect, useRef } from "react";
import { useShoppingCart } from "../../hooks/use-shopping-cart";
import { toast } from "react-hot-toast";
import Image from "next/image";
import Layout from "../../components/Layout";
import { summer } from "../../components/products";
import { AiOutlineMinus } from "react-icons/ai";
import { AiOutlinePlus } from "react-icons/ai";
import styles from "../../styles/Candles.module.css";
import altPicFlower from "../../public/Flower-Summer.png";
import altPicCrystal from "../../public/crystal-summer.png";
import altPicLit from "../../public/Lit-Summer.png";

const Summer = (props) => {
  const [crystal, setCrystal] = useState(false);
  const [flower, setFlower] = useState(false);
  const { cartCount, addItem } = useShoppingCart();
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const toastId = useRef();
  const firstRun = useRef(true);

  const handleOnAddToCart = () => {
    setAdding(true);
    toastId.current = toast.loading(
      `Adding ${qty} item${qty > 1 ? "s" : ""}...`
    );
    addItem(summer, qty);
  };

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }

    setAdding(false);
    toast.success(`${qty} summer added`, {
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
            <h2 className={styles.candleTitle}>summer</h2>
            <p className={styles.candleDescription}>
              Bring on the summer vibes with our coconut, mango, and lime
              scented candle. Paired with both aventurine crystal shards for
              good blessings and lavender flowers for peace and grace.
            </p>
            <div className={styles.containerBits}>
              <h3
                className={styles.containerBitsHeader}
                onMouseEnter={(e) => {
                  setCrystal(true);
                }}
              >
                <span className={styles.headerUnderline}>Aventurine</span>
              </h3>
              {crystal && (
                <p
                  className={styles.bitsText}
                  onMouseLeave={(e) => {
                    setCrystal(false);
                  }}
                >
                  This high energy crystal will attract abundance and prosperity
                  to your life. It is a comforter and a harmoniser, bringing
                  luck and blessings to your life. A perfect accompaniment to a
                  summer&apos;s evening.
                </p>
              )}
              <h3
                className={styles.containerBitsHeader}
                onMouseEnter={(e) => {
                  setFlower(true);
                }}
              >
                <span className={styles.headerUnderline}>
                  Lavender Flowers{" "}
                </span>
              </h3>
              {flower && (
                <p
                  className={styles.bitsText}
                  onMouseLeave={(e) => {
                    setFlower(false);
                  }}
                >
                  These flowers represent serenity, grace, peace, and calmness.
                  These energies are exactly what summer is all about!
                </p>
              )}
            </div>
            <div className={styles.containerBuy}>
              <p className={styles.candleRetail}>
                $25<sup className={styles.candlePrice}>$30</sup>
              </p>
              <p className={styles.quantity}>Quantity:</p>
              <button
                className={styles.candleQuantity}
                onClick={() => setQty((prev) => prev - 1)}
                disabled={qty <= 1}
              >
                <AiOutlineMinus />
              </button>
              <p>{qty}</p>
              <button
                className={styles.candleQuantity}
                onClick={() => setQty((prev) => prev + 1)}
              >
                <AiOutlinePlus />
              </button>
              <button
                className={styles.submitButton}
                onClick={handleOnAddToCart}
                type="button"
                disabled={adding}
              >
                ADD TO CART
              </button>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default Summer;
