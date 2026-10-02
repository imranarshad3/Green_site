import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Check, Copy, ExternalLink, Mail, MapPin, Phone } from "lucide-react";

import {
  ORDER_STATUSES,
  RETURN_STATUS_LABELS,
  formatOrderDateTime,
  statusLabel,
} from "../../../utils/orders";

import "./AdminOrderDetail.css";

const formatMoney = (value) => `$${value.toFixed(2)}`;

function TrackingForm({ order, onSave }) {
  const [courier, setCourier] = useState(order.courier ?? "");
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const dirty =
    courier !== (order.courier ?? "") || trackingNumber !== (order.trackingNumber ?? "");

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    const ok = await onSave({ courier: courier.trim(), trackingNumber: trackingNumber.trim() });
    setSaving(false);
    setSaved(ok);
  };

  return (
    <form className="admin-order-form" onSubmit={submit}>
      <label className="admin-label">
        Courier
        <input
          value={courier}
          onChange={(event) => {
            setCourier(event.target.value);
            setSaved(false);
          }}
          placeholder="e.g. TCS, Leopards"
          maxLength={80}
        />
      </label>
      <label className="admin-label">
        Tracking number
        <input
          value={trackingNumber}
          onChange={(event) => {
            setTrackingNumber(event.target.value);
            setSaved(false);
          }}
          maxLength={80}
        />
      </label>
      <div className="admin-order-form-actions">
        <button type="submit" className="admin-button" disabled={saving || !dirty}>
          {saving ? "Saving…" : "Save tracking"}
        </button>
        {saved && !dirty && <span className="admin-muted">Saved</span>}
      </div>
      {order.statusType === "processing" && (courier || trackingNumber) && (
        <p className="admin-muted admin-order-hint">
          Customers see tracking once the order is marked Shipped.
        </p>
      )}
    </form>
  );
}

function ReturnPanel({ request, onResolve }) {
  const [note, setNote] = useState(request.adminNote ?? "");
  const [busy, setBusy] = useState(false);

  const resolve = async (status) => {
    setBusy(true);
    await onResolve(status, note.trim());
    setBusy(false);
  };

  return (
    <section className={`admin-section admin-order-return is-${request.status}`}>
      <div className="admin-section-head">
        <h2>Return request</h2>
        <span className={`admin-order-return-badge is-${request.status}`}>
          {RETURN_STATUS_LABELS[request.status]}
        </span>
      </div>

      <p>
        <strong>{request.reason}</strong>
        <span className="admin-muted"> · {formatOrderDateTime(request.createdAt)}</span>
      </p>
      {request.details && <p className="admin-order-return-details">{request.details}</p>}

      <label className="admin-label">
        Note to customer
        <textarea
          rows={2}
          value={note}
          onChange={(event) => setNote(event.target.value)}
          maxLength={1000}
          placeholder="e.g. A courier will collect the plant on Monday."
        />
      </label>

      <div className="admin-order-form-actions">
        <button type="button" className="admin-button" onClick={() => resolve("approved")} disabled={busy}>
          Approve
        </button>
        <button type="button" className="admin-button secondary" onClick={() => resolve("rejected")} disabled={busy}>
          Decline
        </button>
        {request.status !== "requested" && (
          <button type="button" className="admin-link-button" onClick={() => resolve("requested")} disabled={busy}>
            Reopen
          </button>
        )}
      </div>
      {request.resolvedAt && (
        <p className="admin-muted admin-order-hint">
          Resolved {formatOrderDateTime(request.resolvedAt)}
        </p>
      )}
    </section>
  );
}

function AdminOrderDetail({
  order,
  customerOrders,
  error,
  onBack,
  onOpen,
  onStatusChange,
  onTrackingSave,
  onReturnResolve,
}) {
  const [copied, setCopied] = useState(false);
  const { shipping } = order;

  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const customerSpend = customerOrders
    .filter((item) => item.statusType !== "cancelled")
    .reduce((sum, item) => sum + item.total, 0);

  const timeline = [
    { label: "Placed", at: order.createdAt },
    { label: "Shipped", at: order.shippedAt },
    { label: "Delivered", at: order.deliveredAt },
    order.statusType === "cancelled" && {
      label: "Cancelled",
      at: order.cancelledAt,
      note: order.cancelReason,
      tone: "is-cancelled",
    },
  ].filter(Boolean);

  const copyCustomerId = () => {
    navigator.clipboard?.writeText(order.userId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div className="admin-order-detail">
      <button type="button" className="admin-order-back" onClick={onBack}>
        <ArrowLeft size={16} />
        All orders
      </button>

      {error && <p className="admin-error">{error}</p>}

      <section className="admin-section admin-order-head">
        <div>
          <p className="admin-muted">Order</p>
          <h2>#{order.id}</h2>
          <p className="admin-muted">
            Placed {formatOrderDateTime(order.createdAt)} · {itemCount}{" "}
            {itemCount === 1 ? "item" : "items"} · {formatMoney(order.total)}
          </p>
        </div>

        <div className="admin-order-head-actions">
          <label className="admin-label">
            Status
            <select
              className={`admin-status ${order.statusType}`}
              value={order.statusType}
              onChange={(event) => onStatusChange(event.target.value)}
            >
              {ORDER_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {statusLabel(status)}
                </option>
              ))}
            </select>
          </label>

          <Link to={`/orders/${order.id}`} className="admin-button secondary">
            <ExternalLink size={15} />
            Customer view
          </Link>
        </div>
      </section>

      <div className="admin-order-grid">
        <section className="admin-section">
          <div className="admin-section-head">
            <h2>Items</h2>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Options</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="admin-product-cell">
                        {item.image && <img src={item.image} alt="" />}
                        <span>
                          {item.name}
                          {!item.productId && (
                            <span className="admin-product-tag">Deleted</span>
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="admin-muted">
                      {[item.size, item.potStyle && `${item.potStyle} pot`]
                        .filter(Boolean)
                        .join(" · ") || "—"}
                    </td>
                    <td>{item.quantity}</td>
                    <td>{formatMoney(item.price)}</td>
                    <td>{formatMoney(item.price * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <dl className="admin-order-totals">
            <div>
              <dt>Subtotal</dt>
              <dd>{formatMoney(order.subtotal)}</dd>
            </div>
            <div>
              <dt>Discount</dt>
              <dd>
                {order.discount - order.promoDiscount > 0
                  ? `−${formatMoney(order.discount - order.promoDiscount)}`
                  : "—"}
              </dd>
            </div>
            {order.promoCode && (
              <div>
                <dt>Promo {order.promoCode}</dt>
                <dd>−{formatMoney(order.promoDiscount)}</dd>
              </div>
            )}
            <div>
              <dt>Delivery</dt>
              <dd>{order.delivery > 0 ? formatMoney(order.delivery) : "Free"}</dd>
            </div>
            <div className="is-total">
              <dt>Total</dt>
              <dd>{formatMoney(order.total)}</dd>
            </div>
          </dl>
        </section>

        <div className="admin-order-side">
          {order.returnRequest && (
            <ReturnPanel
              key={`${order.returnRequest.id}-${order.returnRequest.status}`}
              request={order.returnRequest}
              onResolve={onReturnResolve}
            />
          )}

          <section className="admin-section">
            <div className="admin-section-head">
              <h2>Delivery</h2>
            </div>

            {shipping.address ? (
              <ul className="admin-order-contact">
                <li>
                  <MapPin size={15} />
                  <span>
                    <strong>{shipping.name}</strong>
                    <br />
                    {shipping.address}
                    <br />
                    {[shipping.city, shipping.postalCode].filter(Boolean).join(" ")}
                  </span>
                </li>
                <li>
                  <Phone size={15} />
                  <a href={`tel:${shipping.phone}`}>{shipping.phone}</a>
                </li>
                <li>
                  <Mail size={15} />
                  <a href={`mailto:${shipping.email}?subject=${encodeURIComponent(`Your Plantify order ${order.id}`)}`}>
                    {shipping.email}
                  </a>
                </li>
              </ul>
            ) : (
              <p className="admin-muted">
                This order was placed before delivery details were collected.
              </p>
            )}

            {order.statusType !== "cancelled" && (
              <TrackingForm
                order={order}
                onSave={onTrackingSave}
              />
            )}
          </section>

          <section className="admin-section">
            <div className="admin-section-head">
              <h2>Timeline</h2>
            </div>

            <ol className="admin-order-timeline">
              {timeline.map((step) => (
                <li
                  key={step.label}
                  className={`${step.at ? "is-done" : ""} ${step.tone ?? ""}`}
                >
                  <strong>{step.label}</strong>
                  <span className="admin-muted">
                    {step.at ? formatOrderDateTime(step.at) : "Not yet"}
                  </span>
                  {step.note && <span>Reason: {step.note}</span>}
                </li>
              ))}
            </ol>
          </section>

          <section className="admin-section">
            <div className="admin-section-head">
              <h2>Customer</h2>
            </div>

            <div className="admin-order-customer">
              <code title={order.userId}>{order.userId}</code>
              <button
                type="button"
                className="admin-icon-button"
                onClick={copyCustomerId}
                aria-label="Copy customer ID"
              >
                {copied ? <Check size={15} /> : <Copy size={15} />}
              </button>
            </div>

            <p className="admin-muted admin-order-customer-stats">
              {customerOrders.length} {customerOrders.length === 1 ? "order" : "orders"} ·{" "}
              {formatMoney(customerSpend)} spent
            </p>

            {customerOrders.length > 1 && (
              <ul className="admin-order-history">
                {customerOrders
                  .filter((item) => item.id !== order.id)
                  .slice(0, 5)
                  .map((item) => (
                    <li key={item.dbId}>
                      <button
                        type="button"
                        className="admin-order-number"
                        onClick={() => onOpen(item.id)}
                      >
                        #{item.id}
                      </button>
                      <span className="admin-muted">{item.date}</span>
                      <span>{statusLabel(item.statusType)}</span>
                    </li>
                  ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default AdminOrderDetail;
