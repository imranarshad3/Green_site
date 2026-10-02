import React from "react";
import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";

import { RETURN_DAYS, STORE } from "../../../utils/storeInfo";

import "./OdSummary.css";

const formatPrice = (value) => `$${value.toFixed(2)}`;

function OdSummary({ order }) {
  return (
    <aside className="od-side">
      <section className="od-summary">
        <h2>Payment summary</h2>

        <dl>
          <div>
            <dt>Subtotal</dt>
            <dd>{formatPrice(order.subtotal)}</dd>
          </div>

          {order.discount - order.promoDiscount > 0 && (
            <div className="od-summary-discount">
              <dt>Discount</dt>
              <dd>−{formatPrice(order.discount - order.promoDiscount)}</dd>
            </div>
          )}

          {order.promoDiscount > 0 && (
            <div className="od-summary-discount">
              <dt>Promo {order.promoCode}</dt>
              <dd>−{formatPrice(order.promoDiscount)}</dd>
            </div>
          )}

          <div>
            <dt>Delivery</dt>
            <dd>{order.delivery > 0 ? formatPrice(order.delivery) : "Free"}</dd>
          </div>

          <div className="od-summary-total">
            <dt>Total</dt>
            <dd>{formatPrice(order.total)}</dd>
          </div>
        </dl>
      </section>

      {order.shipping.address && (
        <section className="od-summary od-address">
          <h2>Delivering to</h2>
          <p>
            <MapPin size={15} />
            <span>
              <strong>{order.shipping.name}</strong>
              <br />
              {order.shipping.address}
              <br />
              {[order.shipping.city, order.shipping.postalCode].filter(Boolean).join(" ")}
            </span>
          </p>
          <p>
            <Phone size={15} />
            <span>{order.shipping.phone}</span>
          </p>
          <p>
            <Mail size={15} />
            <span>{order.shipping.email}</span>
          </p>
        </section>
      )}

      <section className="od-help">
        <h2>Need help with this order?</h2>

        <p>
          Quote <strong>#{order.id}</strong> when you get in touch. Returns are
          accepted within {RETURN_DAYS} days of delivery.
        </p>

        <a href={`mailto:${STORE.email}?subject=${encodeURIComponent(`Order ${order.id}`)}`}>
          <Mail size={15} />
          {STORE.email}
        </a>

        <a href={STORE.phoneHref}>
          <Phone size={15} />
          {STORE.phone}
        </a>

        <Link to="/faq#delivery" className="od-help-faq">
          Delivery &amp; returns FAQ
        </Link>
      </section>
    </aside>
  );
}

export default OdSummary;
