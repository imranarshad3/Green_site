import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import "./OdHeader.css";

function OdHeader({ order }) {
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <section className="od-header">
      <Link to="/orders" className="od-back">
        <ArrowLeft size={16} />
        All orders
      </Link>

      <div className="od-header-row">
        <div>
          <span className="od-eyebrow">Order details</span>
          <h1>#{order.id}</h1>
          <p>
            Placed on {order.date} · {itemCount} {itemCount === 1 ? "item" : "items"}
          </p>
        </div>

        <span className={`od-status ${order.statusType}`}>
          <span className="od-status-dot"></span>
          {order.status}
        </span>
      </div>
    </section>
  );
}

export default OdHeader;
