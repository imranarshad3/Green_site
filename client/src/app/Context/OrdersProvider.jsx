import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";

import { OrdersContext } from "./OrdersContext";
import { useSupabase } from "./SupabaseContext";
import { ORDER_SELECT, toOrder } from "../utils/orders";

export function OrdersProvider({ children }) {
  const supabase = useSupabase();
  const { isLoaded, isSignedIn, userId } = useAuth();

  const [state, setState] = useState({ owner: null, orders: [] });
  const [error, setError] = useState(null);

  const isCurrent = isSignedIn && state.owner === userId;

  const load = useCallback(
    (owner) =>
      supabase
        .from("orders")
        .select(ORDER_SELECT)
        .eq("user_id", owner)
        .order("created_at", { ascending: false })
        .then(({ data, error: fetchError }) => {
          if (fetchError) {
            setError(fetchError);
          } else {
            setState({ owner, orders: data.map(toOrder) });
          }
        }),
    [supabase]
  );

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      load(userId);
    }
  }, [isLoaded, isSignedIn, userId, load]);

  const placeOrder = async () => {
    const { data, error: rpcError } = await supabase.rpc("place_order");

    if (rpcError) {
      throw rpcError;
    }

    await load(userId);
    return data;
  };

  const buyNow = async (product, { quantity = 1, size = null, potStyle = null } = {}) => {
    const isPlant = product.type !== "fertilizer";
    const { data, error: rpcError } = await supabase.rpc("buy_now", {
      p_product_id: product.id,
      p_quantity: quantity,
      p_size: isPlant ? size : null,
      p_pot_style: isPlant ? potStyle : null,
    });

    if (rpcError) {
      throw rpcError;
    }

    await load(userId);
    return data;
  };

  return (
    <OrdersContext.Provider
      value={{
        orders: isCurrent ? state.orders : [],
        loading: isSignedIn && !isCurrent,
        error,
        placeOrder,
        buyNow,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
}
