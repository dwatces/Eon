import "../styles/globals.css";
import React, { lazy } from "react";
import Script from "next/script";
import Head from "next/head";
import { CartProvider } from "/hooks/use-shopping-cart";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Eon Candles</title>
        Content-Encoding: gzip | compress | deflate | br| identity
        <meta
          name="description"
          content="New Zealand handcrafted candles imbued with crystal and natural energy, promoting peaceful and positive vibes."
        ></meta>
        <meta property="og:title" content="Eon Candles New Zealand" />
        <meta
          property="og:description"
          content="Visit Eon to purchase vegan soy handcrafted candles, featuring crystals and nature for healing and peace, promoting positive vibes!"
        />
        <meta property="og:url" content="https://eoncandles.co.nz" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Eon Candles" />
        <meta property="og:image" href="https://ibb.co/Z8JwnkT" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
          key="viewport"
        />
        <link
          rel="alternate"
          hrefLang="en-nz"
          href="https://eoncandles.co.nz"
        />
        <link
          rel="canonical"
          href="https://eoncandles.co.nz/shop"
          key="canonical"
          hrefLang="en-nz"
        />
        <link
          rel="canonical"
          href="https://eoncandles.co.nz/about"
          key="canonical"
          hrefLang="en-nz"
        />
        <link rel="alternate" hrefLang="x" href="https://eoncandles.co.nz/" />
      </Head>
      <script
        defer
        src="https://www.googletagmanager.com/gtag/js?id=UA-219103442-1"
      ></script>
      <Script defer id="google-analytics" strategy="afterInteractive">
        {`
      window.dataLayer = window.dataLayer || [];
       function gtag(){dataLayer.push(arguments);} gtag('js', new Date());
      gtag('config', 'UA-219103442-1');
    `}
      </Script>
      <CartProvider>
        <NavBar />
        <html lang="en-NZ">
          <body styles={{ maxWidth: "100%", width: "100vw", height: "100vh" }}>
            <p style={{ display: "none" }}>
              Crystal Candles, candle with crystals
            </p>
            <Component {...pageProps} />
            <Footer />
          </body>
        </html>
      </CartProvider>
    </>
  );
}

export default MyApp;
