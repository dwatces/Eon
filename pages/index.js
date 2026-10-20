import Link from "next/link";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import LandingLayout from "../components/LandingLayout";
import Seo from "../components/Seo";
import ProductCard from "../components/ProductCard";
import { candles } from "../data/candles";
import Logo from "../assets/images/eon-logo.webp";
import Fire from "../assets/icons/burning-embers.svg";
import Earth from "../assets/icons/earth-asia-oceania.svg";
import Leaf from "../assets/icons/linden-leaf.svg";

const TILE_SIZES =
  "(min-width: 1180px) 268px, (min-width: 761px) calc(25vw - 1.7rem), calc(50vw - 2.2rem)";

// The label's three pillars: an icon, a heading and the story behind it.
const PILLARS = [
  {
    id: "energy",
    title: "Energy",
    icon: Fire,
    text: "Crystals have been used in traditions dating back millennia for their powerful ability to amplify the positive energies in our lives and ward against negative. Crystals have the power to allow us to release our fears, ground us from our daily anxieties, and bring us good fortune. That's why here at Eon, our 100% natural, soy wax, hand-poured candles are paired with specially selected, powerful crystals and natural accompaniments to spread the power of crystals throughout your home. Each candle scent is a seamless blend of natural ingredients that create a luxurious, relaxing, and endlessly enjoyable scent that you will love.",
  },
  {
    id: "oneness",
    title: "Oneness",
    icon: Earth,
    text: "Our modern lives are so busy; we rarely take time to pause, breathe, and reconnect with the energies of the universe. We are all one with each other, with the Earth, and greater universe beyond. Crystals are ancient, formed in the earth eons ago; using their power we can reconnect with the universe that created us. We believe the simple act of taking a moment to slow down, light a candle, breathe deeply, and relax into the candle's peace-promoting scent allows the mind to calm and reconnect with the energies of the universe. This process of mindfulness opens you to receive the positive energies that are all around us just waiting to be received.",
  },
  {
    id: "nature",
    title: "Nature",
    icon: Leaf,
    text: "We all desire a deeper connection with the natural world, and have the honour and duty to protect it. That's why each of our candles comes with a delicately chosen natural accompaniment to amplify the power of the candle and bring us closer to nature. We never contribute to landfills, all our NZ packaging is plastic free and biodegradable. The petite candle tins are also reusable! They make excellent storage for crystals, trinkets, or keepsakes after your candle has been enjoyed.",
  },
];

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
                loading="eager"
                fetchPriority="low"
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
          {/* Three pillars of the label, each with its story. */}
          <div className={styles.eonContainer}>
            {PILLARS.map(({ id, title, icon, text }) => (
              <section key={id} id={id} className={styles.eonLink}>
                <div className={styles.pillarHead}>
                  <Image
                    src={icon}
                    alt=""
                    className={styles.eonIcon}
                    width={80}
                    height={30}
                  />
                  <h2 className={styles.eonTitle}>{title}</h2>
                </div>
                <p className={styles.eonPara}>{text}</p>
              </section>
            ))}
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
