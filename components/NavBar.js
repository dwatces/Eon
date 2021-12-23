import { useState } from "react";
import styles from "./Layout.module.css";
import logo from "../public/eon-logo.png";
import Image from "next/image";

const NavBar = () => {
  const [showNav, setNav] = useState(false);

  const toggleNav = () => setNav(!showNav);

  return (
    <nav className={styles.navbar}>
      <a href="/">
        <span className={styles.logo}>
          <Image
            src={logo}
            className={styles.eonLogo}
            alt="Logo"
            width={60}
            height={30}
          />
        </span>
      </a>
      <div
        style={{ display: showNav ? "flex" : null }}
        className={styles.middleLinks}
      >
        <a href="/" onClick={toggleNav} className={styles.link}>
          Home
        </a>

        <a href="/shop" onClick={toggleNav} className={styles.link}>
          Shop
        </a>
        <a href="/about" onClick={toggleNav} className={styles.link}>
          About
        </a>
      </div>
      {/* <a href="/cart" onClick={toggleNav} className={styles.cartLink}>
        {/* <ShoppingCartIcon color="action" /> */}

      <button
        type="button"
        onClick={toggleNav}
        className={(styles.btn, styles.btnIcon, styles.nav__hamburger)}
        aria-label="toggle navigation"
      >
        {/* {showNav ? <CloseIcon /> : <MenuIcon color="active" />} */}
      </button>
    </nav>
  );
};

export default NavBar;
