import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { BiMailSend } from "react-icons/bi";
import Candle from "../public/candle.png";
import styles from "../styles/Shop.module.css";
import Layout from "../components/Layout";

function Shop() {
  const [summer, setSummer] = useState(false);
  const [love, setLove] = useState(false);
  const [happy, setHappy] = useState(false);
  const [dreams, setDreams] = useState(false);

  return (
    <Layout>
      <main className={styles.main}>
        <div className={styles.mailModal}>
          <p className={styles.message}>
            <span className={styles.spamFirst}>
              Join our mailing list to get
            </span>{" "}
            10% off your first order!
            <span className={styles.spam}> (no spam, we promise) </span>
          </p>
          <BiMailSend className={styles.mailIcon} />
          <input
            type="email"
            id="email"
            name="email"
            placeholder=" email address"
            className={styles.emailInput}
          ></input>
          <span className={styles.emailButton}>Subscribe</span>
        </div>
        <div className={styles.candleContainer}>
          <Link href="/shop/love">
            <div className={styles.candleChild}>
              <div className={styles.candlePic}>
                <Image
                  src={Candle}
                  alt="candle"
                  className={styles.candleSize}
                  responsive="true"
                  priority
                />
              </div>
              <div className={styles.candleDetail}>
                <h2>love</h2>
                <p>Rose Otto, Ylang Ylang, Orange & Patchouli</p>
                <p>Rose Quartz Chips & Rose Bud</p>
                <p className={styles.candleDetailMuted}>
                  hand poured vegan soy wax
                </p>
              </div>
            </div>
          </Link>

          <Link href="/shop/happiness">
            <div className={styles.candleChild}>
              <div className={styles.candlePic}>
                <Image
                  src={Candle}
                  alt="candle"
                  className={styles.candleSize}
                  responsive="true"
                  priority
                />
              </div>
              <div className={styles.candleDetail}>
                <h2>happiness</h2>
                <p>Wild Orange, Clary Sage & Lemon</p>
                <p>Citrine Chips & Jasmine Flower Petals</p>
                <p className={styles.candleDetailMuted}>
                  hand poured vegan soy wax
                </p>
              </div>
            </div>
          </Link>

          <Link href="/shop/dreams">
            <div className={styles.candleChild}>
              <div className={styles.candlePic}>
                <Image
                  src={Candle}
                  alt="candle"
                  className={styles.candleSize}
                  responsive="true"
                  priority
                />
              </div>
              <div className={styles.candleDetail}>
                <h2>dreams</h2>
                <p>Lavender, Chamomile & Frankincense</p>
                <p>Amethyst Chips & Cornflowers</p>
                <p className={styles.candleDetailMuted}>
                  hand poured vegan soy wax
                </p>
              </div>
            </div>
          </Link>

          <Link href="/shop/summer">
            <div className={styles.candleChild}>
              <div className={styles.candlePic}>
                <Image
                  src={Candle}
                  alt="candle"
                  className={styles.candleSize}
                  responsive="true"
                  priority
                />
              </div>
              <div className={styles.candleDetail}>
                <h2>summer</h2>
                <p>Coconut, Mango & Lime</p>
                <p>Aventurine Chips & Lavender Flowers</p>
                <p className={styles.candleDetailMuted}>
                  hand poured vegan soy wax
                </p>
              </div>
            </div>
          </Link>
        </div>
      </main>
    </Layout>
  );
}

export default Shop;
