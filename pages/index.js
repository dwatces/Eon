import React, { useState } from "react";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import LandingLayout from "../components/LandingLayout";
import Logo from "../public/eon-logo.png";
import Image from "next/image";
import Fire from "../public/burning-embers.svg";
import Earth from "../public/earth-asia-oceania.svg";
import Leaf from "../public/linden-leaf.svg";
import Candle1 from "../public/candle1.png";
import Candle2 from "../public/candle2.png";

export default function Home() {
  const [candle1, setCandle1] = useState(false);
  const [candle2, setCandle2] = useState(false);
  const [candle3, setCandle3] = useState(false);
  const [candle4, setCandle4] = useState(false);

  return (
    <LandingLayout>
      <main className={styles.main}>
        <div className={styles.eonL}>
          <span className={styles.logo}>
            <Image
              src={Logo}
              alt="logo"
              className={styles.eonLogo}
              width={100}
              height={50}
              priority
            />
          </span>
          <div className={styles.underline}></div>
        </div>
        <div className={styles.eonContainer}>
          <div className={styles.eonLink}>
            <h2>
              <span className={styles.eonTitle}>Energy</span>
            </h2>
            <Image
              src={Fire}
              alt="logo"
              className={styles.eonIcon}
              width={100}
              height={50}
              priority
            />
          </div>
          <div className={styles.eonLink}>
            <h2>
              <span className={styles.eonTitle}>Oneness</span>
            </h2>
            <Image
              src={Earth}
              alt="logo"
              className={styles.eonIcon}
              width={100}
              height={50}
              priority
            />
          </div>
          <div className={styles.eonLink}>
            <h2>
              <span className={styles.eonTitle}>Nature</span>
            </h2>
            <Image
              src={Leaf}
              alt="logo"
              className={styles.eonIcon}
              width={100}
              height={50}
              priority
            />
          </div>
        </div>
        <div className={styles.eonText}>
          <p className={(styles.eonPara, styles.hover)}>
            Crystals have been used in traditions, dating back millennia, to
            amplify the positive energy in our lives and ward against the
            negative. The power of crystals release fear, ground us from our
            daily anxieties, and bring good fortune. That’s why we seamlessly
            blend elegance throughout our crystal imbued candles. Each
            luxuriously scented candle is paired with a different crystal and
            natural accompaniment to maximise it&apos;s power.
          </p>
          <p className={(styles.eonPara, styles.hover)}>
            Our modern lives are so busy; we rarely take time to pause, breath,
            and reconnect with the energies of the universe. We are all one,
            with each other, with the Earth, and beyond. Crystals are ancient,
            formed in the earth eons ago. Using their power we can reconnect
            with the universe that created us. We believe the simple act of
            taking the time to light one of our candles and enjoy its scent
            allows the mind to calm and opens you to receive the positive
            energies that are all around us.
          </p>
          <p className={(styles.eonPara, styles.hover)}>
            We all desire a deeper connection with the natural world, and have a
            duty to protect it. That’s why each of our candles come with a
            delicately chosen natural accompaniment to amplify the power of the
            candle and bring us closer to nature. We never contribute to
            landfills. All our NZ packaging is plastic free and biodegradable.
            The petite candle tins are also re-usable! They make excellent
            storage for crystals, trinkets, or keep sakes.
          </p>
        </div>
        <div className={styles.row}>
          <Link href="/shop/love">
            <div className={styles.rowItem}>
              <Image
                src={Candle1}
                alt="candle"
                className={styles.eonCandle}
                width={350}
                height={250}
                responsive="true"
                onMouseEnter={(e) => {
                  setCandle1(true);
                }}
                onMouseLeave={(e) => {
                  setCandle1(false);
                }}
              />
              {candle1 && (
                <>
                  <h2 className={styles.candleTitle}>love</h2>
                  <p className={styles.candleDescription}>
                    Rose Otto, Ylang Ylang, Orange & Patchouli
                  </p>
                  <p className={styles.candleEmbellishments}>
                    Rose Quartz Chips & Rose Bud
                  </p>
                  <p className={styles.veganWax}>Hand Poured Vegan Soy Wax</p>
                </>
              )}
            </div>
          </Link>
          <Link href="/shop/happiness">
            <div className={styles.rowItem}>
              <Image
                src={Candle2}
                alt="candle"
                className={styles.eonCandle}
                width={350}
                height={250}
                onMouseEnter={(e) => {
                  setCandle2(true);
                }}
                onMouseLeave={(e) => {
                  setCandle2(false);
                }}
              />
              {candle2 && (
                <>
                  <h2 className={styles.candleTitle}> hapiness </h2>
                  <p className={styles.candleDescription}>
                    Wild Orange, Clary Sage & Lemon
                  </p>
                  <p className={styles.candleEmbellishments}>
                    Citrine Chips & Jasmine Flower Petals
                  </p>
                  <p className={styles.veganWax}>Hand Poured Vegan Soy Wax</p>
                </>
              )}
            </div>
          </Link>
          <Link href="/shop/dreams">
            <div className={styles.rowItem}>
              <Image
                src={Candle1}
                alt="candle"
                className={styles.eonCandle}
                width={350}
                height={250}
                onMouseEnter={(e) => {
                  setCandle3(true);
                }}
                onMouseLeave={(e) => {
                  setCandle3(false);
                }}
              />

              {candle3 && (
                <>
                  <h2 className={styles.candleTitle}>dreams</h2>
                  <p className={styles.candleDescription}>
                    Lavender, Chamomile & Frankincense
                  </p>
                  <p className={styles.candleEmbellishments}>
                    Amethyst Chips & Cornflowers
                  </p>
                  <p className={styles.veganWax}>Hand Poured Vegan Soy Wax</p>
                </>
              )}
            </div>
          </Link>
          <Link href="/shop/summer">
            <div className={styles.rowItem}>
              <Image
                src={Candle2}
                alt="candle"
                className={styles.eonCandle}
                width={350}
                height={250}
                onMouseEnter={(e) => {
                  setCandle4(true);
                }}
                onMouseLeave={(e) => {
                  setCandle4(false);
                }}
              />
              {candle4 && (
                <>
                  <h2 className={styles.candleTitle}>summer</h2>
                  <p className={styles.candleDescription}>
                    Coconut, Mango & Lime
                  </p>
                  <p className={styles.candleEmbellishments}>
                    Aventurine Chips & Lavender Flowers
                  </p>
                  <p className={styles.veganWax}>Hand Poured Vegan Soy Wax</p>
                </>
              )}
            </div>
          </Link>
        </div>
      </main>
    </LandingLayout>
  );
}
