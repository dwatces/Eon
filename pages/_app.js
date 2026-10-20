import "../styles/globals.css";
import Head from "next/head";
import { CartProvider } from "../hooks/use-shopping-cart";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import ErrorBoundary from "../components/ErrorBoundary";
import { useRouter } from "next/router";
import { fraunces, raleway } from "../lib/fonts";

function MyApp({ Component, pageProps }) {
  const { asPath } = useRouter();
  return (
    <>
      <Head>
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
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <CartProvider>
        <NavBar />
        <ErrorBoundary resetKey={asPath.split("#")[0]}>
          <Component {...pageProps} />
        </ErrorBoundary>
        <Footer />
      </CartProvider>
    </>
  );
}

export default MyApp;
