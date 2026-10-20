import styles from "./Layout.module.css";
import backgroundImg from "../assets/images/hero-banner.webp";
import Image from "next/image";

// The home banner, and the largest image on the page: loaded eagerly at
// high priority. React preloads it once from the server HTML; `priority`
// would add a second, identical preload tag.
// From 761px it keeps its long 2200:600 frame. From 481 to 760px it shows
// at its own shape. Up to 480px it is cropped to the middle two tins so
// they stay legible: the photo is 3.03 times as wide as it is tall, so a
// 1.4:1 frame shows it at 216% of the viewport width, hence `sizes`.
const SIZES = "(max-width: 480px) 216vw, 100vw";

const Header = () => (
  <header>
    <Image
      src={backgroundImg}
      alt="Four Eon candle tins in a row, Dreams, Love, Happiness and Summer, with crystals in front"
      sizes={SIZES}
      className={styles.header}
      placeholder="blur"
      loading="eager"
      fetchPriority="high"
    />
  </header>
);

export default Header;
