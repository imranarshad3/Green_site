import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";

import { OrdersContext } from "./OrdersContext";
import { useSupabase } from "./SupabaseContext";
import { ORDER_SELECT, toOrder } from "../utils/orders";
import { toPromo } from "../utils/cart";

const toShippingPayload = (shipping) => ({
  name: shipping.name,
  email: shipping.email,
  phone: shipping.phone,
  address: shipping.address,
  city: shipping.city,
  postal_code: shipping.postalCode,
});

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

  const getOrder = useCallback(
    (orderNumber) =>
      supabase
        .from("orders")
        .select(ORDER_SELECT)
        .eq("order_number", orderNumber)
        .maybeSingle()
        .then(({ data, error: fetchError }) => {
          if (fetchError) {
            throw fetchError;
          }

          return data ? toOrder(data) : null;
        }),
    [supabase]
  );

  const cancelOrder = async (orderNumber, reason = null) => {
    const { error: rpcError } = await supabase.rpc("cancel_order", {
      p_order_number: orderNumber,
      p_reason: reason,
    });

    if (rpcError) {
      throw rpcError;
    }

    await load(userId);
    return getOrder(orderNumber);
  };

  const requestReturn = async (orderNumber, reason, details = null) => {
    const { error: rpcError } = await supabase.rpc("request_return", {
      p_order_number: orderNumber,
      p_reason: reason,
      p_details: details,
    });

    if (rpcError) {
      throw rpcError;
    }

    await load(userId);
    return getOrder(orderNumber);
  };

  const checkPromo = async (code, subtotal) => {
    const { data, error: rpcError } = await supabase.rpc("check_promo", {
      p_code: code,
      p_subtotal: subtotal,
    });

    if (rpcError) {
      throw rpcError;
    }

    return toPromo(data);
  };

  const placeOrder = async ({ shipping, promoCode = null }) => {
    const { data, error: rpcError } = await supabase.rpc("place_order", {
      p_shipping: toShippingPayload(shipping),
      p_promo_code: promoCode,
    });

    if (rpcError) {
      throw rpcError;
    }

    await load(userId);
    return data;
  };

  const buyNow = async (
    product,
    { quantity = 1, size = null, potStyle = null, shipping, promoCode = null }
  ) => {
    const isPlant = product.type !== "fertilizer";
    const { data, error: rpcError } = await supabase.rpc("buy_now", {
      p_product_id: product.id,
      p_quantity: quantity,
      p_size: isPlant ? size : null,
      p_pot_style: isPlant ? potStyle : null,
      p_shipping: toShippingPayload(shipping),
      p_promo_code: promoCode,
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
        getOrder,
        cancelOrder,
        requestReturn,
        checkPromo,
        placeOrder,
        buyNow,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
}
