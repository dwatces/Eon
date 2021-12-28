import React, { useState } from "react";
import Image from "next/image";
import Layout from "../../components/Layout";
import styles from "../../styles/Candles.module.css";
import Candle from "../../public/candle.png";

const Summer = (props) => {
  const [crystal, setCrystal] = useState(false);
  const [flower, setFlower] = useState(false);

  return (
    <Layout>
      <main className={styles.main}>
        <div className={styles.galleryContainer}>
          <div className={styles.galleryImage}>
            <Image
              src={Candle}
              alt="candle"
              className={styles.candleSize}
              responsive="true"
              priority
            />
          </div>
          <div className={styles.galleryImage}>
            <Image
              src={Candle}
              alt="candle"
              className={styles.candleSize}
              responsive="true"
              priority
            />
          </div>
          <div className={styles.galleryImage}>
            <Image
              src={Candle}
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
              src={Candle}
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
              <p className={styles.candleCart}>add2cart</p>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default Summer;
