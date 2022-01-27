import "../styles/globals.css";
import Head from "next/head";
import { DefaultSeo } from "next-seo";
import { CartProvider } from "/hooks/use-shopping-cart";
import "react-image-lightbox/style.css";
import ResizeWindow from "../components/ResizeWindow";
import NoSSR from "@mui/base/NoSsr";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <NoSSR>
        <ResizeWindow />
        <Head>
          <DefaultSeo
            openGraph={{
              type: "candle website, crystal and nature, healing energy, spiritual, positive  and harmony",
              locale: "en_IE",
              url: "https://www.eoncandles.co.nz",
              site_name: "Eon",
            }}
          />
          <title>Eon</title>
          <meta
            name="description"
            content="new zealand hand poured crystal energy candals, aura promoting vibes, peace, special candal, gift, spirit, heaven"
          ></meta>
          <meta property="og:title" content="Eon" />
          <meta
            property="og:description"
            content="Visit Eon to purchase vegan soy handcrafted candals, special candals, featuring crystals and nature for healing and peace, promoting positive vibes!"
          />
          <meta property="og:url" content="https://www.eoncandles.co.nz" />
          <meta property="og:type" content="website" />
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
        </Head>

        <CartProvider>
          <NavBar />
          <html lang="en">
            <body
              styles={{ maxWidth: "100%", width: "100vw", height: "100vh" }}
            >
              <Component {...pageProps} />
              <Footer />
            </body>
          </html>
        </CartProvider>
      </NoSSR>
    </>
  );
}

export default MyApp;
