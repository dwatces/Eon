import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import {
  STORAGE_KEY,
  cartCount,
  cartLines,
  cartReducer,
  cartShipping,
  cartSubtotal,
  cartTotal,
  emptyCart,
  loadCart,
  parseStoredCart,
  saveCart,
} from "../lib/cart";

const CartContext = createContext(null);

const storage = () => {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
};

// Starts empty on the server and on the first client render, so the HTML
// always matches. The saved cart loads after mount; `hydrated` says when.
export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, emptyCart);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const store = storage();
    if (store) dispatch({ type: "LOAD", lines: loadCart(store).lines });
    setHydrated(true);

    // Keep tabs in sync.
    const onStorage = (event) => {
      if (event.key === STORAGE_KEY) {
        dispatch({
          type: "LOAD",
          lines: parseStoredCart(event.newValue).lines,
        });
      } else if (event.key === null) {
        dispatch({ type: "CLEAR" });
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const store = storage();
    if (store) saveCart(store, cart);
  }, [cart, hydrated]);

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
        dispatch({ type: "ADD", slug, quantity }),
      setQuantity: (slug, quantity) =>
        dispatch({ type: "SET_QTY", slug, quantity }),
      removeLine: (slug) => dispatch({ type: "REMOVE_LINE", slug }),
      clearCart: () => dispatch({ type: "CLEAR" }),
    }),
    [cart, hydrated],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useShoppingCart() {
  const cart = useContext(CartContext);
  if (!cart)
    throw new Error("useShoppingCart must be used inside CartProvider");
  return cart;
}
