import React, { useState } from "react";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import LandingLayout from "../components/LandingLayout";
import Logo from "../public/eon-logo.png";
import Image from "next/image";
import Fire from "../public/burning-embers.svg";
import Earth from "../public/earth-asia-oceania.svg";
import Leaf from "../public/linden-leaf.svg";
import love from "../public/top-love.png";
import dream from "../public/top-dream.png";
import happy from "../public/top-happy.png";
import summer from "../public/top-summer.png";

export default function Home() {
  const [candle1, setCandle1] = useState(false);
  const [candle2, setCandle2] = useState(false);
  const [candle3, setCandle3] = useState(false);
  const [candle4, setCandle4] = useState(false);

  return (
    <>
      <LandingLayout>
        <main className={styles.main}>
          <div className={styles.eonL}>
            <h1 className={styles.logo}>
              <Image
                src={Logo}
                alt=" Eon candles home"
                className={styles.eonLogo}
                width={100}
                height={50}
                priority
              />
            </h1>
            <div className={styles.underline}></div>
          </div>
          <div className={styles.eonContainer}>
            <div className={styles.eonLink}>
              <h2>
                <span className={styles.eonTitle}>Energy</span>
              </h2>
              <Image
                src={Fire}
                alt="flame"
                className={styles.eonIcon}
                width={100}
                height={50}
                priority
              />
            </div>
            <div className={styles.eonLink}>
              <h2>
                <a href="#oneness">
                  <span className={styles.eonTitle}>Oneness</span>
                </a>
              </h2>
              <Image
                src={Earth}
                alt="earth"
                className={styles.eonIcon}
                width={100}
                height={50}
                priority
              />
            </div>
            <div className={styles.eonLink}>
              <h2>
                <a href="#nature">
                  <span className={styles.eonTitle}>Nature</span>
                </a>
              </h2>
              <Image
                src={Leaf}
                alt="nature"
                className={styles.eonIcon}
                width={100}
                height={50}
                priority
              />
            </div>
          </div>
          <div className={styles.eonText}>
            <p id="oneness" className={(styles.eonPara, styles.hover)}>
              Crystals have been used in traditions, dating back millennia, to
              amplify the positive energy in our lives and ward against the
              negative. The power of crystals release fear, ground us from our
              daily anxieties, and bring good fortune. That&apos;s why here at
              Eon, we seamlessly blend elegance throughout our 100% natural soy
              wax, hand poured candles. Each luxuriously scented candle is
              paired with a special crystal and natural accompaniment to
              maximise the power each candle can provide.
            </p>
            <p
              id="nature"
              className={(styles.eonPara, styles.lastPara, styles.hover)}
            >
              Our modern lives are so busy; we rarely take time to pause,
              breath, and reconnect with the energies of the universe. We are
              all one, with each other, with the Earth, and beyond. Crystals are
              ancient, formed in the earth eons ago. Using their power we can
              reconnect with the universe that created us. We believe the simple
              act of taking the time to light one of our candles and enjoy their
              scent, will allow the mind to calm. This process of mindfulness
              may open you to receive the positive energies that are all around
              us.
            </p>
            <p className={(styles.eonPara, styles.hover)}>
              We all desire a deeper connection with the natural world, and have
              the honour and duty to protect it. That&apos;s why each of our
              candles come with a delicately chosen natural accompaniment to
              amplify the power of the candle and bring us closer to nature. We
              never contribute to landfills. All our NZ packaging is plastic
              free and biodegradable. The petite candle tins are also re-usable!
              They make excellent storage for crystals, trinkets, or keep sakes.
            </p>
          </div>
          <div className={styles.row}>
            <Link href="/shop/love" passHref>
              <div className={styles.rowItem}>
                <Image
                  src={love}
                  alt="topdown love"
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
              </div>
            </Link>
            <Link href="/shop/happiness" passHref>
              <div className={styles.rowItem}>
                <Image
                  src={happy}
                  alt="topdown happy"
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
              </div>
            </Link>
            <Link href="/shop/dreams" passHref>
              <div className={styles.rowItem}>
                <Image
                  src={dream}
                  alt="topdown dream"
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
              </div>
            </Link>
            <Link href="/shop/summer" passHref>
              <div className={styles.rowItem}>
                <Image
                  src={summer}
                  alt="topdown"
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
              </div>
            </Link>
          </div>
        </main>
      </LandingLayout>
    </>
  );
}
