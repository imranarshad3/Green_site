import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./CartLayout.css";
import { describePromo, getCartTotals } from "../../../utils/cart";

function CartLayout({
  cartItems = [],
  onIncrease,
  onDecrease,
  onRemove,
  onCheckout,
  promo = null,
  onApplyPromo,
  onRemovePromo,
}) {
  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState(null);
  const [applying, setApplying] = useState(false);

  const {
    subtotal,
    discount,
    promoDiscount,
    delivery,
    total,
    remainingForFreeDelivery,
  } = getCartTotals(cartItems, promo);

  const applyPromo = async (event) => {
    event.preventDefault();
    if (!promoInput.trim()) return;

    setApplying(true);
    setPromoError(null);

    try {
      await onApplyPromo?.(promoInput.trim(), subtotal);
      setPromoInput("");
    } catch (error) {
      setPromoError(error.message);
    } finally {
      setApplying(false);
    }
  };

  return (
    <section className="cart-layout-section">
      <div className="cart-layout">

        <div className="cart-items">

          {cartItems.map((item) => (
            <article className="cart-item" key={item.cartItemId}>

              <div className="cart-item-image">
                <img
                  src={item.images?.[0] || item.image}
                  alt={item.name}
                />
              </div>

              <div className="cart-item-info">

                <p className="cart-item-category">
                  {item.category}
                </p>

                <h3>{item.name}</h3>

                <p className="cart-item-variant">
                  {[
                    item.selectedSize,
                    item.selectedPotStyle && `${item.selectedPotStyle} pot`,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </p>

                <div className="cart-item-actions">

                  <div className="quantity-control">
                    <button
                      type="button"
                      onClick={() =>
                        onDecrease?.(item.cartItemId)
                      }
                      aria-label={`Decrease ${item.name} quantity`}
                    >
                      −
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      type="button"
                      onClick={() =>
                        onIncrease?.(item.cartItemId)
                      }
                      aria-label={`Increase ${item.name} quantity`}
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    className="remove-item"
                    onClick={() =>
                      onRemove?.(item.cartItemId)
                    }
                  >
                    Remove
                  </button>

                </div>
              </div>

              <div className="cart-item-price">
                <strong>
                  ${Number(item.price) * Number(item.quantity)}
                </strong>

                {item.oldPrice && (
                  <span>
                    ${Number(item.oldPrice) * Number(item.quantity)}
                  </span>
                )}
              </div>

            </article>
          ))}

          <div className="delivery-message">

            <span className="delivery-message-icon">
              ✦
            </span>

            <div>
              <strong>
                {remainingForFreeDelivery > 0
                  ? "Almost there"
                  : "Free delivery unlocked"}
              </strong>

              <p>
                {remainingForFreeDelivery > 0
                  ? `Add $${remainingForFreeDelivery.toFixed(2)} more to unlock free delivery. Plants are carefully packed and shipped within 1–2 business days.`
                  : "Your plants qualify for free delivery. Plants are carefully packed and shipped within 1–2 business days."}
              </p>
            </div>

          </div>

        </div>

        <aside className="cart-sidebar">

          <div className="summary-card">

            <p className="summary-eyebrow">
              ORDER SUMMARY
            </p>

            <h2>Ready to grow?</h2>

            <div className="summary-details">

              <div className="summary-row">
                <span>Subtotal</span>
                <strong>${subtotal.toFixed(2)}</strong>
              </div>

              <div className="summary-row">
                <span>Delivery</span>
                <strong>
                  {delivery === 0 ? "Free" : `$${delivery}`}
                </strong>
              </div>

              <div className="summary-row">
                <span>Discount</span>
                <strong>
                  {discount > 0 ? `−$${discount.toFixed(2)}` : "$0"}
                </strong>
              </div>

            </div>

            <div className="summary-total">
              <span>Total</span>
              <strong>${total.toFixed(2)}</strong>
            </div>

            {promo ? (
              <p className={`cart-promo-applied ${promoDiscount === 0 ? "is-inactive" : ""}`}>
                <span>
                  <strong>{promo.code}</strong> · {describePromo(promo)}
                  {promoDiscount === 0 &&
                    ` · spend $${promo.minSubtotal.toFixed(2)} to use it`}
                </span>
                <button type="button" onClick={onRemovePromo}>
                  Remove
                </button>
              </p>
            ) : (
              <form className="discount-form" onSubmit={applyPromo}>

                <input
                  type="text"
                  placeholder="Discount code"
                  value={promoInput}
                  onChange={(event) => setPromoInput(event.target.value.toUpperCase())}
                  aria-label="Discount code"
                />

                <button type="submit" disabled={applying || !promoInput.trim()}>
                  {applying ? "…" : "Apply"}
                </button>

              </form>
            )}

            {promoError && (
              <p className="checkout-error" role="alert">
                {promoError}
              </p>
            )}

            <button
              type="button"
              className="checkout-button"
              onClick={onCheckout}
            >
              <span>Proceed to Checkout</span>
              <span>→</span>
            </button>

            <p className="secure-checkout">
              ✓ Secure checkout · Free returns within 14 days
            </p>

          </div>

          <div className="cart-help">

            <p className="help-eyebrow">
              NEED HELP?
            </p>

            <h3>
              We're here for you.
            </h3>

            <Link to="/contact">
              Contact Plantify →
            </Link>

          </div>

        </aside>

      </div>
    </section>
  );
}

export default CartLayout;
