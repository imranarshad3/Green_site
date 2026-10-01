import React from "react";

import "./OrderItem.css";

function OrderItem({ item }) {
  return (
    <div className="order-item">

      <div className="order-item-image">
        <img
          src={item.image}
          alt={item.name}
        />
      </div>

      <div className="order-item-info">

        <h4>
          {item.name}
        </h4>

        <p>
          Quantity: {item.quantity}
        </p>

      </div>

      <div className="order-item-price">
        ${(item.price * item.quantity).toFixed(2)}
      </div>

    </div>
  );
}

export default OrderItem;
