import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Award, FlaskConical, Plus, ShoppingCart, Sprout, Trash2 } from "lucide-react";

import { useProducts } from "../../../Context/ProductsContext";
import { useSupabase } from "../../../Context/SupabaseContext";
import { PRODUCT_STATUSES } from "../../../utils/products";
import ProductForm from "../ProductForm/ProductForm";

const PRODUCT_TYPES = [
  { type: "plant", param: "plants", title: "Plants", singular: "plant", plural: "plants", icon: Sprout },
  { type: "fertilizer", param: "fertilizers", title: "Fertilizers", singular: "fertilizer", plural: "fertilizers", icon: FlaskConical },
];

const LOW_STOCK = 5;

const tallySales = (rows) => {
  const sales = {};

  for (const row of rows) {
    const entry = sales[row.product_id] ?? { units: 0, revenue: 0 };
    entry.units += row.quantity;
    entry.revenue += Number(row.price) * row.quantity;
    sales[row.product_id] = entry;
  }

  return sales;
};

const topBy = (products, sales, field) =>
  products.reduce((best, product) => {
    const value = sales[product.id]?.[field] ?? 0;
    return value > 0 && value > (sales[best?.id]?.[field] ?? 0) ? product : best;
  }, null);

function StockInput({ product, onSave }) {
  const [value, setValue] = useState(String(product.stock));

  const commit = () => {
    const next = Number(value);

    if (value === "" || !Number.isInteger(next) || next < 0) {
      setValue(String(product.stock));
      return;
    }

    if (next !== product.stock) onSave(product, next);
  };

  const level =
    product.stock === 0 ? "is-out" : product.stock <= LOW_STOCK ? "is-low" : "";

  return (
    <input
      type="number"
      min="0"
      step="1"
      className={`admin-stock-input ${level}`}
      value={value}
      onChange={(event) => setValue(event.target.value)}
      onBlur={commit}
      onKeyDown={(event) => {
        if (event.key === "Enter") event.currentTarget.blur();
      }}
      aria-label={`Stock of ${product.name}`}
    />
  );
}

function SalesHighlight({ icon: Icon, label, product, detail, loading }) {
  return (
    <div className="admin-sales-card">
      <span className="admin-sales-icon">
        <Icon size={18} />
      </span>
      <div>
        <p className="admin-sales-label">{label}</p>
        {loading ? (
          <>
            <span className="admin-sales-placeholder" />
            <span className="admin-sales-placeholder is-short" />
          </>
        ) : product ? (
          <>
            <p className="admin-sales-name">{product.name}</p>
            <p className="admin-muted">{detail}</p>
          </>
        ) : (
          <p className="admin-muted">No orders yet</p>
        )}
      </div>
    </div>
  );
}

function AdminProducts() {
  const supabase = useSupabase();
  const { allProducts, loading, reload } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const [editing, setEditing] = useState(null);
  const [confirmingDelete, setConfirmingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [sales, setSales] = useState(null);

  const labels =
    PRODUCT_TYPES.find((item) => item.param === searchParams.get("type")) ??
    PRODUCT_TYPES[0];
  const type = labels.type;

  const selectType = (item) => {
    setSearchParams(
      (params) => {
        params.set("type", item.param);
        return params;
      },
      { replace: true },
    );
    setConfirmingDelete(null);
  };

  useEffect(() => {
    supabase
      .from("order_items")
      .select("product_id, quantity, price, orders!inner(status)")
      .neq("orders.status", "cancelled")
      .not("product_id", "is", null)
      .then(({ data, error: fetchError }) => {
        if (fetchError) {
          setError(fetchError.message);
        }
        setSales(tallySales(data ?? []));
      });
  }, [supabase]);

  const updateProduct = async (product, changes) => {
    const { error: updateError } = await supabase
      .from("products")
      .update(changes)
      .eq("id", product.id);

    setError(updateError?.message ?? null);
    reload();
  };

  const deleteProduct = async (product) => {
    setDeleting(true);

    const { error: deleteError } = await supabase
      .from("products")
      .delete()
      .eq("id", product.id);

    setDeleting(false);
    setConfirmingDelete(null);
    setError(deleteError?.message ?? null);
    reload();
  };

  if (editing) {
    return (
      <ProductForm
        product={editing === "new" ? null : editing}
        defaultType={type}
        onDone={() => {
          setEditing(null);
          reload();
        }}
        onCancel={() => setEditing(null)}
      />
    );
  }

  const products = allProducts.filter((product) => product.type === type);
  const drafts = products.filter((product) => product.status === "draft").length;
  const salesLoading = sales === null;
  const bestSeller = salesLoading ? null : topBy(products, sales, "revenue");
  const mostOrdered = salesLoading ? null : topBy(products, sales, "units");

  return (
    <section className="admin-section">
      <div className="admin-type-switch" role="tablist" aria-label="Product type">
        {PRODUCT_TYPES.map((item) => {
          const Icon = item.icon;
          const count = allProducts.filter((product) => product.type === item.type).length;

          return (
            <button
              key={item.type}
              type="button"
              role="tab"
              aria-selected={item.type === type}
              className={`admin-type-button ${item.type === type ? "is-selected" : ""}`}
              onClick={() => selectType(item)}
            >
              <Icon size={17} />
              {item.title}
              <span className="admin-type-count">{count}</span>
            </button>
          );
        })}
      </div>

      <div className="admin-section-head">
        <p>
          {products.length} {labels.plural} · {drafts}{" "}
          {drafts === 1 ? "draft" : "drafts"}
        </p>

        <button
          type="button"
          className="admin-button"
          onClick={() => setEditing("new")}
        >
          <Plus size={16} />
          Add {labels.singular}
        </button>
      </div>

      {error && <p className="admin-error">{error}</p>}

      <div key={type} className="admin-type-panel">
        <div className="admin-sales-highlights">
          <SalesHighlight
            icon={Award}
            label="Best seller"
            loading={salesLoading}
            product={bestSeller}
            detail={
              bestSeller &&
              `$${sales[bestSeller.id].revenue.toFixed(2)} in sales`
            }
          />
          <SalesHighlight
            icon={ShoppingCart}
            label="Most ordered"
            loading={salesLoading}
            product={mostOrdered}
            detail={mostOrdered && `${sales[mostOrdered.id].units} units sold`}
          />
        </div>

        {loading ? (
          <p className="admin-muted">Loading products…</p>
        ) : products.length === 0 ? (
          <p className="admin-muted">No {labels.plural} yet.</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Sold</th>
                  <th>Status</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className={product.status === "draft" ? "is-hidden" : ""}
                  >
                    <td>
                      <div className="admin-product-cell">
                        {product.images[0] && (
                          <img src={product.images[0]} alt="" />
                        )}
                        <span>{product.name}</span>
                        {product === bestSeller && (
                          <span className="admin-product-tag">Best seller</span>
                        )}
                        {product === mostOrdered && (
                          <span className="admin-product-tag">Most ordered</span>
                        )}
                      </div>
                    </td>
                    <td>{product.category}</td>
                    <td>${product.price.toFixed(2)}</td>
                    <td>
                      <StockInput
                        key={product.stock}
                        product={product}
                        onSave={(item, stock) => updateProduct(item, { stock })}
                      />
                    </td>
                    <td>{salesLoading ? "–" : sales[product.id]?.units ?? 0}</td>
                    <td>
                      <select
                        className={`admin-status is-${product.status}`}
                        value={product.status}
                        onChange={(event) =>
                          updateProduct(product, { status: event.target.value })
                        }
                        aria-label={`Status of ${product.name}`}
                      >
                        {PRODUCT_STATUSES.map((status) => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      {confirmingDelete === product.id ? (
                        <div className="admin-row-actions">
                          <span className="admin-muted">Delete?</span>
                          <button
                            type="button"
                            className="admin-delete-confirm"
                            onClick={() => deleteProduct(product)}
                            disabled={deleting}
                          >
                            {deleting ? "Deleting…" : "Yes"}
                          </button>
                          <button
                            type="button"
                            className="admin-link-button"
                            onClick={() => setConfirmingDelete(null)}
                            disabled={deleting}
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <div className="admin-row-actions">
                          <button
                            type="button"
                            className="admin-link-button"
                            onClick={() => setEditing(product)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="admin-icon-button"
                            onClick={() => setConfirmingDelete(product.id)}
                            aria-label={`Delete ${product.name}`}
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

export default AdminProducts;
