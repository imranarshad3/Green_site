import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";

import { useSupabase } from "./SupabaseContext";

export function useStockAlert(product) {
  const supabase = useSupabase();
  const { isSignedIn, userId } = useAuth();
  const { user } = useUser();
  const [state, setState] = useState({ key: null, subscribed: false });
  const [busy, setBusy] = useState(false);

  const productId = product?.id;
  const key = isSignedIn && productId ? `${userId}-${productId}` : null;

  useEffect(() => {
    if (!key) return;

    supabase
      .from("stock_alerts")
      .select("id")
      .eq("product_id", productId)
      .eq("user_id", userId)
      .maybeSingle()
      .then(({ data }) => setState({ key, subscribed: Boolean(data) }));
  }, [supabase, key, productId, userId]);

  const subscribed = state.key === key && state.subscribed;

  const toggle = async () => {
    setBusy(true);

    const { error } = subscribed
      ? await supabase
          .from("stock_alerts")
          .delete()
          .eq("product_id", productId)
          .eq("user_id", userId)
      : await supabase.from("stock_alerts").insert({
          product_id: productId,
          email: user?.primaryEmailAddress?.emailAddress ?? null,
        });

    if (!error) {
      setState({ key, subscribed: !subscribed });
    }

    setBusy(false);
  };

  return {
    subscribed,
    busy,
    toggle,
    email: user?.primaryEmailAddress?.emailAddress ?? null,
  };
}
