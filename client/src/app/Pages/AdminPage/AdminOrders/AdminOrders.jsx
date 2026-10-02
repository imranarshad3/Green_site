import React, { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ArrowLeft, ChevronRight, Download, Search } from "lucide-react";

import { useSupabase } from "../../../Context/SupabaseContext";
import {
  ORDER_SELECT,
  ORDER_STATUSES,
  getCustomerLabel,
  statusLabel,
  toOrder,
} from "../../../utils/orders";
import AdminOrderDetail from "../AdminOrderDetail/AdminOrderDetail";
import { downloadOrdersCsv } from "./ordersCsv";

import "./AdminOrders.css";

const FILTERS = ["all", ...ORDER_STATUSES, "returns"];

const filterLabel = (filter) =>
  filter === "all" ? "All" : filter === "returns" ? "Returns" : statusLabel(filter);

const matchesFilter = (order, filter) => {
  if (filter === "all") return true;
  if (filter === "returns") return order.returnRequest?.status === "requested";
  return order.statusType === filter;
};

const matchesSearch = (order, query) => {
  if (!query) return true;

  const haystack = [
    order.id,
    order.userId,
    order.shipping.name,
    order.shipping.email,
    order.shipping.phone,
    order.shipping.city,
    order.trackingNumber,
    ...order.items.map((item) => item.name),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return haystack.includes(query);
};

function AdminOrders() {
  const supabase = useSupabase();
  const [searchParams, setSearchParams] = useSearchParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(() => new Set());
  const [bulkStatus, setBulkStatus] = useState("shipped");
  const [bulkBusy, setBulkBusy] = useState(false);

  const selectedNumber = searchParams.get("order");

  const load = useCallback(
    () =>
      supabase
        .from("orders")
        .select(ORDER_SELECT)
        .order("created_at", { ascending: false })
        .then(({ data, error: fetchError }) => {
          if (fetchError) {
            setError(fetchError.message);
          } else {
            setOrders(data.map(toOrder));
          }

          setLoading(false);
        }),
    [supabase]
  );

  useEffect(() => {
    load();
  }, [load]);

  const openOrder = (orderNumber) => {
    setSearchParams(
      orderNumber ? { tab: "orders", order: orderNumber } : { tab: "orders" }
    );
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const run = async (request) => {
    setError(null);
    const { error: requestError } = await request;

    if (requestError) {
      setError(requestError.message);
    }

    await load();
    return !requestError;
  };

  const updateStatus = (order, status) => {
    setOrders((previous) =>
      previous.map((item) =>
        item.dbId === order.dbId
          ? { ...item, statusType: status, status: statusLabel(status) }
          : item
      )
    );

    return run(supabase.from("orders").update({ status }).eq("id", order.dbId));
  };

  const updateTracking = (order, { courier, trackingNumber }) =>
    run(
      supabase
        .from("orders")
        .update({ courier: courier || null, tracking_number: trackingNumber || null })
        .eq("id", order.dbId)
    );

  const resolveReturn = (order, status, adminNote) =>
    run(
      supabase
        .from("return_requests")
        .update({ status, admin_note: adminNote || null })
        .eq("id", order.returnRequest.id)
    );

  const applyBulk = async () => {
    setBulkBusy(true);
    const ids = [...selected];
    const ok = await run(supabase.from("orders").update({ status: bulkStatus }).in("id", ids));

    if (ok) {
      setSelected(new Set());
    }

    setBulkBusy(false);
  };

  if (loading) {
    return <p className="admin-muted">Loading orders…</p>;
  }

  if (selectedNumber) {
    const current = orders.find((order) => order.id === selectedNumber);

    if (!current) {
      return (
        <section className="admin-section">
          <button type="button" className="admin-order-back" onClick={() => openOrder(null)}>
            <ArrowLeft size={16} />
            All orders
          </button>
          <p className="admin-muted">Order #{selectedNumber} doesn't exist.</p>
        </section>
      );
    }

    return (
      <AdminOrderDetail
        key={current.dbId}
        order={current}
        customerOrders={orders.filter((order) => order.userId === current.userId)}
        error={error}
        onBack={() => openOrder(null)}
        onOpen={openOrder}
        onStatusChange={(status) => updateStatus(current, status)}
        onTrackingSave={(tracking) => updateTracking(current, tracking)}
        onReturnResolve={(status, note) => resolveReturn(current, status, note)}
      />
    );
  }

  const normalizedQuery = query.trim().toLowerCase();
  const searched = orders.filter((order) => matchesSearch(order, normalizedQuery));
  const visible = searched.filter((order) => matchesFilter(order, filter));
  const countFor = (item) => searched.filter((order) => matchesFilter(order, item)).length;
  const visibleSelected = visible.filter((order) => selected.has(order.dbId));
  const allVisibleSelected = visible.length > 0 && visibleSelected.length === visible.length;

  const toggleOne = (dbId) =>
    setSelected((previous) => {
      const next = new Set(previous);
      if (next.has(dbId)) next.delete(dbId);
      else next.add(dbId);
      return next;
    });

  const toggleAll = () =>
    setSelected((previous) => {
      const next = new Set(previous);
      visible.forEach((order) => {
        if (allVisibleSelected) next.delete(order.dbId);
        else next.add(order.dbId);
      });
      return next;
    });

  return (
    <section className="admin-section">
      <div className="admin-order-toolbar">
        <div className="admin-type-switch admin-order-filters" role="group" aria-label="Filter orders">
          {FILTERS.map((item) => (
            <button
              key={item}
              type="button"
              className={`admin-type-button ${filter === item ? "is-selected" : ""}`}
              aria-pressed={filter === item}
              onClick={() => setFilter(item)}
            >
              {filterLabel(item)}
              <span className="admin-type-count">{countFor(item)}</span>
            </button>
          ))}
        </div>

        <div className="admin-order-toolbar-side">
          <label className="admin-order-search">
            <Search size={16} />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Order, customer, phone or product"
              aria-label="Search orders"
            />
          </label>

          <button
            type="button"
            className="admin-button secondary"
            onClick={() => downloadOrdersCsv(visible)}
            disabled={visible.length === 0}
          >
            <Download size={15} />
            Export CSV
          </button>
        </div>
      </div>

      {selected.size > 0 && (
        <div className="admin-order-bulk" role="region" aria-label="Bulk actions">
          <strong>{selected.size} selected</strong>
          <label>
            Set status to
            <select
              className="admin-status"
              value={bulkStatus}
              onChange={(event) => setBulkStatus(event.target.value)}
            >
              {ORDER_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {statusLabel(status)}
                </option>
              ))}
            </select>
          </label>
          <button type="button" className="admin-button" onClick={applyBulk} disabled={bulkBusy}>
            {bulkBusy ? "Updating…" : "Apply"}
          </button>
          <button type="button" className="admin-link-button" onClick={() => setSelected(new Set())}>
            Clear
          </button>
        </div>
      )}

      {error && <p className="admin-error">{error}</p>}

      {orders.length === 0 ? (
        <p className="admin-muted">No orders yet.</p>
      ) : visible.length === 0 ? (
        <p className="admin-muted">No orders match these filters.</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th className="admin-order-check">
                  <input
                    type="checkbox"
                    checked={allVisibleSelected}
                    onChange={toggleAll}
                    aria-label="Select all shown orders"
                  />
                </th>
                <th>Order</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th aria-label="Details"></th>
              </tr>
            </thead>
            <tbody>
              {visible.map((order) => (
                <tr key={order.dbId} className={selected.has(order.dbId) ? "is-selected" : ""}>
                  <td className="admin-order-check">
                    <input
                      type="checkbox"
                      checked={selected.has(order.dbId)}
                      onChange={() => toggleOne(order.dbId)}
                      aria-label={`Select order ${order.id}`}
                    />
                  </td>
                  <td>
                    <button
                      type="button"
                      className="admin-order-number"
                      onClick={() => openOrder(order.id)}
                    >
                      #{order.id}
                    </button>
                    {order.returnRequest?.status === "requested" && (
                      <span className="admin-product-tag">Return</span>
                    )}
                  </td>
                  <td>{order.date}</td>
                  <td title={order.shipping.email ?? order.userId}>
                    {getCustomerLabel(order)}
                    {order.shipping.city && (
                      <span className="admin-order-sub">{order.shipping.city}</span>
                    )}
                  </td>
                  <td>
                    {order.items
                      .map((item) => `${item.quantity}× ${item.name}`)
                      .join(", ")}
                  </td>
                  <td>${order.total.toFixed(2)}</td>
                  <td>
                    <select
                      className={`admin-status ${order.statusType}`}
                      value={order.statusType}
                      onChange={(event) =>
                        updateStatus(order, event.target.value)
                      }
                      aria-label={`Status of order ${order.id}`}
                    >
                      {ORDER_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {statusLabel(status)}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="admin-icon-button"
                      onClick={() => openOrder(order.id)}
                      aria-label={`View order ${order.id}`}
                    >
                      <ChevronRight size={16} />
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

export default AdminOrders;
