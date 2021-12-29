import React, { useState } from "react";
import Image from "next/image";
import Layout from "../../components/Layout";
import styles from "../../styles/Candles.module.css";
import Candle from "../../public/candle.png";

const Love = (props) => {
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
        <div class={(styles.cursor, styles.cursorSmall)}></div>
        <canvas class={(styles.cursor, styles.cursorCanvas)} resize></canvas>
        <div className={styles.candleContent}>
          <div className={styles.candleContentHeader}>
            <h2 className={styles.candleTitle}>love</h2>
            <p className={styles.candleDescription}>
              Our rose otto, ylang ylang, orange, and patchouli scented candle
              not only smells divine, but is precisely paired with rose quartz
              chips and rose buds to amplify and attract love in your life.
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
              <p className={styles.candleCart}>add2cart</p>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default Love;
