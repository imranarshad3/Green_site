import { createContext, useContext } from "react";

export const SupabaseContext = createContext(null);

export function useSupabase() {
  const client = useContext(SupabaseContext);

  if (!client) {
    throw new Error("useSupabase must be used inside SupabaseProvider");
  }

  return client;
}
