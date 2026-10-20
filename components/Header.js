import styles from "./Layout.module.css";
import backgroundImg from "../public/heroDesktop.webp";
import Image from "next/image";

const Header = () => (
  <>
    <header>
      <Image
        src={backgroundImg}
        alt="Four Eon candle tins in a row, Dreams, Love, Happiness and Summer, with crystals in front"
        width={2200}
        height={600}
        sizes="100vw"
        style={{ width: "100%", height: "auto", aspectRatio: "2200 / 600" }}
        className={styles.header}
        priority
      />
    </header>
  </>
);

export default Header;
