import Link from "next/link";
import styles from "./Layout.module.css";
import { FaFacebookF } from "react-icons/fa";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
];

const Footer = () => (
  <footer className={styles.footer}>
    <div className={styles.footerTop}>
      <nav aria-label="Footer">
        <ul className={styles.footerLinks}>
          {LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link href={href} className={styles.footerLink}>
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <a
        href="https://www.facebook.com/Eon-Candles-108966791697898"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.socialButton}
        aria-label="Eon Candles on Facebook (opens in a new tab)"
      >
        <FaFacebookF className={styles.socialIcon} aria-hidden="true" />
      </a>
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
