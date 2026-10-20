import Seo from "../components/Seo";
import Link from "next/link";
import styles from "../styles/Message.module.css";

export default function ServerError() {
  return (
    <>
      <Seo
        title="Something went wrong"
        description="The Eon Candles site couldn't load this page."
        noindex
      />
      <main id="main" className={styles.main}>
        <h1 className={styles.title}>Something went wrong</h1>
        <p className={styles.text}>
          The server couldn&apos;t load this page. Please try again in a moment.
        </p>
        <p className={styles.actions}>
          <Link href="/shop" className={styles.primary}>
            Shop the candles
          </Link>
          <Link href="/" className={styles.link}>
            Home
          </Link>
        </p>
      </main>
    </>
  );
}
