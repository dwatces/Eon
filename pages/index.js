import React, { useState } from "react";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import LandingLayout from "../components/LandingLayout";
import Logo from "../public/eon-logo.webp";
import MobileSummer from "../public/mobile-summer.webp";
import MobileDreams from "../public/mobile-dreams.webp";
import MobileLove from "../public/mobile-love.webp";
import MobileHappy from "../public/mobile-happy.webp";
import Image from "next/image";
import Fire from "../public/burning-embers.svg";
import Earth from "../public/earth-asia-oceania.svg";
import Leaf from "../public/linden-leaf.svg";
import love from "../public/top-love.webp";
import dream from "../public/top-dream.webp";
import happy from "../public/top-happy.webp";
import summer from "../public/top-summer.webp";

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
            <h1 className={(styles.logo, styles.desktopLogo)}>
              <Image
                src={Logo}
                alt=" Eon candles home desktop"
                className={styles.eonLogo}
                width={100}
                height={50}
                priority
              />
            </h1>
            <div className={styles.underline}></div>
            <div className={(styles.row, styles.mobileTop)}>
              <Link href="/shop/love" passHref>
                <div className={styles.rowItem}>
                  <Image
                    src={MobileLove}
                    alt="topdown love"
                    className={styles.eonCandle}
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
                    src={MobileHappy}
                    alt="topdown happy"
                    className={styles.eonCandle}
                    responsive="true"
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
                    src={MobileDreams}
                    alt="topdown dream"
                    className={styles.eonCandle}
                    responsive="true"
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
                    src={MobileSummer}
                    alt="topdown summer"
                    className={styles.eonCandle}
                    responsive="true"
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
          </div>
          <div className={styles.eonContainer}>
            <div className={styles.eonLink}>
              <h2>
                <span className={styles.eonTitle}>Energy</span>
              </h2>
              <Image
                src={Fire}
                alt="flame icon"
                className={styles.eonIcon}
                width={80}
                height={30}
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
                alt="earth icon"
                className={styles.eonIcon}
                width={80}
                height={30}
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
                alt="nature icon"
                className={styles.eonIcon}
                width={80}
                height={30}
                priority
              />
            </div>
          </div>
          <div className={styles.eonText}>
            <p id="oneness" className={(styles.eonPara, styles.hover)}>
              Crystals have been used in traditions dating back millennia for
              their powerful ability to amplify the positive energies in our
              lives and ward against negative. Crystals have the power to allow
              us to release our fears, ground us from our daily anxieties, and
              bring us good fortune. That's why here at Eon, our 100% natural,
              soy wax, hand poured candles are paired with a specially selected,
              powerful crystals and a natural accompaniments to spread the power
              of crystals throughout your home. Each candle scent is a seamless
              blend of natural ingredients that create a luxurious, relaxing,
              and endlessly enjoyable scent that you will love.
            </p>
            <p
              id="nature"
              className={(styles.eonPara, styles.lastPara, styles.hover)}
            >
              Our modern lives are so busy; we rarely take time to pause,
              breath, and reconnect with the energies of the universe. We are
              all one with each other, with the Earth, and greater universe
              beyond. Crystals are ancient, formed in the earth eons ago; using
              their power we can reconnect with the universe that created us. We
              believe the simple act of taking a moment to slow down, light a
              candle, breath deeply, and relax into the the candles' peace
              promoting scent allows the mind to calm and reconnect with the
              energies of the universe. This process of mindfulness opens you to
              receive the positive energies that are all around us just waiting
              to be received.
            </p>
            <p className={(styles.eonPara, styles.hover)}>
              We all desire a deeper connection with the natural world, and have
              the honour and duty to protect it. That's why each of our candles
              come with a delicately chosen natural accompaniment to amplify the
              power of the candle and bring us closer to nature. We never
              contribute to landfills, all our NZ packaging is plastic free and
              biodegradable. The petite candle tins are also re-usable! They
              make excellent storage for crystals, trinkets, or keep sakes after
              your candle has been enjoyed.
            </p>
          </div>
          <div className={(styles.row, styles.DesktopTop)}>
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
                  alt="topdown summer"
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
