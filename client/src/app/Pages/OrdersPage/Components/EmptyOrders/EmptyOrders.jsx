import React from "react";
import { Link } from "react-router-dom";

import "./EmptyOrders.css";

function EmptyOrders() {
  return (
    <div className="empty-orders">

      <div className="empty-orders-icon">
        ✦
      </div>

      <h2>
        Nothing here yet.
      </h2>

      <p>
        Your future plant purchases will appear
        here once you place your first order.
      </p>

      <Link
        to="/products"
        className="empty-orders-btn"
      >
        Explore plants
        <span>→</span>
      </Link>

    </div>
  );
}

export default EmptyOrders;
