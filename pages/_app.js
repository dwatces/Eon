import "../styles/globals.css";
import Head from "next/head";
import { CartProvider } from "../hooks/use-shopping-cart";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { fraunces, raleway } from "../lib/fonts";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Eon Candles</title>
        <meta
          name="description"
          content="New Zealand handcrafted candles imbued with crystal and natural energy, promoting peaceful and positive vibes."
        />
        <meta property="og:title" content="Eon Candles New Zealand" />
        <meta
          property="og:description"
          content="Vegan soy candles from Eon, a New Zealand candle label, each paired with crystals and botanicals."
        />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Eon Candles" />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
          key="viewport"
        />
      </Head>
      <style jsx global>{`
        :root {
          --font-display: ${fraunces.style.fontFamily};
          --font-body: ${raleway.style.fontFamily};
        }
      `}</style>
      <CartProvider>
        <NavBar />
        <Component {...pageProps} />
        <Footer />
      </CartProvider>
    </>
  );
}

export default MyApp;
