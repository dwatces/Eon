import { useState } from "react";
import { useRouter } from "next/router";
import { useShoppingCart } from "../hooks/use-shopping-cart";
import Image from "next/image";
import Link from "next/link";
import SideDrawer from "./navigation/SideDrawer";
import styles from "./Layout.module.css";
import logo from "../public/eon-logo.png";
import { IoMdCart } from "react-icons/io";

const NavBar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { totalPrice, cartCount } = useShoppingCart();
  const router = useRouter();

  const openDrawer = () => {
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
  };

  return (
    <>
      <SideDrawer show={drawerOpen} onClick={closeDrawer}>
        <div style={{ display: drawerOpen ? "flex" : null }}>
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
      </SideDrawer>
      <nav className={styles.navbar}>
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
        <button className={styles.mainNavigationMenuBtn} onClick={openDrawer}>
          <span></span>
          <span></span>
          <span></span>
        </button>

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
          <span className={styles.cartItems}>
            <form
              action="/api/checkout_sessions"
              className={styles.Cartlink}
              method="POST"
            >
              <button className={styles.buttonCart} type="submit" role="link">
                <IoMdCart size="small" />
              </button>
            </form>
          </span>

          <span className={styles.cartCount}>{cartCount}</span>
        </ul>
      </nav>
    </>
  );
};

export default NavBar;
