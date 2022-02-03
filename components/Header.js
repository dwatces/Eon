import styles from "./Layout.module.css";
import backgroundImg from "../public/heroDesktop.webp";
import MobileLogo from "../public/hero-mobile.webp";
import Image from "next/image";
import Link from "next/link";

const Header = () => (
  <>
    <header>
      <Link href="/shop" passHref>
        <Image
          src={backgroundImg}
          alt="hero banner"
          width={2000}
          height={800}
          layout="responsive"
          className={styles.header}
          priority
        />
      </Link>
      <Link href="/shop" passHref>
        <Image
          src={MobileLogo}
          alt=" Eon candles home mobile"
          className={styles.mobileHeader}
          responsive="true"
          priority
        />
      </Link>
    </header>
  </>
);

export default Header;
