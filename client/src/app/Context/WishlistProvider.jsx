import { useCallback, useEffect, useState } from "react";
import { useAuth, useClerk } from "@clerk/clerk-react";

import { WishlistContext } from "./WishlistContext";
import { useProducts } from "./ProductsContext";
import { useSupabase } from "./SupabaseContext";
import { getProductKey } from "../utils/products";

const fetchWishlist = (supabase) =>
  supabase.from("wishlist_items").select("product_id").order("created_at");

// The wishlist lives in the wishlist_items table, so it needs an account:
// guests who press a heart get the sign-in modal instead.
export function WishlistProvider({ children }) {
  const supabase = useSupabase();
  const { isLoaded, isSignedIn, userId } = useAuth();
  const { openSignIn } = useClerk();
  const { findProductById } = useProducts();

  // Product ids, oldest first, tagged with their owner.
  const [wishlist, setWishlist] = useState({ owner: null, ids: [] });
  const [error, setError] = useState(null);

  const ids = isSignedIn && wishlist.owner === userId ? wishlist.ids : [];

  const load = useCallback(
    (owner) =>
      fetchWishlist(supabase).then(({ data, error: fetchError }) => {
        if (fetchError) {
          setError(fetchError);
        } else {
          setWishlist({ owner, ids: data.map((row) => row.product_id) });
        }
      }),
    [supabase]
  );

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      load(userId);
    }
  }, [isLoaded, isSignedIn, userId, load]);

  const wishlistProducts = ids
    .map((id) => {
      const product = findProductById(id);
      return product && { ...product, wishlistKey: getProductKey(product) };
    })
    .filter(Boolean);

  const isWishlisted = (product) => ids.includes(product.id);

  const setSaved = async (product, saved) => {
    setWishlist((previous) => ({
      ...previous,
      ids: saved
        ? [...previous.ids, product.id]
        : previous.ids.filter((id) => id !== product.id),
    }));

    const table = supabase.from("wishlist_items");
    const { error: writeError } = saved
      ? await table.insert({ product_id: product.id })
      : await table.delete().eq("product_id", product.id);

    if (writeError) {
      setError(writeError);
      load(userId);
    }
  };

  const toggleWishlist = (product) => {
    if (!isSignedIn) {
      openSignIn();
      return;
    }

    setSaved(product, !isWishlisted(product));
  };

  const removeFromWishlist = (key) => {
    const product = wishlistProducts.find((item) => item.wishlistKey === key);

    if (product) {
      setSaved(product, false);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistProducts,
        wishlistCount: wishlistProducts.length,
        error,
        isWishlisted,
        toggleWishlist,
        removeFromWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}
