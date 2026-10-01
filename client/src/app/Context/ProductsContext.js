import { createContext, useContext } from "react";

export const ProductsContext = createContext(null);

export function useProducts() {
  const context = useContext(ProductsContext);

  if (!context) {
    throw new Error("useProducts must be used inside ProductsProvider");
  }

  return context;
}
