import React from "react";
import Link from "next/link";
import Image from "next/image";
import { BiMailSend } from "react-icons/bi";
import styles from "../styles/Shop.module.css";
import Layout from "../components/Layout";
import dreams from "../public/lid-dreams.png";
import happiness from "../public/lid-happiness.png";
import love from "../public/lid-love.png";
import summer from "../public/lid-summer.png";

function Shop() {
  return (
    <Layout>
      <main className={styles.main}>
        <div className={styles.mailModal}>
          <p className={styles.message}>
            <span className={styles.spamFirst}>
              Join our mailing list to receive promotional offers!
            </span>
            <span className={styles.spam}> (no spam, we promise) </span>
          </p>
          <BiMailSend className={styles.mailIcon} />
          <form
            action="https://eoncandles.us20.list-manage.com/subscribe/post?u=ede5da5ded002e22cfde82864&amp;id=f5e61a041d"
            method="post"
            w
            id="mc-embedded-subscribe-form"
            name="mc-embedded-subscribe-form"
            className={styles.validate}
            target="_blank"
            noValidate
          >
            <input
              type="email"
              id="mce-EMAIL"
              name="EMAIL"
              placeholder=" email address"
              className={styles.emailInput}
            ></input>
          </form>
        </div>
        <div className={styles.candleContainer}>
          <Link href="/shop/love">
            <div className={styles.candleChild}>
              <div className={styles.candlePic}>
                <Image
                  src={love}
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
                  src={happiness}
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
                  src={dreams}
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
                  src={summer}
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
