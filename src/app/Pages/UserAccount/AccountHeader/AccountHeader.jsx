import {
  ChevronDownIcon,
  MenuIcon,
  SearchIcon,
  ShoppingBagIcon,
  UserRoundIcon,
  XIcon
} from "lucide-react";
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./AccountHeader.css";

function AccountHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);

  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const closeMenu = () => {
    setMenuOpen(false);
    setProductsOpen(false);
  };

  return (
    <header className="account-header">

      <div className="account-header-container">

        <Link
          to="/"
          className="account-header-logo"
          onClick={closeMenu}
        >
          plantify<span>.</span>
        </Link>

        <nav
          className={`account-header-nav ${
            menuOpen ? "is-open" : ""
          }`}
        >

          <Link
            to="/"
            className={isActive("/") ? "active" : ""}
            onClick={closeMenu}
          >
            Home
          </Link>

          <Link
            to="/products"
            className={isActive("/products") ? "active" : ""}
            onClick={closeMenu}
          >
            Shop
          </Link>

          <div className="account-header-dropdown">

            <button
              type="button"
              className={
                location.pathname.includes("/products")
                  ? "active"
                  : ""
              }
              onClick={() =>
                setProductsOpen(!productsOpen)
              }
            >
              Products
              <ChevronDownIcon
                size={13}
                className={
                  productsOpen ? "rotate" : ""
                }
              />
            </button>

            <div
              className={`account-header-dropdown-menu ${
                productsOpen ? "show" : ""
              }`}
            >

              <Link
                to="/products?category=flowering"
                onClick={closeMenu}
              >
                Flowering plants
              </Link>

              <Link
                to="/products?category=foliage"
                onClick={closeMenu}
              >
                Foliage plants
              </Link>

              <Link
                to="/products?category=succulents"
                onClick={closeMenu}
              >
                Succulents & cacti
              </Link>

              <Link
                to="/products?category=hanging"
                onClick={closeMenu}
              >
                Hanging plants
              </Link>

              <div className="account-header-dropdown-divider" />

              <Link
                to="/products"
                onClick={closeMenu}
                className="view-all"
              >
                View all plants
              </Link>

            </div>

          </div>

          <Link
            to="/fertilizer"
            className={
              isActive("/fertilizer") ? "active" : ""
            }
            onClick={closeMenu}
          >
            Fertilizer
          </Link>

          <Link
            to="/guide"
            className={
              isActive("/guide") ? "active" : ""
            }
            onClick={closeMenu}
          >
            Plant Guide
          </Link>

          <div className="account-header-mobile-actions">

            <Link to="/search" onClick={closeMenu}>
              <SearchIcon size={17} />
              Search
            </Link>

            <Link
              to="/account"
              onClick={closeMenu}
            >
              <UserRoundIcon size={17} />
              My Account
            </Link>

            <Link
              to="/cart"
              onClick={closeMenu}
            >
              <ShoppingBagIcon size={17} />
              Shopping Bag
            </Link>

          </div>

        </nav>

        <div className="account-header-actions">

          <Link
            to="/search"
            className="account-header-action"
            aria-label="Search"
          >
            <SearchIcon size={18} />
          </Link>

          <Link
            to="/account"
            className={`account-header-action ${
              isActive("/account") ? "active" : ""
            }`}
            aria-label="Account"
          >
            <UserRoundIcon size={18} />
          </Link>

          <Link
            to="/cart"
            className="account-header-cart"
            aria-label="Shopping bag"
          >
            <ShoppingBagIcon size={18} />
            <span>0</span>
          </Link>

        </div>

        <button
          type="button"
          className="account-header-menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <XIcon size={21} />
          ) : (
            <MenuIcon size={21} />
          )}
        </button>

      </div>

    </header>
  );
}

export default AccountHeader;

