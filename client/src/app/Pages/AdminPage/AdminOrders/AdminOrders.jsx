import React, { useCallback, useEffect, useState } from "react";

import { useSupabase } from "../../../Context/SupabaseContext";
import { ORDER_SELECT, toOrder } from "../../../utils/orders";

const STATUSES = ["processing", "shipped", "delivered", "cancelled"];

function AdminOrders() {
  const supabase = useSupabase();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const updateStatus = async (order, status) => {
    setOrders((previous) =>
      previous.map((item) =>
        item.dbId === order.dbId ? { ...item, statusType: status } : item
      )
    );

    const { error: updateError } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", order.dbId);

    if (updateError) {
      setError(updateError.message);
      load();
    }
  };

  if (loading) {
    return <p className="admin-muted">Loading orders…</p>;
  }

  return (
    <section className="admin-section">
      <div className="admin-section-head">
        <p>{orders.length} orders</p>
      </div>

      {error && <p className="admin-error">{error}</p>}

      {orders.length === 0 ? (
        <p className="admin-muted">No orders yet.</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.dbId}>
                  <td>#{order.id}</td>
                  <td>{order.date}</td>
                  <td className="admin-muted" title={order.userId}>
                    {order.userId.slice(0, 14)}…
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
                      {STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status[0].toUpperCase() + status.slice(1)}
                        </option>
                      ))}
                    </select>
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
