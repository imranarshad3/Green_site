import React from "react";
import { Link } from "react-router-dom";
import "./CartFooter.css";

function CartFooter() {
  return (
    <footer className="cart-site-footer">
      <div className="cart-footer-container">

        <div className="cart-footer-brand">
          <Link to="/" className="cart-footer-logo">
            Plantify
          </Link>

          <span className="cart-footer-brand-subtitle">
            GARDEN
          </span>

          <p className="cart-footer-tagline">
            Thoughtfully grown plants for beautiful spaces.
          </p>
        </div>

        <nav className="cart-footer-nav" aria-label="cart-footer navigation">
          <Link to="/products">
            Shop Plants
          </Link>

          <Link to="/guide">
            Plant Care
          </Link>

          <Link to="/contact">
            Contact
          </Link>

          <Link to="/faq">
            FAQ
          </Link>
        </nav>

        <div className="cart-footer-copyright">
          © {new Date().getFullYear()} Plantify Garden
        </div>

      </div>
    </footer>
  );
}

export default CartFooter;

