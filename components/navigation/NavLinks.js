import React, { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import styles from "./NavLinks.module.css";
import logo from "../../public/eon-logo.png";

const NavLinks = () => {
  const [showNav, setNav] = useState(false);
  const router = useRouter();
  const toggleNav = () => setNav(!showNav);
  return (
    <ul className={styles.navLinks}>
      <Link href="/" passHref>
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
      <li className={router.pathname == "/" ? "active" : ""}>
        <span>
          <Link href="/">Home</Link>
        </span>
      </li>
      <li className={router.pathname == "/shop" ? "active" : ""}>
        <span>
          <Link href="/shop" activeClassName={styles.activeLink}>
            Shop
          </Link>
        </span>
      </li>
      <li className={router.pathname == "/about" ? "active" : ""}>
        <span>
          <Link href="/about" activeClassName={styles.activeLink}>
            About
          </Link>
        </span>
      </li>
    </ul>
  );
};

export default NavLinks;
