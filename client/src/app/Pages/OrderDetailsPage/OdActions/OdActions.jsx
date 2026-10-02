import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Printer, RotateCcw, XCircle } from "lucide-react";

import { useCart } from "../../../Context/CartContext";
import { useOrders } from "../../../Context/OrdersContext";
import { useProducts } from "../../../Context/ProductsContext";
import { DEFAULT_POT_STYLE, DEFAULT_SIZE, buildCartItem } from "../../../utils/cart";
import { CANCEL_REASONS, isCancellable } from "../../../utils/orders";
import { isPurchasable } from "../../../utils/products";

import "./OdActions.css";

function OdActions({ order, onUpdated }) {
  const { addToCart } = useCart();
  const { cancelOrder } = useOrders();
  const { findProductById } = useProducts();

  const [notice, setNotice] = useState(null);
  const [confirming, setConfirming] = useState(false);
  const [reason, setReason] = useState(CANCEL_REASONS[0]);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState(null);

  const buyAgain = () => {
    let added = 0;
    const skipped = [];

    order.items.forEach((item) => {
      const product = item.productId ? findProductById(item.productId) : null;

      if (!isPurchasable(product)) {
        skipped.push(item.name);
        return;
      }

      addToCart(
        buildCartItem(product, {
          size: item.size ?? DEFAULT_SIZE,
          potStyle: item.potStyle ?? DEFAULT_POT_STYLE,
          quantity: Math.min(item.quantity, product.stock),
        })
      );
      added += 1;
    });

    setNotice({ added, skipped });
  };

  const confirmCancel = async () => {
    setCancelling(true);
    setError(null);

    try {
      const updated = await cancelOrder(order.id, reason);
      setConfirming(false);
      onUpdated(updated);
    } catch (cancelError) {
      setError(cancelError.message);
    } finally {
      setCancelling(false);
    }
  };

  return (
    <section className="od-actions">
      <div className="od-actions-row">
        <button type="button" className="od-action od-action-primary" onClick={buyAgain}>
          <RotateCcw size={16} />
          Buy again
        </button>

        <button type="button" className="od-action" onClick={() => window.print()}>
          <Printer size={16} />
          Print receipt
        </button>

        {isCancellable(order) && !confirming && (
          <button
            type="button"
            className="od-action od-action-danger"
            onClick={() => setConfirming(true)}
          >
            <XCircle size={16} />
            Cancel order
          </button>
        )}
      </div>

      {notice && (
        <p className="od-actions-notice" role="status">
          {notice.added > 0 ? (
            <>
              Added {notice.added} {notice.added === 1 ? "item" : "items"} to your cart.{" "}
              <Link to="/cart">Go to cart</Link>
            </>
          ) : (
            "None of these items can be bought right now."
          )}
          {notice.skipped.length > 0 && notice.added > 0 && (
            <span> Not available any more: {notice.skipped.join(", ")}.</span>
          )}
        </p>
      )}

      {confirming && (
        <div className="od-cancel">
          <h2>Cancel this order?</h2>
          <p>
            Your order hasn't shipped yet, so it can still be cancelled. This
            can't be undone.
          </p>

          <label>
            Reason
            <select value={reason} onChange={(event) => setReason(event.target.value)}>
              {CANCEL_REASONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          {error && <p className="od-cancel-error" role="alert">{error}</p>}

          <div className="od-actions-row">
            <button
              type="button"
              className="od-action od-action-danger-solid"
              onClick={confirmCancel}
              disabled={cancelling}
            >
              {cancelling ? "Cancelling…" : "Yes, cancel order"}
            </button>
            <button
              type="button"
              className="od-action"
              onClick={() => {
                setConfirming(false);
                setError(null);
              }}
              disabled={cancelling}
            >
              Keep order
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default OdActions;
