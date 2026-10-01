import React from "react";
import { Link } from "react-router-dom";
import "./HomeFooter.css";
import { STORE } from "../../../../utils/storeInfo";

const CURRENT_YEAR = new Date().getFullYear();

const COLUMNS = [
  {
    title: "Shop",
    links: [
      { to: "/products", label: "All plants" },
      { to: "/fertilizers", label: "Fertilizers" },
      { to: "/search", label: "Search" },
    ],
  },
  {
    title: "Learn",
    links: [
      { to: "/guide", label: "Plant care guide" },
      { to: "/fertilizers", label: "Feeding routine" },
      { to: "/faq", label: "FAQ" },
      { to: "/contact", label: "Contact us" },
    ],
  },
  {
    title: "Account",
    links: [
      { to: "/account", label: "My account" },
      { to: "/orders", label: "Orders" },
      { to: "/wishlist", label: "Wishlist" },
      { to: "/cart", label: "Cart" },
    ],
  },
];

function HomeFooter() {
  return (
    <footer className="hm-footer">
      <div className="hm-container">
        <div className="hm-footer-top">
          <div className="hm-footer-brand">
            <p className="hm-footer-logo">Plantify</p>
            <p className="hm-footer-tagline">
              Thoughtfully grown plants for beautiful spaces.
            </p>
            <p className="hm-footer-contact">
              {STORE.phone} · {STORE.email}
            </p>
          </div>

          {COLUMNS.map((column) => (
            <nav className="hm-footer-column" key={column.title} aria-label={column.title}>
              <p className="hm-footer-heading">{column.title}</p>
              {column.links.map((link) => (
                <Link key={link.label} to={link.to}>
                  {link.label}
                </Link>
              ))}
            </nav>
          ))}
        </div>

        <div className="hm-footer-bottom">
          <p>© {CURRENT_YEAR} Plantify Garden. All rights reserved.</p>
          <p>{STORE.addressLines[0]}</p>
        </div>
      </div>
    </footer>
  );
}

export default HomeFooter;
