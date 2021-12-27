import React from "react";
import Head from "next/head";
import Footer from "./Footer";
import Header from "./Header";
import NavBar from "./NavBar";

const LandingLayout = (props) => (
  <React.Fragment>
    <Head>
      <title>Eon</title>
      <meta
        name="eon candles NZ"
        content="new zealand hand poured crystal energy aura promote vibes peace love dreams happiness"
      />
      <link rel="icon" href="/favicon.ico" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
        key="viewport"
      />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="true"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Raleway:wght@200;400&display=swap"
        rel="stylesheet"
      />
      <link rel="preload" as="image" href="../public/heroBanner.png" />
    </Head>
    <html>
      <NavBar />
      <body styles={{ maxWidth: "100%", width: "100vw", height: "100vh" }}>
        <Header />
        {props.children}
        <Footer />
      </body>
    </html>
  </React.Fragment>
);

export default LandingLayout;
