import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";

import { OrdersContext } from "./OrdersContext";
import { useSupabase } from "./SupabaseContext";
import { ORDER_SELECT, toOrder } from "../utils/orders";

export function OrdersProvider({ children }) {
  const supabase = useSupabase();
  const { isLoaded, isSignedIn, userId } = useAuth();

  // Newest first, tagged with their owner.
  const [state, setState] = useState({ owner: null, orders: [] });
  const [error, setError] = useState(null);

  const isCurrent = isSignedIn && state.owner === userId;

  const load = useCallback(
    (owner) =>
      supabase
        .from("orders")
        .select(ORDER_SELECT)
        // Admins can read every order; this list is only the user's own.
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

  // Checkout happens in the database: place_order() prices the saved cart,
  // creates the order and empties the cart.
  const placeOrder = async () => {
    const { data, error: rpcError } = await supabase.rpc("place_order");

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
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
}
