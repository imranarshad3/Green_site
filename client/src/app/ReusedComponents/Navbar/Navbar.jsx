import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ChevronDown, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";

import UserMenu from "../UserMenu/UserMenu";
import { useCart } from "../../Context/CartContext";
import icon from "./Images/icon.webp";
import "./Navbar.css";

const PRODUCT_LINKS = [
  { to: "/products", label: "All plants" },
  { to: "/search?q=Flowering", label: "Flowering" },
  { to: "/search?q=Foliage", label: "Foliage" },
  { to: "/search?q=Succulents", label: "Succulents & cacti" },
  { to: "/search?q=Hanging", label: "Hanging plants" },
  { to: "/fertilizers", label: "Fertilizers" },
];

const navClass = ({ isActive }) => `site-nav-link ${isActive ? "is-active" : ""}`;

// variant "dark" sits on the green page tops; "light" on cream ones (account).
function Navbar({ variant = "dark" }) {
  const { cartCount } = useCart();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const productsRef = useRef(null);

  const productsActive =
    pathname.startsWith("/product") || pathname === "/search";

  const close = () => {
    setMenuOpen(false);
    setProductsOpen(false);
  };

  // Escape closes menus; a click outside closes the products dropdown.
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setProductsOpen(false);
      }
    };
    const onPointerDown = (event) => {
      if (!productsRef.current?.contains(event.target)) {
        setProductsOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

  // Keep the page from scrolling behind the open mobile menu.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header className={`site-nav site-nav--${variant} ${menuOpen ? "is-open" : ""}`}>
      <div className="site-nav-inner">
        <button
          type="button"
          className="site-nav-icon site-nav-burger"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="site-nav-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <nav id="site-nav-menu" className="site-nav-links" aria-label="Main">
          <NavLink to="/" end className={navClass} onClick={close}>
            Shop
          </NavLink>

          <div className={`site-nav-dropdown ${productsOpen ? "is-open" : ""}`} ref={productsRef}>
            <button
              type="button"
              className={`site-nav-link ${productsActive ? "is-active" : ""}`}
              onClick={() => setProductsOpen((open) => !open)}
              aria-expanded={productsOpen}
              aria-haspopup="true"
            >
              Products
              <ChevronDown size={15} className="site-nav-chevron" />
            </button>

            <div className="site-nav-panel">
              {PRODUCT_LINKS.map((link) => (
                <Link key={link.label} to={link.to} onClick={close}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <NavLink to="/fertilizers" className={navClass} onClick={close}>
            Fertilizer
          </NavLink>
          <NavLink to="/guide" className={navClass} onClick={close}>
            Guide
          </NavLink>

          {/* Extra links only shown in the mobile menu. */}
          <NavLink to="/faq" className={(state) => `${navClass(state)} site-nav-mobile-only`} onClick={close}>
            FAQ
          </NavLink>
          <NavLink to="/contact" className={(state) => `${navClass(state)} site-nav-mobile-only`} onClick={close}>
            Contact
          </NavLink>
        </nav>

        <Link to="/" className="site-nav-logo" onClick={close} aria-label="Plantify Garden home">
          <img src={icon} alt="" />
        </Link>

        <div className="site-nav-actions">
          <Link to="/search" className="site-nav-icon" aria-label="Search" onClick={close}>
            <Search size={20} strokeWidth={1.6} />
          </Link>

          <SignedOut>
            <SignInButton mode="modal">
              <button type="button" className="site-nav-icon" aria-label="Sign in">
                <User size={20} strokeWidth={1.6} />
              </button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserMenu />
          </SignedIn>

          <Link
            to="/cart"
            className="site-nav-icon site-nav-cart"
            aria-label={`Cart, ${cartCount} items`}
            onClick={close}
          >
            <ShoppingBag size={20} strokeWidth={1.6} />
            {cartCount > 0 && (
              // Keyed so the bump animation replays when the count changes.
              <span key={cartCount} className="site-nav-count">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
