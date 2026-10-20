import { Component } from "react";
import Link from "next/link";
import { LEGACY_STORAGE_KEY, STORAGE_KEY } from "../lib/cart";
import styles from "../styles/Message.module.css";

export function clearSavedCart(storage) {
  try {
    storage.removeItem(STORAGE_KEY);
    storage.removeItem(LEGACY_STORAGE_KEY);
  } catch {
    // Blocked storage holds no cart to clear.
  }
}

const reloadPage = () => window.location.reload();

const browserStorage = () => {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
};

// Catches a render error in the page and offers a way out instead of a
// blank screen. The navigation and footer sit outside it and keep
// working. It resets when the route (resetKey) changes.
export default class ErrorBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidUpdate(previous) {
    if (this.state.failed && previous.resetKey !== this.props.resetKey) {
      this.setState({ failed: false });
    }
  }

  render() {
    if (!this.state.failed) return this.props.children;

    const reload = this.props.reload ?? reloadPage;
    const clearCart = () => {
      const storage = browserStorage();
      if (storage) clearSavedCart(storage);
      reload();
    };

    return (
      <main id="main" className={styles.main}>
        <h1 className={styles.title}>Something went wrong on this page</h1>
        <p className={styles.text}>
          Reloading usually fixes it. If it keeps happening, clearing the cart
          saved in this browser should.
        </p>
        <div className={styles.actions}>
          <button type="button" className={styles.button} onClick={reload}>
            Reload
          </button>
          <Link href="/shop" className={styles.link}>
            Go to the shop
          </Link>
          <button type="button" className={styles.button} onClick={clearCart}>
            Clear saved cart
          </button>
        </div>
      </main>
    );
  }
}
