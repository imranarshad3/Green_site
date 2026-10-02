import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  EyeOff,
  Mail,
  Minus,
  PackageCheck,
  RefreshCw,
} from "lucide-react";

import { useSupabase } from "../../../Context/SupabaseContext";
import { useProducts } from "../../../Context/ProductsContext";
import { ORDER_SELECT, toOrder } from "../../../utils/orders";
import RevenueChart from "../RevenueChart/RevenueChart";
import {
  RANGES,
  STATUS_LABELS,
  buildDashboard,
  formatCount,
  formatMoney,
} from "./dashboardStats";
import "./AdminDashboard.css";

function Delta({ value, label }) {
  if (value === undefined) return null;

  if (value === null) {
    return (
      <p className="dash-delta is-up">
        <ArrowUpRight size={14} aria-hidden="true" />
        <span>New</span>
        <span className="dash-delta-label">{label}</span>
      </p>
    );
  }

  const direction = value > 0.0005 ? "up" : value < -0.0005 ? "down" : "flat";
  const Icon = direction === "up" ? ArrowUpRight : direction === "down" ? ArrowDownRight : Minus;
  const text = `${value > 0 ? "+" : ""}${(value * 100).toFixed(1)}%`;

  return (
    <p className={`dash-delta is-${direction}`}>
      <Icon size={14} aria-hidden="true" />
      <span>{direction === "flat" ? "No change" : text}</span>
      <span className="dash-delta-label">{label}</span>
    </p>
  );
}

function StatTile({ label, value, delta, comparison }) {
  return (
    <div className="dash-tile">
      <p className="dash-tile-label">{label}</p>
      <p className="dash-tile-value">{value}</p>
      {comparison && <Delta value={delta} label={comparison} />}
    </div>
  );
}

function BarList({ rows, emptyText, ariaLabel }) {
  const max = Math.max(...rows.map((row) => row.value), 0);

  if (rows.length === 0 || max === 0) {
    return <p className="dash-empty">{emptyText}</p>;
  }

  return (
    <ul className="dash-bars" aria-label={ariaLabel}>
      {rows.map((row) => (
        <li key={row.key} className="dash-bar-row" title={`${row.label}: ${row.display}`}>
          <div className="dash-bar-head">
            <span className="dash-bar-label">
              {row.marker}
              {row.label}
            </span>
            {row.meta && <span className="dash-bar-meta">{row.meta}</span>}
          </div>
          <div className="dash-bar-track">
            <span
              className="dash-bar-fill"
              style={{
                width: row.value > 0 ? `${Math.max(2, (row.value / max) * 100)}%` : 0,
              }}
            />
            <span className="dash-bar-value">{row.display}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}

function StatusBadge({ status }) {
  return (
    <span className={`dash-status is-${status}`}>
      <span className="dash-status-dot" aria-hidden="true" />
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

function AdminDashboard({ onNavigate }) {
  const supabase = useSupabase();
  const { allProducts } = useProducts();
  const [range, setRange] = useState("30d");
  const [data, setData] = useState({ orders: [], messages: [] });
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);

  const load = useCallback(
    () =>
      Promise.all([
        supabase.from("orders").select(ORDER_SELECT).order("created_at", { ascending: false }),
        supabase.from("contact_messages").select("id, handled"),
      ]).then(([ordersResult, messagesResult]) => {
        const failure = ordersResult.error ?? messagesResult.error;
        if (failure) {
          setError(failure.message);
        } else {
          setError(null);
          setData({ orders: ordersResult.data.map(toOrder), messages: messagesResult.data });
        }
        setStatus("ready");
      }),
    [supabase]
  );

  useEffect(() => {
    load();
  }, [load]);

  const refresh = () => {
    setStatus("refreshing");
    load();
  };

  const dashboard = useMemo(() => buildDashboard(data.orders, range), [data.orders, range]);
  const unreadMessages = data.messages.filter((message) => !message.handled).length;
  const hiddenProducts = allProducts.filter((product) => product.status === "draft").length;
  const { totals, deltas, comparisonLabel } = dashboard;

  if (status === "loading") {
    return (
      <div className="dash" aria-busy="true">
        <div className="dash-skeleton dash-skeleton-row" />
        <div className="dash-skeleton dash-skeleton-block" />
      </div>
    );
  }

  const attention = [
    {
      key: "orders",
      icon: PackageCheck,
      count: dashboard.openOrders,
      title: dashboard.openOrders === 1 ? "order to ship" : "orders to ship",
      action: "Open orders",
      tab: "orders",
    },
    {
      key: "messages",
      icon: Mail,
      count: unreadMessages,
      title: unreadMessages === 1 ? "unread message" : "unread messages",
      action: "Open inbox",
      tab: "messages",
    },
    {
      key: "products",
      icon: EyeOff,
      count: hiddenProducts,
      title: hiddenProducts === 1 ? "draft product" : "draft products",
      action: "Manage products",
      tab: "products",
    },
  ];

  return (
    <div className={`dash ${status === "refreshing" ? "is-refreshing" : ""}`}>
      <div className="dash-filters">
        <div className="dash-range" role="radiogroup" aria-label="Date range">
          {RANGES.map((item) => (
            <button
              key={item.id}
              type="button"
              role="radio"
              aria-checked={range === item.id}
              className={`dash-range-option ${range === item.id ? "is-active" : ""}`}
              onClick={() => setRange(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          className="dash-refresh"
          onClick={refresh}
          disabled={status === "refreshing"}
        >
          <RefreshCw size={15} className={status === "refreshing" ? "dash-spin" : ""} />
          Refresh
        </button>
      </div>

      {error && <p className="admin-error">{error}</p>}

      <section className="dash-kpis" aria-label="Key figures">
        <div className="dash-hero">
          <p className="dash-tile-label">Revenue · {dashboard.range.label.toLowerCase()}</p>
          <p className="dash-hero-value">{formatMoney(totals.revenue)}</p>
          {comparisonLabel ? (
            <Delta value={deltas.revenue} label={comparisonLabel} />
          ) : (
            <p className="dash-delta-label">Since the first order</p>
          )}
          <p className="dash-hero-note">Cancelled orders are not counted.</p>
        </div>

        <StatTile
          label="Orders"
          value={formatCount(totals.orders)}
          delta={deltas?.orders}
          comparison={comparisonLabel}
        />
        <StatTile
          label="Average order"
          value={formatMoney(totals.averageOrder)}
          delta={deltas?.averageOrder}
          comparison={comparisonLabel}
        />
        <StatTile
          label="Customers"
          value={formatCount(totals.customers)}
          delta={deltas?.customers}
          comparison={comparisonLabel}
        />
        <StatTile
          label="Items sold"
          value={formatCount(totals.items)}
          delta={deltas?.items}
          comparison={comparisonLabel}
        />
      </section>

      <div className="dash-grid">
        <section className="dash-card dash-card-wide">
          <div className="dash-card-head">
            <div>
              <h2>Revenue over time</h2>
              <p>{dashboard.granularity} · cancelled orders excluded</p>
            </div>
          </div>

          <RevenueChart series={dashboard.series} />

          <details className="dash-table-toggle">
            <summary>View as table</summary>
            <div className="admin-table-wrap">
              <table className="admin-table dash-table">
                <thead>
                  <tr>
                    <th>Period</th>
                    <th>Orders</th>
                    <th>Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboard.series.map((point) => (
                    <tr key={point.start.toISOString()}>
                      <td>{point.title}</td>
                      <td>{formatCount(point.orders)}</td>
                      <td>{formatMoney(point.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        </section>

        <section className="dash-card dash-card-side">
          <div className="dash-card-head">
            <div>
              <h2>Needs attention</h2>
              <p>Right now, across all time</p>
            </div>
          </div>

          <ul className="dash-attention">
            {attention.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.key} className={item.count > 0 ? "has-items" : ""}>
                  <span className="dash-attention-icon">
                    <Icon size={18} />
                  </span>
                  <div className="dash-attention-text">
                    <strong>{formatCount(item.count)}</strong>
                    <span>{item.title}</span>
                  </div>
                  <button
                    type="button"
                    className="dash-link"
                    onClick={() => onNavigate?.(item.tab)}
                  >
                    {item.action}
                    <ArrowRight size={14} />
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="dash-card">
          <div className="dash-card-head">
            <div>
              <h2>Top products</h2>
              <p>By revenue · {dashboard.range.label.toLowerCase()}</p>
            </div>
          </div>

          <BarList
            ariaLabel="Top products by revenue"
            emptyText="No sales in this period yet."
            rows={dashboard.topProducts.map((product) => ({
              key: product.key,
              label: product.name,
              meta: `${formatCount(product.quantity)} sold`,
              value: product.revenue,
              display: formatMoney(product.revenue, 0),
            }))}
          />
        </section>

        <section className="dash-card">
          <div className="dash-card-head">
            <div>
              <h2>Order status</h2>
              <p>Orders placed · {dashboard.range.label.toLowerCase()}</p>
            </div>
          </div>

          <BarList
            ariaLabel="Orders by status"
            emptyText="No orders in this period yet."
            rows={dashboard.statuses.map((item) => ({
              key: item.status,
              label: item.label,
              marker: <span className={`dash-status-dot is-${item.status}`} aria-hidden="true" />,
              value: item.count,
              display: formatCount(item.count),
            }))}
          />
        </section>

        <section className="dash-card dash-card-full">
          <div className="dash-card-head">
            <div>
              <h2>Recent orders</h2>
              <p>The latest {dashboard.recent.length} orders</p>
            </div>
            <button type="button" className="dash-link" onClick={() => onNavigate?.("orders")}>
              All orders
              <ArrowRight size={14} />
            </button>
          </div>

          {dashboard.recent.length === 0 ? (
            <p className="dash-empty">No orders yet. They will appear here as soon as customers check out.</p>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table dash-table">
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Date</th>
                    <th>Items</th>
                    <th>Status</th>
                    <th className="dash-num">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboard.recent.map((order) => (
                    <tr key={order.dbId}>
                      <td className="dash-strong">#{order.id}</td>
                      <td className="admin-muted">{order.date}</td>
                      <td>
                        {order.items.reduce((sum, item) => sum + item.quantity, 0)}{" "}
                        {order.items.length === 1 ? `× ${order.items[0].name}` : "items"}
                      </td>
                      <td>
                        <StatusBadge status={order.statusType} />
                      </td>
                      <td className="dash-num dash-strong">{formatMoney(order.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default AdminDashboard;
