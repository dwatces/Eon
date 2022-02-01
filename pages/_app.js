import "../styles/globals.css";
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
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=UA-219103442-1"
        ></script>
        <script>
          window.dataLayer = window.dataLayer || []; function gtag()
          {dataLayer.push(arguments)}; gtag(&apos;js&apos;, new Date());
          gtag(&apos;config&apos;, &apos;UA-219103442-1&apos;);
        </script>

        <DefaultSeo
          openGraph={{
            type: "candle website, crystal and nature, healing energy, spiritual, positive  and harmony",
            locale: "en_IE",
            url: "https://www.eoncandles.co.nz",
            site_name: "Eon",
          }}
        />
        <title>Eon Candles</title>
        <meta
          name="description"
          content="New Zealand handcrafted candles imbued with crystal and natural energy, promoting peaceful and positive vibes."
        ></meta>
        <meta property="og:title" content="Eon" />
        <meta
          property="og:description"
          content="Visit Eon to purchase vegan soy handcrafted candles, special candles, featuring crystals and nature for healing and peace, promoting positive vibes!"
        />
        <meta property="og:url" content="https://www.eoncandles.co.nz" />
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
        {/* <link
          rel="canonical"
          href="https://eoncandles.co.nz/shop/love"
          key="canonical"
        />
        <link
          rel="canonical"
          href="https://eoncandles.co.nz/shop/dreams"
          key="canonical"
        />
        <link
          rel="canonical"
          href="https://eoncandles.co.nz/shop/happiness"
          key="canonical"
        />
        <link
          rel="canonical"
          href="https://eoncandles.co.nz/shop/summer"
          key="canonical"
        /> */}
      </Head>

      <CartProvider>
        <NavBar />
        <html lang="en-uk">
          <noscript
            dangerouslySetInnerHTML={{
              __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-5Q27LWP"
height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
            }}
          ></noscript>
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
