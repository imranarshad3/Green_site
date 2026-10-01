import React from "react";

import "./OrdersHeader.css";

function OrdersHeader() {
  return (
    <section className="orders-header">

      <div className="orders-header-content">

        <span className="orders-eyebrow">
          Your purchases
        </span>

        <h1>
          My Orders
        </h1>

        <p>
          Keep track of your plants, fertilizers,
          and everything growing your way.
        </p>

      </div>

      <div className="orders-header-count">
        <span>3</span>
        <small>Total orders</small>
      </div>

    </section>
  );
}

export default OrdersHeader;
