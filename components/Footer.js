import styles from "./Layout.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF } from "@fortawesome/free-brands-svg-icons";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";

const Footer = () => (
  <footer className={styles.footer}>
    <a href="https://facebook.com">
      <div className={styles.socialButtonF}>
        <FontAwesomeIcon icon={faFacebookF} className={styles.iconF} />
      </div>
    </a>

    <a href="https://instagram.com">
      <div className={styles.socialButtonI}>
        <FontAwesomeIcon icon={faInstagram} className={styles.iconI} />
      </div>
    </a>
  </footer>
);

export default Footer;
