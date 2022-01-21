import React, { useState, useEffect, useRef } from "react";
import { useShoppingCart } from "../../hooks/use-shopping-cart";
import { toast } from "react-hot-toast";
import Image from "next/image";
import Layout from "../../components/Layout";
import { products } from "../../components/products";
import { AiOutlineMinus } from "react-icons/ai";
import { AiOutlinePlus } from "react-icons/ai";
import styles from "../../styles/Candles.module.css";
import altPicCrystal from "../../public/Crystal-dreams.png";
import altPicFlower from "../../public/Flower-Dream.png";
import altPicLit from "../../public/lit-dreams.png";

const Dreams = (props) => {
  const [crystal, setCrystal] = useState(false);
  const [flower, setFlower] = useState(false);
  const { cartCount, addItem } = useShoppingCart();
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const toastId = useRef();
  const firstRun = useRef(true);

  const handleOnAddToCart = () => {
    setAdding(true);
    addItem(products[2], qty);
  };

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }

    setAdding(false);
    toast.success(`${qty} dreams added`, {
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
            <h2 className={styles.candleTitle}>dreams</h2>
            <p className={styles.candleDescription}>
              Follow your dreams with our lavender, chamomile, and frankincense
              candle. Paired with the powerful energy of amethyst crystals to
              provide clarity of mind, and cornflowers to bring wealth and good
              fortune.
            </p>
            <div className={styles.containerBits}>
              <h3
                className={styles.containerBitsHeader}
                onMouseEnter={(e) => {
                  setCrystal(true);
                }}
              >
                <span className={styles.headerUnderline}>Amethyst</span>
              </h3>
              {crystal && (
                <p
                  className={styles.bitsText}
                  onMouseLeave={(e) => {
                    setCrystal(false);
                    setFlower(false);
                  }}
                >
                  A most powerful and protective stone, amethyst will help you
                  gain a calm mind and spirit by warding off negative energies
                  and promoting spiritual harmony. Amethyst is known to promote
                  peaceful and restful sleep.
                </p>
              )}
              <h3
                className={styles.containerBitsHeader}
                onMouseEnter={(e) => {
                  setFlower(true);
                }}
              >
                <span className={styles.headerUnderline}>Cornflowers</span>
              </h3>
              {flower && (
                <p
                  className={styles.bitsText}
                  onMouseLeave={(e) => {
                    setFlower(false);
                    setCrystal(false);
                  }}
                >
                  Cornflowers symbolise wealth and good fortune in all aspects
                  of our lives; not just with money, but through love and health
                  as well.
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

export default Dreams;
