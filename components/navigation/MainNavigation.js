import React, { useState, useContext } from "react";
import Link from "next/link";
import MainHeader from "./MainHeader";
import NavLinks from "./NavLinks";
import SideDrawer from "./SideDrawer";
import styles from "./MainNavigation.module.css";

const MainNavigation = (props) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const openDrawer = () => {
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
  };

  return (
    <React.Fragment>
      {drawerOpen && <Backdrop onClick={closeDrawer} />}
      <SideDrawer show={drawerOpen} onClick={closeDrawer}>
        <nav className={styles.mainNavigationDrawerNav}>
          <NavLinks />
        </nav>
      </SideDrawer>

      <MainHeader>
        <button className={styles.mainNavigationMenuBtn} onClick={openDrawer}>
          <span></span>
          <span></span>
          <span></span>
        </button>
        <h1 className={styles.mainNavigationTitle}>
          <Link href="/" passHref>
            {" "}
          </Link>
        </h1>
        <nav className={styles.mainNavigationHeaderNav}>
          <NavLinks />
        </nav>
      </MainHeader>
    </React.Fragment>
  );
};

export default MainNavigation;
