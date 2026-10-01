import { useState } from "react";
import { useClerk } from "@clerk/clerk-react";
import { createClient } from "@supabase/supabase-js";

import { SupabaseContext } from "./SupabaseContext";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY");
}

export function SupabaseProvider({ children }) {
  const clerk = useClerk();

  const [client] = useState(() =>
    createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      accessToken: async () => (await clerk.session?.getToken()) ?? null,
    })
  );

  return (
    <SupabaseContext.Provider value={client}>
      {children}
    </SupabaseContext.Provider>
  );
}
