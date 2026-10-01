import React from "react";
import { Link } from "react-router-dom";

import OrderItem from "../OrderItem/OrderItem";

import "./OrderCard.css";

function OrderCard({ order }) {
  return (
    <article className="order-card">

      <div className="order-card-top">

        <div>
          <span className="order-label">
            Order
          </span>

          <h3>
            #{order.id}
          </h3>

          <p>
            Placed on {order.date}
          </p>
        </div>

        <span
          className={`order-status ${order.statusType}`}
        >
          <span className="order-status-dot"></span>
          {order.status}
        </span>

      </div>

      <div className="order-items">

        {order.items.map((item) => (
          <OrderItem
            key={item.id}
            item={item}
          />
        ))}

      </div>

      <div className="order-card-bottom">

        <div className="order-total">
          <span>Total</span>
          <strong>
            ${order.total.toFixed(2)}
          </strong>
        </div>

        <Link
          to="/products"
          className="order-details-btn"
        >
          Shop again
          <span>→</span>
        </Link>

      </div>

    </article>
  );
}

export default OrderCard;
