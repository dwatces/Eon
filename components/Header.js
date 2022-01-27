import styles from "./Layout.module.css";
import backgroundImg from "../public/coverPhoto.png";
import Image from "next/image";

const Header = () => (
  <>
    <header>
      <Image
        src={backgroundImg}
        alt="hero banner"
        width={2000}
        height={600}
        layout="responsive"
        className={styles.header}
        priority
      />
    </header>
  </>
);

export default Header;
