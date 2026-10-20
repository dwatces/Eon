import Seo from "../components/Seo";
import Link from "next/link";
import styles from "../styles/Message.module.css";

export default function NotFound() {
  return (
    <>
      <Seo
        title="Page not found"
        description="There's no page at this address on the Eon Candles site."
        noindex
      />
      <main id="main" className={styles.main}>
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
