import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Message.module.css";

export default function ServerError() {
  return (
    <>
      <Head>
        <title>Something went wrong | Eon Candles</title>
        <meta name="robots" content="noindex" />
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>Something went wrong</h1>
        <p className={styles.text}>
          The server couldn&apos;t load this page. Please try again in a moment.
        </p>
        <p className={styles.actions}>
          <Link href="/" className={styles.link}>
            Home
          </Link>
          <Link href="/shop" className={styles.link}>
            Shop the candles
          </Link>
        </p>
      </main>
    </>
  );
}
