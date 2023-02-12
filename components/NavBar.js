import { useState } from "react";
import { useRouter } from "next/router";
import { useShoppingCart } from "../hooks/use-shopping-cart";
import Image from "next/image";
import Link from "next/link";
import styles from "./Layout.module.css";
import logo from "../public/eon-logo.webp";
import { IoMdCart } from "react-icons/io";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

const NavBar = () => {
  const [showNav, setNav] = useState(false);
  const toggleNav = () => setNav(!showNav);
  const { cartDetails, cartCount } = useShoppingCart();
  const router = useRouter();

  return (
    <>
      <nav className={styles.navbar} role="navigation">
        <Link href="/" passHref hrefLang="en-nz">
          <span className={styles.logo} onClick={toggleNav}>
            <Image
              src={logo}
              className={styles.eonLogo}
              alt="Logo"
              width={60}
              height={30}
            />
          </span>
        </Link>
        <ul
          style={{ display: showNav ? "flex" : null }}
          className={styles.middleLinks}
        >
          <li
            className={
              (router.pathname == "/" ? "active" : "", styles.linkHome)
            }
          >
            <span className={styles.link} onClick={toggleNav}>
              <Link href="/" hrefLang="en-nz" passHref>
                Home
              </Link>
            </span>
          </li>
          <li
            className={
              (router.pathname == "/shop" ? "active" : "", styles.linkHome)
            }
          >
            <span className={styles.link} onClick={toggleNav}>
              <Link href="/shop" hrefLang="en-nz" className={styles.link}>
                Shop
              </Link>
            </span>
          </li>
          <li
            className={
              (router.pathname == "/about" ? "active" : "", styles.linkHome)
            }
          >
            <span className={styles.link} onClick={toggleNav}>
              <Link href="/about" hrefLang="en-nz" className={styles.link}>
                About
              </Link>
            </span>
          </li>
          <span className={styles.cartItems} onClick={toggleNav}>
            <Link href="/cart" passHref>
              <button
                className={styles.buttonCart}
                name="cartButton"
                aria-label="cartButton"
              >
                <IoMdCart className={styles.Cartlink} size="small" />
              </button>
            </Link>
          </span>
          <span className={styles.cartCount}>{cartCount}</span>
        </ul>
        <button
          type="button"
          onClick={toggleNav}
          className={(styles.btbIcon, styles.nav__hamburger)}
          aria-label="toggle navigation"
        >
          {showNav ? (
            <CloseIcon color="warning" fontSize="large" />
          ) : (
            <>
              <MenuIcon color="warning" fontSize="large" />
              <IoMdCart className={styles.CartlinkMobile} size="small" />
            </>
          )}
          <span className={styles.cartItems} onClick={toggleNav}>
            <Link href="/cart" passHref>
              <button
                onClick="/cart"
                className={styles.buttonCart}
                name="cartButton"
                aria-label="cartButton"
              >
                <IoMdCart className={styles.Cartlink} size="small" />
              </button>
            </Link>
          </span>
          <span className={styles.cartCount}>{cartCount}</span>
        </button>
      </nav>
    </>
  );
};

export default NavBar;
