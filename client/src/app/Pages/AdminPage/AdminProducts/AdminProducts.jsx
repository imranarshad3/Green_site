import React, { useState } from "react";
import { Plus } from "lucide-react";

import { useProducts } from "../../../Context/ProductsContext";
import { useSupabase } from "../../../Context/SupabaseContext";
import ProductForm from "../ProductForm/ProductForm";

function AdminProducts() {
  const supabase = useSupabase();
  const { allProducts, loading, reload } = useProducts();
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState(null);

  const toggleActive = async (product) => {
    const { error: updateError } = await supabase
      .from("products")
      .update({ is_active: !product.isActive })
      .eq("id", product.id);

    setError(updateError?.message ?? null);
    reload();
  };

  if (editing) {
    return (
      <ProductForm
        product={editing === "new" ? null : editing}
        onDone={() => {
          setEditing(null);
          reload();
        }}
        onCancel={() => setEditing(null)}
      />
    );
  }

  return (
    <section className="admin-section">
      <div className="admin-section-head">
        <p>
          {allProducts.length} products ·{" "}
          {allProducts.filter((product) => !product.isActive).length} hidden
        </p>

        <button
          type="button"
          className="admin-button"
          onClick={() => setEditing("new")}
        >
          <Plus size={16} />
          Add product
        </button>
      </div>

      {error && <p className="admin-error">{error}</p>}

      {loading ? (
        <p className="admin-muted">Loading products…</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Type</th>
                <th>Category</th>
                <th>Price</th>
                <th>Visible</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {allProducts.map((product) => (
                <tr
                  key={product.id}
                  className={product.isActive ? "" : "is-hidden"}
                >
                  <td>
                    <div className="admin-product-cell">
                      {product.images[0] && (
                        <img src={product.images[0]} alt="" />
                      )}
                      <span>{product.name}</span>
                    </div>
                  </td>
                  <td>{product.type}</td>
                  <td>{product.category}</td>
                  <td>${product.price.toFixed(2)}</td>
                  <td>
                    <label className="admin-switch">
                      <input
                        type="checkbox"
                        checked={product.isActive}
                        onChange={() => toggleActive(product)}
                        aria-label={`Show ${product.name} in the store`}
                      />
                      <span />
                    </label>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="admin-link-button"
                      onClick={() => setEditing(product)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default AdminProducts;
