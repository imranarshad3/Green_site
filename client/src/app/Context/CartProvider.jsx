import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@clerk/clerk-react";

import { CartContext } from "./CartContext";
import { useProducts } from "./ProductsContext";
import { useSupabase } from "./SupabaseContext";
import { usePersistentState } from "./usePersistentState";
import {
  MAX_LINE_QUANTITY,
  fromRow,
  persistLineQuantity,
  sameLine,
  withLineQuantity,
} from "./cartStore";
import { getCartItemId } from "../utils/cart";

const lineFromItem = (item) => ({
  productId: item.id,
  size: item.selectedSize ?? null,
  potStyle: item.selectedPotStyle ?? null,
});

export function CartProvider({ children }) {
  const supabase = useSupabase();
  const { isLoaded, isSignedIn, userId } = useAuth();
  const { findProductById } = useProducts();

  const [guestLines, setGuestLines] = usePersistentState(
    "plantify-guest-cart",
    []
  );
  const [userCart, setUserCart] = useState({ owner: null, lines: [] });
  const [error, setError] = useState(null);
  const writeQueue = useRef(Promise.resolve());

  const isUserCart = isSignedIn && userCart.owner === userId;
  const lines = isSignedIn ? (isUserCart ? userCart.lines : []) : guestLines;

  const loadUserCart = useCallback(
    (owner) =>
      supabase
        .from("cart_items")
        .select("product_id, size, pot_style, quantity")
        .order("created_at")
        .then(({ data, error: fetchError }) => {
          if (fetchError) {
            setError(fetchError);
          } else {
            setUserCart({ owner, lines: data.map(fromRow) });
          }
        }),
    [supabase]
  );

  const guestLinesRef = useRef(guestLines);

  useEffect(() => {
    guestLinesRef.current = guestLines;
  }, [guestLines]);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    const mergeAndLoad = async () => {
      const guest = guestLinesRef.current;

      if (guest.length > 0) {
        const { data } = await supabase
          .from("cart_items")
          .select("product_id, size, pot_style, quantity");
        const saved = (data ?? []).map(fromRow);

        for (const line of guest) {
          const existing = saved.find((item) => sameLine(item, line));
          await persistLineQuantity(
            supabase,
            line,
            Math.min(
              (existing?.quantity ?? 0) + line.quantity,
              MAX_LINE_QUANTITY
            )
          ).catch(setError);
        }

        setGuestLines([]);
      }

      await loadUserCart(userId);
    };

    mergeAndLoad();
  }, [isLoaded, isSignedIn, userId, supabase, loadUserCart, setGuestLines]);

  const setLineQuantity = (line, quantity) => {
    if (!isSignedIn) {
      setGuestLines((previous) => withLineQuantity(previous, line, quantity));
      return;
    }

    setUserCart((previous) => ({
      ...previous,
      lines: withLineQuantity(previous.lines, line, quantity),
    }));

    writeQueue.current = writeQueue.current
      .then(() => persistLineQuantity(supabase, line, quantity))
      .catch((writeError) => {
        setError(writeError);
        return loadUserCart(userId);
      });
  };

  const cartItems = lines
    .map((line) => {
      const product = findProductById(line.productId);

      if (!product) return null;

      return {
        ...product,
        cartItemId: getCartItemId(product, line.size, line.potStyle),
        selectedSize: line.size ?? undefined,
        selectedPotStyle: line.potStyle ?? undefined,
        quantity: line.quantity,
      };
    })
    .filter(Boolean);

  const findItem = (cartItemId) =>
    cartItems.find((item) => item.cartItemId === cartItemId);

  const addToCart = (item) => {
    const line = lineFromItem(item);
    const existing = lines.find((current) => sameLine(current, line));

    setLineQuantity(
      line,
      (existing?.quantity ?? 0) + (Number(item.quantity) || 1)
    );
  };

  const changeQuantity = (cartItemId, delta) => {
    const item = findItem(cartItemId);

    if (item) {
      setLineQuantity(lineFromItem(item), item.quantity + delta);
    }
  };

  const removeFromCart = (cartItemId) => {
    const item = findItem(cartItemId);

    if (item) {
      setLineQuantity(lineFromItem(item), 0);
    }
  };

  const resetCart = () => {
    if (isSignedIn) {
      setUserCart({ owner: userId, lines: [] });
    } else {
      setGuestLines([]);
    }
  };

  const cartCount = cartItems.reduce(
    (total, item) => total + Number(item.quantity || 0),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        loading: isSignedIn && !isUserCart,
        error,
        addToCart,
        removeFromCart,
        increaseQuantity: (cartItemId) => changeQuantity(cartItemId, 1),
        decreaseQuantity: (cartItemId) => changeQuantity(cartItemId, -1),
        resetCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
