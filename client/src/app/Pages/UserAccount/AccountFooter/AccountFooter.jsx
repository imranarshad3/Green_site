import {
  ArrowUpRightIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon
} from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./AccountFooter.css";

const CURRENT_YEAR = new Date().getFullYear();

function AccountFooter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!email.trim()) return;

    setSubmitted(true);
    setEmail("");
  };

  return (
    <footer className="account-footer">

      <div className="account-footer-container">

        <div className="account-footer-top">

          <div className="account-footer-brand">

            <Link to="/" className="account-footer-logo">
              plantify<span>.</span>
            </Link>

            <p>
              Thoughtful plants for thoughtful spaces.
              Bringing a little more green into everyday life.
            </p>

            <div className="account-footer-location">
              <MapPinIcon size={14} />
              <span>Lahore, Pakistan</span>
            </div>

          </div>

          <div className="account-footer-links">

            <div className="account-footer-column">

              <p className="account-footer-column-title">
                SHOP
              </p>

              <Link to="/products">
                All plants
              </Link>

              <Link to="/products?category=flowering">
                Flowering plants
              </Link>

              <Link to="/products?category=foliage">
                Foliage plants
              </Link>

              <Link to="/fertilizers">
                Fertilizer
              </Link>

              <Link to="/products">
                Plant stands
              </Link>

            </div>

            <div className="account-footer-column">

              <p className="account-footer-column-title">
                ACCOUNT
              </p>

              <Link to="/account">
                My account
              </Link>

              <Link to="/orders">
                My orders
              </Link>

              <Link to="/wishlist">
                Wishlist
              </Link>

              <Link to="/account/addresses">
                Addresses
              </Link>

              <Link to="/account/preferences">
                Preferences
              </Link>

            </div>

            <div className="account-footer-column">

              <p className="account-footer-column-title">
                EXPLORE
              </p>

              <Link to="/guide">
                Plant guide
              </Link>

              <Link to="/about">
                About Plantify
              </Link>

              <Link to="/contact">
                Contact us
              </Link>

              <Link to="/faq">
                FAQs
              </Link>

              <Link to="/shipping">
                Shipping & returns
              </Link>

            </div>

          </div>

        </div>

        <div className="account-footer-newsletter">

          <div className="account-footer-newsletter-content">

            <p>
              STAY IN THE LOOP
            </p>

            <h2>
              Let your inbox
              <span> grow.</span>
            </h2>

            <span>
              Get plant-care tips, new arrivals and little
              pieces of green inspiration.
            </span>

          </div>

          <form
            className="account-footer-newsletter-form"
            onSubmit={handleSubmit}
          >

            <div className="account-footer-input">

              <MailIcon size={15} />

              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                required
              />

            </div>

            <button type="submit">
              {submitted ? "You're in" : "Subscribe"}
              <ArrowUpRightIcon size={14} />
            </button>

          </form>

        </div>

        <div className="account-footer-contact">

          <a href="mailto:hello@plantify.com">
            <MailIcon size={14} />
            hello@plantify.com
          </a>

          <a href="tel:+923001234567">
            <PhoneIcon size={14} />
            +92 300 1234567
          </a>

          <div className="account-footer-socials">

            <a
              href="#"
              aria-label="Instagram"
            >
              <PhoneIcon size={15} />
            </a>

            <a
              href="#"
              aria-label="Facebook"
            >
              f
            </a>

            <a
              href="#"
              aria-label="Pinterest"
            >
              p
            </a>

          </div>

        </div>

        <div className="account-footer-bottom">

          <p>
            © {CURRENT_YEAR} Plantify. All rights reserved.
          </p>

          <div>

            <Link to="/privacy">
              Privacy
            </Link>

            <Link to="/terms">
              Terms
            </Link>

            <Link to="/cookies">
              Cookies
            </Link>

          </div>

          <span className="account-footer-made">
            Made with care for plant people.
          </span>

        </div>

      </div>

    </footer>
  );
}

export default AccountFooter;
