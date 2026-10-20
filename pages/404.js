import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Message.module.css";

export default function NotFound() {
  return (
    <>
      <Head>
        <title>Page not found | Eon Candles</title>
        <meta name="robots" content="noindex" />
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>Page not found</h1>
        <p className={styles.text}>
          There&apos;s no page at this address. The link may be mistyped, or the
          page may have moved.
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
