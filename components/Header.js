import styles from "./Layout.module.css";
import backgroundImg from "../public/heroDesktop.webp";
import Image from "next/image";
import Link from "next/link";

const Header = () => (
  <>
    <header>
      <Link href="/shop" passHref>
        <Image
          src={backgroundImg}
          alt="hero banner"
          width={2200}
          height={600}
          layout="responsive"
          className={styles.header}
          priority
        />
      </Link>
    </header>
  </>
);

export default Header;
