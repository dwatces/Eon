import React, { useState } from "react";
import Image from "next/image";
import Layout from "../../components/Layout";
import styles from "../../styles/Candles.module.css";
import altPicFlower from "../../public/Flower-Happy2.png";
import altPicCrystal from "../../public/Crystal-Happy.png";
import altPicLit from "../../public/lit-happy.png";

const Happiness = (props) => {
  const [crystal, setCrystal] = useState(false);
  const [flower, setFlower] = useState(false);

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
              className={styles.candleSizeMain}
              responsive="true"
              priority
            />
          </div>
        </div>
        <div className={styles.candleContent}>
          <div className={styles.candleContentHeader}>
            <h2 className={styles.candleTitle}>happiness</h2>
            <p className={styles.candleDescription}>
              Fill the room with positive energies and appreciation for all the
              good in life with the beautiful scents of wild orange, clary sage,
              and lemon. This candle comes paired with citrine chips that
              channel happiness, and jasmine flower petals for clarity and
              perspective.
            </p>
            <div className={styles.containerBits}>
              <h3
                className={styles.containerBitsHeader}
                onMouseEnter={(e) => {
                  setCrystal(true);
                }}
              >
                <span className={styles.headerUnderline}>Citrine</span>
              </h3>
              {crystal && (
                <p
                  className={styles.bitsText}
                  onMouseLeave={(e) => {
                    setCrystal(false);
                  }}
                >
                  Citrine enables prosperity, joy, and energy. This powerful
                  crystal provides creative and intuitive energy that may
                  overcome fears. Use this crystal to channel joy into your home
                  and life.
                </p>
              )}
              <h3
                className={styles.containerBitsHeader}
                onMouseEnter={(e) => {
                  setFlower(true);
                }}
              >
                <span className={styles.headerUnderline}>
                  Jasmine Flower Petals
                </span>
              </h3>
              {flower && (
                <p
                  className={styles.bitsText}
                  onMouseLeave={(e) => {
                    setFlower(false);
                  }}
                >
                  These petals represent clarity and appreciation. We can all
                  use a reminder now and then of the good that we give and
                  receive; use the energy of jasmine petals to gain a new
                  perspective and understanding of how wonderful life can be.
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

export default Happiness;
