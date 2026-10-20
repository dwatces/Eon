import {
  STORAGE_KEY,
  cartReducer,
  emptyCart,
  loadCart,
  parseStoredCart,
  saveCart,
} from "./cart";

// A small external store for the cart, read by React through
// useSyncExternalStore. It loads the saved cart on first read in the
// browser, writes every change back to storage, and follows changes made
// in other tabs. The server always sees an empty cart.
export function createCartStore(getStorage, target) {
  let state = null;
  const listeners = new Set();

  const read = () => {
    if (state === null) {
      const storage = getStorage();
      state = storage ? loadCart(storage) : emptyCart;
    }
    return state;
  };

  const emit = () => listeners.forEach((listener) => listener());

  const onStorage = (event) => {
    if (event.key !== STORAGE_KEY && event.key !== null) return;
    state = event.key === null ? emptyCart : parseStoredCart(event.newValue);
    emit();
  };

  return {
    getSnapshot: read,
    getServerSnapshot: () => emptyCart,
    subscribe(listener) {
      listeners.add(listener);
      if (listeners.size === 1) target?.addEventListener("storage", onStorage);
      return () => {
        listeners.delete(listener);
        if (listeners.size === 0) {
          target?.removeEventListener("storage", onStorage);
        }
      };
    },
    dispatch(action) {
      const current = read();
      const next = cartReducer(current, action);
      if (next === current) return;
      state = next;
      const storage = getStorage();
      if (storage) saveCart(storage, next);
      emit();
    },
  };
}
