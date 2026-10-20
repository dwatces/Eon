import styles from "./Layout.module.css";
import backgroundImg from "../public/heroDesktop.webp";
import Image from "next/image";

const Header = () => (
  <>
    <header>
      <Image
        src={backgroundImg}
        alt="hero banner"
        width={2200}
        height={600}
        layout="responsive"
        className={styles.header}
        priority
      />
    </header>
  </>
);

export default Header;
