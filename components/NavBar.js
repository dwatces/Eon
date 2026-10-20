import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useShoppingCart } from "../hooks/use-shopping-cart";
import Image from "next/image";
import Link from "next/link";
import styles from "./Layout.module.css";
import logo from "../assets/images/eon-logo.webp";
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
  const toggleRef = useRef(null);
  const menuRef = useRef(null);
  const closeNav = () => setNav(false);

  // Any navigation closes the mobile menu.
  useEffect(() => {
    const close = () => setNav(false);
    router.events.on("routeChangeStart", close);
    return () => router.events.off("routeChangeStart", close);
  }, [router.events]);

  // While the menu is open: focus starts on its first link, and Escape
  // closes it and puts focus back on the toggle.
  useEffect(() => {
    if (!showNav) return;
    menuRef.current?.querySelector("a")?.focus();
    const onKeyDown = (event) => {
      if (event.key !== "Escape") return;
      setNav(false);
      toggleRef.current?.focus();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [showNav]);

  return (
    <nav className={styles.navbar} aria-label="Main">
      <Link
        href="/"
        className={styles.logo}
        aria-label="Eon home"
        onClick={closeNav}
      >
        <Image
          src={logo}
          className={styles.eonLogo}
          alt=""
          width={60}
          height={30}
          loading="eager"
          fetchPriority="low"
        />
      </Link>
      <ul
        id="site-menu"
        ref={menuRef}
        className={`${styles.middleLinks} ${showNav ? styles.menuOpen : ""}`}
      >
        {LINKS.map(({ href, label, isActive }) => (
          <li key={href} className={styles.linkHome}>
            <Link
              href={href}
              className={styles.link}
              aria-current={isActive(router.pathname) ? "page" : undefined}
              onClick={closeNav}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
      <div className={styles.navActions}>
        <Link
          href="/cart"
          className={styles.cartItems}
          aria-label={`Cart, ${count} ${count === 1 ? "item" : "items"}`}
          onClick={closeNav}
        >
          <IoMdCart className={styles.Cartlink} size={24} aria-hidden="true" />
          {count > 0 && (
            <span className={styles.cartCount} aria-hidden="true">
              {count}
            </span>
          )}
        </Link>
        <button
          ref={toggleRef}
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
      {showNav && (
        // A tap outside the open menu closes it without following whatever
        // is underneath. Keyboard users close it with Escape or the toggle.
        <div
          className={styles.backdrop}
          onClick={closeNav}
          aria-hidden="true"
        />
      )}
    </nav>
  );
};

export default NavBar;
