import { useState } from "react";
import { useRouter } from "next/router";
import { useShoppingCart } from "../hooks/use-shopping-cart";
import Image from "next/image";
import Link from "next/link";
import styles from "./Layout.module.css";
import logo from "../public/eon-logo.webp";
import { IoMdCart, IoMdClose, IoMdMenu } from "react-icons/io";

const LINKS = [
  { href: "/", label: "Home", isActive: (path) => path === "/" },
  {
    href: "/shop",
    label: "Shop",
    isActive: (path) => path.startsWith("/shop"),
  },
  { href: "/about", label: "About", isActive: (path) => path === "/about" },
];

const NavBar = () => {
  const [showNav, setNav] = useState(false);
  const { count } = useShoppingCart();
  const router = useRouter();
  const closeNav = () => setNav(false);

  return (
    <nav className={styles.navbar} aria-label="Main">
      <Link href="/" passHref>
        <a className={styles.logo} aria-label="Eon home" onClick={closeNav}>
          <Image
            src={logo}
            className={styles.eonLogo}
            alt=""
            width={60}
            height={30}
          />
        </a>
      </Link>
      <ul
        id="site-menu"
        style={{ display: showNav ? "flex" : null }}
        className={styles.middleLinks}
      >
        {LINKS.map(({ href, label, isActive }) => (
          <li
            key={href}
            className={`${isActive(router.pathname) ? "active" : ""} ${styles.linkHome}`}
          >
            <Link href={href} passHref>
              <a
                className={styles.link}
                aria-current={isActive(router.pathname) ? "page" : undefined}
                onClick={closeNav}
              >
                {label}
              </a>
            </Link>
          </li>
        ))}
      </ul>
      <div className={styles.navActions}>
        <Link href="/cart" passHref>
          <a
            className={styles.cartItems}
            aria-label={`Cart, ${count} ${count === 1 ? "item" : "items"}`}
            onClick={closeNav}
          >
            <IoMdCart
              className={styles.Cartlink}
              size={24}
              aria-hidden="true"
            />
            {count > 0 && (
              <span className={styles.cartCount} aria-hidden="true">
                {count}
              </span>
            )}
          </a>
        </Link>
        <button
          type="button"
          onClick={() => setNav(!showNav)}
          className={`${styles.btbIcon} ${styles.nav__hamburger}`}
          aria-label="Menu"
          aria-expanded={showNav}
          aria-controls="site-menu"
        >
          {showNav ? (
            <IoMdClose size={32} aria-hidden="true" />
          ) : (
            <IoMdMenu size={32} aria-hidden="true" />
          )}
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
