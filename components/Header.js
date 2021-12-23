import styles from "./Layout.module.css";
import backgroundImg from "../public/heroBanner.png";
import Image from "next/image";

const Header = () => (
  <>
    <header>
      <Image
        src={backgroundImg}
        alt="hero banner"
        width={2000}
        height={500}
        layout="responsive"
        className={styles.header}
        priority
      />
    </header>
  </>
);

export default Header;
