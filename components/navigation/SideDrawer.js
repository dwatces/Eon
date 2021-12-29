import React from "react";
import styles from "./SideDrawer.module.css";
import { CSSTransition } from "react-transition-group";

const SideDrawer = (props) => {
  return (
    <CSSTransition
      in={props.show}
      timeout={300}
      classNames="slide-in-left"
      unmountOnExit
      mountOnEnter
    >
      <aside className={styles.sideDrawer} onClick={props.onClick}>
        {props.children}
      </aside>
    </CSSTransition>
  );
};

export default SideDrawer;
