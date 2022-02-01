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
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-5Q27LWP');`,
          }}
        ></script>

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
        <meta property="og:image" href="/public/eon-logo.png" />
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
