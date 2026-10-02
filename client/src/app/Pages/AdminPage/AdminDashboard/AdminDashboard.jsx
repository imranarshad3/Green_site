import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BellRing,
  EyeOff,
  Mail,
  Minus,
  PackageCheck,
  PackageX,
  RefreshCw,
  RotateCcw,
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

const LOW_STOCK = 5;

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
  const [data, setData] = useState({ orders: [], messages: [], alerts: [] });
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);

  const load = useCallback(
    () =>
      Promise.all([
        supabase.from("orders").select(ORDER_SELECT).order("created_at", { ascending: false }),
        supabase.from("contact_messages").select("id, handled"),
        supabase.from("stock_alerts").select("product_id, email, created_at"),
      ]).then(([ordersResult, messagesResult, alertsResult]) => {
        const failure = ordersResult.error ?? messagesResult.error ?? alertsResult.error;
        if (failure) {
          setError(failure.message);
        } else {
          setError(null);
          setData({
            orders: ordersResult.data.map(toOrder),
            messages: messagesResult.data,
            alerts: alertsResult.data,
          });
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
  const lowStock = allProducts
    .filter((product) => product.status === "active" && product.stock <= LOW_STOCK)
    .sort((a, b) => a.stock - b.stock);
  const pendingReturns = data.orders.filter(
    (order) => order.returnRequest?.status === "requested"
  ).length;
  const restockRequests = Object.values(
    data.alerts.reduce((groups, alert) => {
      const group = groups[alert.product_id] ?? {
        product: allProducts.find((product) => product.id === alert.product_id),
        emails: [],
      };
      group.emails.push(alert.email);
      groups[alert.product_id] = group;
      return groups;
    }, {})
  )
    .filter((group) => group.product)
    .sort((a, b) => b.emails.length - a.emails.length);
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
      key: "returns",
      icon: RotateCcw,
      count: pendingReturns,
      title: pendingReturns === 1 ? "return to review" : "returns to review",
      action: "Open orders",
      tab: "orders",
    },
    {
      key: "stock",
      icon: PackageX,
      count: lowStock.length,
      title: lowStock.length === 1 ? "product low on stock" : "products low on stock",
      action: "Restock",
      tab: "products",
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

        <section className="dash-card">
          <div className="dash-card-head">
            <div>
              <h2>Low stock</h2>
              <p>Live products with {LOW_STOCK} or fewer left</p>
            </div>
            <button type="button" className="dash-link" onClick={() => onNavigate?.("products")}>
              Products
              <ArrowRight size={14} />
            </button>
          </div>

          {lowStock.length === 0 ? (
            <p className="dash-empty">Everything is well stocked.</p>
          ) : (
            <ul className="dash-stock-list">
              {lowStock.slice(0, 8).map((product) => (
                <li key={product.id}>
                  {product.images[0] && <img src={product.images[0]} alt="" />}
                  <span className="dash-stock-name">{product.name}</span>
                  <span className={`dash-stock-count ${product.stock === 0 ? "is-out" : ""}`}>
                    {product.stock === 0 ? "Sold out" : `${product.stock} left`}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="dash-card">
          <div className="dash-card-head">
            <div>
              <h2>Restock requests</h2>
              <p>Customers waiting on “Notify me”</p>
            </div>
            <BellRing size={18} className="dash-card-icon" />
          </div>

          {restockRequests.length === 0 ? (
            <p className="dash-empty">Nobody is waiting on a product right now.</p>
          ) : (
            <ul className="dash-stock-list">
              {restockRequests.slice(0, 8).map(({ product, emails }) => (
                <li key={product.id}>
                  {product.images[0] && <img src={product.images[0]} alt="" />}
                  <span className="dash-stock-name">
                    {product.name}
                    <small>{product.stock > 0 && product.status === "active" ? "Back in stock" : "Unavailable"}</small>
                  </span>
                  <a
                    className="dash-link"
                    href={`mailto:?bcc=${encodeURIComponent(emails.filter(Boolean).join(","))}&subject=${encodeURIComponent(`${product.name} is back at Plantify`)}`}
                    title={emails.filter(Boolean).join(", ")}
                  >
                    {emails.length} waiting
                  </a>
                </li>
              ))}
            </ul>
          )}
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
                      <td className="dash-strong">
                        <Link to={`/admin?tab=orders&order=${order.id}`} className="dash-order-link">
                          #{order.id}
                        </Link>
                      </td>
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
