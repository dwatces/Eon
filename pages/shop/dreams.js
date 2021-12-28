import React, { useState } from "react";
import Image from "next/image";
import Layout from "../../components/Layout";
import styles from "../../styles/Candles.module.css";
import Candle from "../../public/candle.png";

const Dreams = (props) => {
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
                  The most powerful and protective stone, amethyst will help you
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
                  too.
                </p>
              )}
            </div>
            <div className={styles.containerBuy}>
              <p>
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

export default Dreams;
