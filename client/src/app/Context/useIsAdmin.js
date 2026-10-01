import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";

import { useSupabase } from "./SupabaseContext";

// Whether the signed-in user has a row in public.admins. RLS lets users read
// only their own row, so a non-empty result means "admin".
export function useIsAdmin() {
  const supabase = useSupabase();
  const { isLoaded, isSignedIn, userId } = useAuth();
  const [result, setResult] = useState({ userId: null, isAdmin: false });

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    supabase
      .from("admins")
      .select("user_id")
      .eq("user_id", userId)
      .then(({ data }) => {
        setResult({ userId, isAdmin: (data ?? []).length > 0 });
      });
  }, [isLoaded, isSignedIn, userId, supabase]);

  const checked = !isSignedIn || result.userId === userId;

  return {
    isAdmin: isSignedIn && result.userId === userId && result.isAdmin,
    loading: !isLoaded || !checked,
  };
}
