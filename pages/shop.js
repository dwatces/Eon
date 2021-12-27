import React, { useState } from "react";
import Image from "next/image";
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
        <div className={styles.candleContainer}>
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
          {love && (
            <>
              <div
                className={styles.candleMain}
                onMouseLeave={(e) => {
                  setLove(false);
                }}
              >
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
            </>
          )}
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
        </div>
      </main>
    </Layout>
  );
}

export default Shop;
