import React from "react";
import { Link } from "react-router-dom";
import "./CartHeading.css";

function CartHeading({ plantCount = 0 }) {
  return (
    <section className="cart-heading-section">
      <div className="cart-heading">

        <div className="cart-heading-content">
          <p className="cart-heading-eyebrow">
            YOUR PLANT COLLECTION
          </p>

          <h1>Shopping Cart</h1>

          <p className="cart-heading-description">
            {plantCount === 1
              ? "1 beautiful item is waiting for its new home."
              : `${plantCount} beautiful items are waiting for their new home.`}
          </p>
        </div>

        <Link
          to="/products"
          className="cart-continue-link"
        >
          <span>Continue shopping</span>
          <span className="cart-link-arrow">↗</span>
        </Link>

      </div>
    </section>
  );
}

export default CartHeading;
