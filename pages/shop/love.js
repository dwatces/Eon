import React, { useState } from "react";
import Image from "next/image";
import Layout from "../../components/Layout";
import styles from "../../styles/Candles.module.css";
import Candle from "../../public/candle.png";

const Love = (props) => {
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
            <h2 className={styles.candleTitle}>love</h2>
            <p className={styles.candleDescription}>
              Our rose otto, ylang ylang, orange, and patchouli scented candle
              not only smells divine, but is precisely paired with rose quartz
              chips and rose buds to amplify and attract love in your life.
            </p>
            <div className={styles.containerBits}>
              <h3 className={styles.containerBitsHeader}>Rose Quartz</h3>
              <h3 className={styles.containerBitsHeader}>Rose Buds</h3>
            </div>
            <div className={styles.containerBuy}>
              <p>
                $25<sup className={styles.candlePrice}>$30</sup>
              </p>
              <p className={styles.candleCart}>add 2 cart</p>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default Love;
