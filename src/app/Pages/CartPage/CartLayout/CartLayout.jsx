
import React from "react";
import { Link } from "react-router-dom";
import "./CartLayout.css";

function CartLayout({
  cartItems = [],
  onIncrease,
  onDecrease,
  onRemove,
}) {
  const subtotal = cartItems.reduce(
    (total, item) =>
      total + Number(item.price) * Number(item.quantity),
    0
  );

  const discount = subtotal >= 60 ? 9 : 0;
  const delivery = subtotal >= 100 ? 0 : 0;
  const total = subtotal - discount + delivery;

  const remainingForFreeDelivery = Math.max(0, 100 - subtotal);

  return (
    <section className="cart-layout-section">
      <div className="cart-layout">

        <div className="cart-items">

          {cartItems.map((item) => (
            <article className="cart-item" key={item.id}>

              <div className="cart-item-image">
                <img
                  src={item.image}
                  alt={item.name}
                />
              </div>

              <div className="cart-item-info">

                <p className="cart-item-category">
                  {item.category}
                </p>

                <h3>{item.name}</h3>

                <p className="cart-item-variant">
                  {item.variant}
                </p>

                <div className="cart-item-actions">

                  <div className="quantity-control">
                    <button
                      type="button"
                      onClick={() =>
                        onDecrease?.(item.id)
                      }
                      aria-label={`Decrease ${item.name} quantity`}
                    >
                      −
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      type="button"
                      onClick={() =>
                        onIncrease?.(item.id)
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
                      onRemove?.(item.id)
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

                {item.originalPrice && (
                  <span>
                    ${item.originalPrice}
                  </span>
                )}
              </div>

            </article>
          ))}

          {/* FREE DELIVERY MESSAGE */}
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
                  ? `Add $${remainingForFreeDelivery} more to unlock free delivery. Plants are carefully packed and shipped within 1–2 business days.`
                  : "Your plants qualify for free delivery. Plants are carefully packed and shipped within 1–2 business days."}
              </p>
            </div>

          </div>

        </div>

        {/* RIGHT SIDE */}
        <aside className="cart-sidebar">

          <div className="summary-card">

            <p className="summary-eyebrow">
              ORDER SUMMARY
            </p>

            <h2>Ready to grow?</h2>

            <div className="summary-details">

              <div className="summary-row">
                <span>Subtotal</span>
                <strong>${subtotal}</strong>
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
                  {discount > 0 ? `−$${discount}` : "$0"}
                </strong>
              </div>

            </div>

            <div className="summary-total">
              <span>Total</span>
              <strong>${total}</strong>
            </div>

            <div className="discount-form">

              <input
                type="text"
                placeholder="Discount code"
              />

              <button type="button">
                Apply
              </button>

            </div>

            <button
              type="button"
              className="checkout-button"
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
