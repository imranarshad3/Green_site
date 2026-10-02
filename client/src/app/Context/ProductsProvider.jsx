import { useCallback, useEffect, useState } from "react";

import { ProductsContext } from "./ProductsContext";
import { useSupabase } from "./SupabaseContext";
import { toProduct } from "../utils/products";

const fetchProducts = (supabase) =>
  supabase.from("products").select("*").order("id");

export function ProductsProvider({ children }) {
  const supabase = useSupabase();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const applyResult = useCallback(({ data, error: fetchError }) => {
    if (fetchError) {
      setError(fetchError);
    } else {
      setProducts(data.map(toProduct));
      setError(null);
    }

    setLoading(false);
  }, []);

  const reload = useCallback(
    () => fetchProducts(supabase).then(applyResult),
    [supabase, applyResult]
  );

  useEffect(() => {
    fetchProducts(supabase).then(applyResult);
  }, [supabase, applyResult]);

  const activeProducts = products.filter((product) => product.status !== "draft");

  const findProductById = (id) =>
    products.find((product) => String(product.id) === String(id));

  const findProduct = (type, id) => {
    const product = findProductById(id);
    return product?.type === type ? product : undefined;
  };

  return (
    <ProductsContext.Provider
      value={{
        allProducts: products,
        plants: activeProducts.filter((product) => product.type === "plant"),
        fertilizers: activeProducts.filter(
          (product) => product.type === "fertilizer"
        ),
        loading,
        error,
        reload,
        findProduct,
        findProductById,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}
