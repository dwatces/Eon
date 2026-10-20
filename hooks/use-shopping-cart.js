import {
  createContext,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";
import {
  cartCount,
  cartLines,
  cartShipping,
  cartSubtotal,
  cartTotal,
} from "../lib/cart";
import { createCartStore } from "../lib/cart-store";

const browserStorage = () => {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
};

const store = createCartStore(
  browserStorage,
  typeof window === "undefined" ? null : window,
);

const noSubscription = () => () => {};

const CartContext = createContext(null);

// The server and the hydrating render both see an empty cart, so the HTML
// always matches; React then re-renders with the saved cart. `hydrated`
// turns true in that same render.
export function CartProvider({ children }) {
  const cart = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot,
  );
  const hydrated = useSyncExternalStore(
    noSubscription,
    () => true,
    () => false,
  );

  const value = useMemo(
    () => ({
      hydrated,
      lines: cart.lines,
      count: cartCount(cart),
      items: cartLines(cart),
      subtotal: cartSubtotal(cart),
      shipping: cartShipping(cart),
      total: cartTotal(cart),
      addItem: (slug, quantity = 1) =>
        store.dispatch({ type: "ADD", slug, quantity }),
      setQuantity: (slug, quantity) =>
        store.dispatch({ type: "SET_QTY", slug, quantity }),
      removeLine: (slug) => store.dispatch({ type: "REMOVE_LINE", slug }),
      clearCart: () => store.dispatch({ type: "CLEAR" }),
    }),
    [cart, hydrated],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useShoppingCart() {
  const cart = useContext(CartContext);
  if (!cart) {
    throw new Error("useShoppingCart must be used inside CartProvider");
  }
  return cart;
}
