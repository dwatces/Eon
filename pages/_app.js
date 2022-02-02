import "../styles/globals.css";
import Script from "next/script";
import Head from "next/head";
import { DefaultSeo } from "next-seo";
import { CartProvider } from "/hooks/use-shopping-cart";
import "react-image-lightbox/style.css";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <DefaultSeo
          openGraph={{
            type: "candle website, crystal and nature, healing energy, spiritual, positive  and harmony",
            locale: "en_IE",
            url: "https://eoncandles.co.nz",
            site_name: "Eon",
          }}
        />
        <title>Eon Candles</title>
        <meta
          name="description"
          content="New Zealand handcrafted candles imbued with crystal and natural energy, promoting peaceful and positive vibes."
        ></meta>
        <meta property="og:title" content="Eon Candles New Zealand" />
        <meta
          property="og:description"
          content="Visit Eon to purchase vegan soy handcrafted candles, special candles, featuring crystals and nature for healing and peace, promoting positive vibes!"
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
          rel="canonical"
          href="https://eoncandles.co.nz/shop"
          key="canonical"
        />
        <link
          rel="canonical"
          href="https://eoncandles.co.nz/about"
          key="canonical"
        />
        <link rel="canonical" href="https://eoncandles.co.nz" key="canonical" />
        <link
          rel="alternate"
          href="http://eoncandles.co.nz/"
          hreflang="x-default"
        />
      </Head>
      <script
        async
        src="https://www.googletagmanager.com/gtag/js?id=UA-219103442-1"
      ></script>
      <Script id="google-analytics" strategy="afterInteractive">
        {`
      window.dataLayer = window.dataLayer || [];
       function gtag(){dataLayer.push(arguments);} gtag('js', new Date());
      gtag('config', 'UA-219103442-1');
    `}
      </Script>
      <CartProvider>
        <NavBar />
        <html lang="en-nz">
          <body styles={{ maxWidth: "100%", width: "100vw", height: "100vh" }}>
            <Component {...pageProps} />
            <Footer />
          </body>
        </html>
      </CartProvider>
    </>
  );
}

export default MyApp;
