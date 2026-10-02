import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, X } from "lucide-react";

import { useOrders } from "../../../Context/OrdersContext";
import { getCartTotals } from "../../../utils/cart";
import "./BuyNowDialog.css";

const money = (value) => `$${Number(value).toFixed(2)}`;

function BuyNowDialog({ open, onClose, product, quantity, size, potStyle }) {
  const dialogRef = useRef(null);
  const cancelRef = useRef(null);
  const navigate = useNavigate();
  const { buyNow } = useOrders();
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      cancelRef.current?.focus();
    }
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const isPlant = product.type !== "fertilizer";
  const totals = getCartTotals([{ price: product.price, quantity }]);

  const handleClose = () => {
    if (placing) return;
    setError(null);
    onClose();
  };

  const handleCancel = (event) => {
    event.preventDefault();
    handleClose();
  };

  const handleBackdropClick = (event) => {
    if (event.target === dialogRef.current) handleClose();
  };

  const handlePlaceOrder = async () => {
    setPlacing(true);
    setError(null);

    try {
      const order = await buyNow(product, { quantity, size, potStyle });
      dialogRef.current?.close();
      navigate("/orders", { state: { placedOrder: order?.order_number ?? null } });
    } catch (placeError) {
      setError(placeError.message || "We couldn't place your order. Please try again.");
      setPlacing(false);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className="bn-dialog"
      aria-labelledby="bn-title"
      onCancel={handleCancel}
      onClick={handleBackdropClick}
    >
      <div className="bn-panel">
        <div className="bn-head">
          <h2 id="bn-title">Confirm your order</h2>
          <button
            type="button"
            className="bn-close"
            onClick={handleClose}
            aria-label="Close"
            disabled={placing}
          >
            <X size={18} />
          </button>
        </div>

        <div className="bn-item">
          <img src={product.images?.[0]} alt="" />
          <div className="bn-item-info">
            <p className="bn-item-name">{product.name}</p>
            {isPlant && (
              <p className="bn-item-options">
                {size} · {potStyle} pot
              </p>
            )}
            <p className="bn-item-qty">
              {quantity} × {money(product.price)}
            </p>
          </div>
          <p className="bn-item-total">{money(totals.subtotal)}</p>
        </div>

        <dl className="bn-totals">
          <div>
            <dt>Subtotal</dt>
            <dd>{money(totals.subtotal)}</dd>
          </div>
          {totals.discount > 0 && (
            <div className="bn-discount">
              <dt>Discount</dt>
              <dd>−{money(totals.discount)}</dd>
            </div>
          )}
          <div>
            <dt>Delivery</dt>
            <dd>{totals.delivery > 0 ? money(totals.delivery) : "Free"}</dd>
          </div>
          <div className="bn-grand">
            <dt>Total</dt>
            <dd>{money(totals.total)}</dd>
          </div>
        </dl>

        {totals.remainingForFreeDelivery > 0 && (
          <p className="bn-note">
            Add {money(totals.remainingForFreeDelivery)} more to get free delivery.
          </p>
        )}

        <p className="bn-note">Only this item is ordered. Your cart stays as it is.</p>

        {error && (
          <p className="bn-error" role="alert">
            {error}
          </p>
        )}

        <div className="bn-actions">
          <button ref={cancelRef} type="button" className="bn-secondary" onClick={handleClose} disabled={placing}>
            Cancel
          </button>
          <button type="button" className="bn-primary" onClick={handlePlaceOrder} disabled={placing}>
            {placing ? (
              <>
                <Loader2 size={17} className="bn-spin" />
                Placing order…
              </>
            ) : (
              `Place order · ${money(totals.total)}`
            )}
          </button>
        </div>
      </div>
    </dialog>
  );
}

export default BuyNowDialog;
