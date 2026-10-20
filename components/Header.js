import styles from "./Layout.module.css";
import backgroundImg from "../public/heroDesktop.webp";
import Image from "next/image";

// The home banner, and the largest image on the page: loaded eagerly at
// high priority. React preloads it once from the server HTML; `priority`
// would add a second, identical preload tag. From 761px it keeps its long 2200:600 frame; on
// phones it is cropped to the middle two tins so they stay legible.
// `sizes` follows the cropped width: the photo is 3.03 times as wide as
// it is tall, so a 1.4:1 frame shows it at 216% of the viewport width.
const SIZES = "(max-width: 480px) 216vw, (max-width: 760px) 138vw, 100vw";

const Header = () => (
  <header>
    <Image
      src={backgroundImg}
      alt="Four Eon candle tins in a row, Dreams, Love, Happiness and Summer, with crystals in front"
      sizes={SIZES}
      className={styles.header}
      loading="eager"
      fetchPriority="high"
    />
  </header>
);

export default Header;
