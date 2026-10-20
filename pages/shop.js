import React from "react";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Shop.module.css";
import { getCandle } from "../data/candles";
import { formatNZD } from "../lib/money";
import dreams from "../public/lid-dreams.webp";
import happiness from "../public/lid-happiness.webp";
import love from "../public/lid-love.webp";
import summer from "../public/lid-summer.webp";

function Shop() {
  return (
    <>
      <Head>
        <title>Candle Shop</title>
        <meta name="description" content="Shop for Eons candle products" />
      </Head>
      <main className={styles.main}>
        <h1 className={styles.visuallyHidden}>Our candles</h1>
        <div className={styles.candleContainer}>
          <Link href="/shop/love" passHref>
            <div className={styles.candleChild}>
              <div className={styles.candlePic}>
                <Image
                  src={love}
                  alt="candle love"
                  className={styles.candleSize}
                  priority
                />
              </div>
              <div className={styles.candleDetail}>
                <h2>love</h2>
                <p>Rose Otto, Ylang Ylang, Orange & Patchouli</p>
                <p>Rose Quartz Chips & Rose Bud</p>
                <p className={styles.candleDetailMuted}>
                  {formatNZD(getCandle("love").unitAmount)}
                </p>
              </div>
            </div>
          </Link>
          <Link href="/shop/happiness" passHref>
            <div className={styles.candleChild}>
              <div className={styles.candlePic}>
                <Image
                  src={happiness}
                  alt="candle happiness"
                  className={styles.candleSize}
                  priority
                />
              </div>
              <div className={styles.candleDetail}>
                <h2>happiness</h2>
                <p>Wild Orange, Clary Sage & Lemon</p>
                <p>Citrine Chips & Jasmine Flower Petals</p>
                <p className={styles.candleDetailMuted}>
                  {formatNZD(getCandle("happiness").unitAmount)}
                </p>
              </div>
            </div>
          </Link>

          <Link href="/shop/dreams" passHref>
            <div className={styles.candleChild}>
              <div className={styles.candlePic}>
                <Image
                  src={dreams}
                  alt="candle dreams"
                  className={styles.candleSize}
                  priority
                />
              </div>
              <div className={styles.candleDetail}>
                <h2>dreams</h2>
                <p>Lavender, Chamomile & Frankincense</p>
                <p>Amethyst Chips & Cornflowers</p>
                <p className={styles.candleDetailMuted}>
                  {formatNZD(getCandle("dreams").unitAmount)}
                </p>
              </div>
            </div>
          </Link>

          <Link href="/shop/summer" passHref>
            <div className={styles.candleChild}>
              <div className={styles.candlePic}>
                <Image
                  src={summer}
                  alt="candle summer"
                  className={styles.candleSize}
                  priority
                />
              </div>
              <div className={styles.candleDetail}>
                <h2>summer</h2>
                <p>Coconut, Mango & Lime</p>
                <p>Aventurine Chips & Lavender Flowers</p>
                <p className={styles.candleDetailMuted}>
                  {formatNZD(getCandle("summer").unitAmount)}
                </p>
              </div>
            </div>
          </Link>
        </div>
      </main>
    </>
  );
}

export default Shop;
