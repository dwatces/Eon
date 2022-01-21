import "../styles/globals.css";
import Head from "next/head";
import { CartProvider } from "/hooks/use-shopping-cart";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { Toaster } from "react-hot-toast";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Eon</title>
        <meta
          name="eon candles "
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
        <link rel="preload" as="image" href="../public/crystals.png" />
        <link rel="preload" as="image" href="../public/NZNature.png" />
      </Head>
      <CartProvider>
        <html>
          <NavBar />
          <body styles={{ maxWidth: "100%", width: "100vw", height: "100vh" }}>
            <Component {...pageProps} />
            <Footer />
          </body>
        </html>
      </CartProvider>
      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
}

export default MyApp;
