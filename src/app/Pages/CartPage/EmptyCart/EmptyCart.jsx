import React from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, ArrowRight } from "lucide-react";
import "./EmptyCart.css";

function EmptyCart() {
  return (
    <section className="empty-cart">
      <div className="empty-cart-content">

        <div className="empty-cart-icon">
          <ShoppingBag size={34} strokeWidth={1.2} />
        </div>

        <p className="empty-cart-eyebrow">
          YOUR PLANT COLLECTION
        </p>

        <h1>
          Your cart is
          <br />
          waiting to grow.
        </h1>

        <p className="empty-cart-description">
          Your cart is currently empty. Discover something
          beautiful and bring a little more green into your space.
        </p>

        <Link
          to="/products"
          className="empty-cart-button"
        >
          <span>Explore Plants</span>
          <ArrowRight size={16} strokeWidth={1.5} />
        </Link>

      </div>
    </section>
  );
}

export default EmptyCart;
