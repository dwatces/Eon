import styles from "./Layout.module.css";
import { FaFacebookF } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaEnvelope } from "react-icons/fa";

const Footer = () => (
  <footer className={styles.footer}>
    <a
      href="https://www.facebook.com/Eon-Candles-108966791697898"
      target="_blank"
      rel="noopener noreferrer"
      name="facebook"
      aria-label="facebook"
    >
      <div className={styles.socialButtonF}>
        <FaFacebookF className={styles.iconF} />
      </div>
    </a>

    <a
      href="https://instagram.com"
      target="_blank"
      rel="noopener noreferrer"
      name="instagram"
      aria-label="instagram"
    >
      <div className={styles.socialButtonI}>
        <FaInstagram className={styles.iconI} />
      </div>
    </a>

    <a
      href="http://eoncandles.co.nz/about#contact"
      name="emailUs"
      aria-label="Contact Us"
    >
      <div className={styles.socialButtonE}>
        <FaEnvelope className={styles.iconE} />
      </div>
    </a>
  </footer>
);

export default Footer;
