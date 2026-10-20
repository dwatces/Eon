import Link from "next/link";
import styles from "./Layout.module.css";
import { FaFacebookF, FaEnvelope } from "react-icons/fa";

const Footer = () => (
  <footer className={styles.footer}>
    <div className={styles.footerLinks}>
      <a
        href="https://www.facebook.com/Eon-Candles-108966791697898"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Eon Candles on Facebook (opens in a new tab)"
      >
        <div className={styles.socialButtonF}>
          <FaFacebookF className={styles.iconF} aria-hidden="true" />
        </div>
      </a>
      <Link href="/about#contact" aria-label="Contact">
        <div className={styles.socialButtonE}>
          <FaEnvelope className={styles.iconE} aria-hidden="true" />
        </div>
      </Link>
    </div>
    <p className={styles.footerNote}>
      This is a portfolio demo shop: no real orders or payments are taken.
    </p>
    <p className={styles.footerCredit}>
      <a href="https://danielolliver.com/dev/">Site by Daniel Olliver</a>
    </p>
  </footer>
);

export default Footer;
