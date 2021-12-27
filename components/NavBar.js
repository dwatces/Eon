import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "./Layout.module.css";
import logo from "../public/eon-logo.png";

const NavBar = () => {
  const [showNav, setNav] = useState(false);
  const router = useRouter();
  const toggleNav = () => setNav(!showNav);

  return (
    <nav className={styles.navbar}>
      <Link href="/">
        <span className={styles.logo}>
          <Image
            src={logo}
            className={styles.eonLogo}
            alt="Logo"
            width={60}
            height={30}
          />
        </span>
      </Link>
      <div style={{ display: showNav ? "flex" : null }}>
        <ul className={styles.middleLinks}>
          <li className={router.pathname == "/" ? "active" : ""}>
            <span className={styles.link}>
              <Link href="/">Home</Link>
            </span>
          </li>
          <li className={router.pathname == "/shop" ? "active" : ""}>
            <span className={styles.link}>
              <Link href="/shop" className={styles.link}>
                Shop
              </Link>
            </span>
          </li>
          <li className={router.pathname == "/about" ? "active" : ""}>
            <span className={styles.link}>
              <Link href="/about" className={styles.link}>
                About
              </Link>
            </span>
          </li>
        </ul>
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
