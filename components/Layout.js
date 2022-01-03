import Head from "next/head";
import NavBar from "./NavBar";
import Footer from "./Footer";
import Client from "shopify-buy";

const client = Client.buildClient({
  domain: "eon-candles.myshopify.com",
  storefrontAccessToken: "30d3d76cf24c2919bfa53d50b1f157d5",
});

client.product.fetchAll().then((products) => {
  // Do something with the products
  console.log(products);
});

const Layout = (props) => (
  <>
    <Head>
      <title>Eon</title>
      <meta
        name="eon candles NZ "
        content="new zealand hand poured crystal energy aura promote good vibes peace love dreams happiness"
      />
      <link rel="icon" href="/favicon.ico" />
      <meta
        name="viewport"
        content="initial-scale=1.0, width=device-width"
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
      <link rel="preload" as="image" href="../public/crystals.png" />
      <link rel="preload" as="image" href="../public/NZNature.png" />
    </Head>
    <html>
      <NavBar />
      <body>
        {props.children}
        <Footer />
      </body>
    </html>
  </>
);

export default Layout;
