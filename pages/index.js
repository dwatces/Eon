import Link from "next/link";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import LandingLayout from "../components/LandingLayout";
import Seo from "../components/Seo";
import ProductCard from "../components/ProductCard";
import { candles } from "../data/candles";
import Logo from "../public/eon-logo.webp";
import Fire from "../public/burning-embers.svg";
import Earth from "../public/earth-asia-oceania.svg";
import Leaf from "../public/linden-leaf.svg";

const TILE_SIZES = "(min-width: 1180px) 270px, (min-width: 761px) 25vw, 50vw";

export default function Home() {
  return (
    <>
      <LandingLayout>
        <Seo
          description="Eon is a New Zealand candle label. Four hand-poured soy candles, Love, Happiness, Dreams and Summer, each paired with crystals and botanicals."
          path="/"
        />
        <main id="main" className={styles.main}>
          <div className={styles.eonL}>
            <h1 className={styles.logo}>
              <Image
                src={Logo}
                alt="Eon Candles"
                className={styles.eonLogo}
                width={100}
                height={50}
                priority
              />
            </h1>
            <p className={styles.tagline}>
              Hand-poured soy candles, paired with crystals for calm, positive
              energy.
            </p>
            <Link href="/shop" className={styles.cta}>
              Shop the candles
            </Link>
          </div>
          <div className={styles.eonContainer}>
            <div className={styles.eonLink}>
              <h2>
                <span className={styles.eonTitle}>Energy</span>
              </h2>
              <Image
                src={Fire}
                alt=""
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
                alt=""
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
                alt=""
                className={styles.eonIcon}
                width={80}
                height={30}
                priority
              />
            </div>
          </div>
          <div className={styles.eonText}>
            <p id="oneness" className={`${styles.eonPara} ${styles.hover}`}>
              Crystals have been used in traditions dating back millennia for
              their powerful ability to amplify the positive energies in our
              lives and ward against negative. Crystals have the power to allow
              us to release our fears, ground us from our daily anxieties, and
              bring us good fortune. That&apos;s why here at Eon, our 100%
              natural, soy wax, hand-poured candles are paired with specially
              selected, powerful crystals and natural accompaniments to spread
              the power of crystals throughout your home. Each candle scent is a
              seamless blend of natural ingredients that create a luxurious,
              relaxing, and endlessly enjoyable scent that you will love.
            </p>
            <p id="nature" className={`${styles.eonPara} ${styles.hover}`}>
              Our modern lives are so busy; we rarely take time to pause,
              breathe, and reconnect with the energies of the universe. We are
              all one with each other, with the Earth, and greater universe
              beyond. Crystals are ancient, formed in the earth eons ago; using
              their power we can reconnect with the universe that created us. We
              believe the simple act of taking a moment to slow down, light a
              candle, breathe deeply, and relax into the candle&apos;s
              peace-promoting scent allows the mind to calm and reconnect with
              the energies of the universe. This process of mindfulness opens
              you to receive the positive energies that are all around us just
              waiting to be received.
            </p>
            <p className={`${styles.eonPara} ${styles.hover}`}>
              We all desire a deeper connection with the natural world, and have
              the honour and duty to protect it. That&apos;s why each of our
              candles comes with a delicately chosen natural accompaniment to
              amplify the power of the candle and bring us closer to nature. We
              never contribute to landfills, all our NZ packaging is plastic
              free and biodegradable. The petite candle tins are also reusable!
              They make excellent storage for crystals, trinkets, or keepsakes
              after your candle has been enjoyed.
            </p>
          </div>
          <section className={styles.showcase} aria-labelledby="our-candles">
            <h2 id="our-candles" className={styles.showcaseHeading}>
              Our candles
            </h2>
            <ul className={styles.tiles}>
              {candles.map((candle) => (
                <li key={candle.slug}>
                  <ProductCard
                    candle={candle}
                    variant="tile"
                    headingLevel={3}
                    sizes={TILE_SIZES}
                  />
                </li>
              ))}
            </ul>
          </section>
        </main>
      </LandingLayout>
    </>
  );
}
