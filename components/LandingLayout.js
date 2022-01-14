import React from "react";
import Header from "./Header";

const LandingLayout = (props) => (
  <React.Fragment>
    <Header />
    {props.children}
  </React.Fragment>
);

export default LandingLayout;
