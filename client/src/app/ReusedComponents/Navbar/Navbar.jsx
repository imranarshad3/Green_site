import React from "react";
import { Search, ShoppingBag, User, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import UserMenu from "../UserMenu/UserMenu";
import {
  SignedIn,
  SignedOut,
  SignInButton,
} from "@clerk/clerk-react";
import icon from "./Images/icon.png";
import { useCart } from "../../Context/CartContext";
import "./Navbar.css";

function Navbar() {
  const { cartCount } = useCart();

  return (
    <div className="navbar-section">
      <nav className="navbar">
        <div className="nav-links">
          <Link to="/" className="link">
            Shop
          </Link>

          <Link to="/products" className="link products-link">
            Products
            <ChevronDown size={14} />
          </Link>

          <Link to="/fertilizers" className="link">
            Fertilizer
          </Link>

          <Link to="/guide" className="link">
            Guide
          </Link>
        </div>

        <div className="frame">
          <Link to="/">
            <img src={icon} alt="Plantify Garden" />
          </Link>
        </div>

        <div className="actions">
          <Link to="/search" className="icon-action">
            <Search size={21} strokeWidth={1.5} />
          </Link>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="nav-icon">
                <User size={20} />
              </button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserMenu />
          </SignedIn>
          <Link
            to="/cart"
            className="icon-action cart-action"
            aria-label={`Cart, ${cartCount} items`}
          >
            <ShoppingBag size={21} strokeWidth={1.5} />
            {cartCount > 0 && (
              // Keyed so the bump animation replays when the count changes.
              <span key={cartCount} className="cart-count">{cartCount}</span>
            )}
          </Link>
        </div>
        
      </nav>
    </div>
  );
}

export default Navbar;
