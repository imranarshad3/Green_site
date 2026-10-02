import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

import { useProducts } from "../../../Context/ProductsContext";
import { getProductPath } from "../../../utils/products";

import "./OdItems.css";

function OdItems({ items }) {
  const { findProductById } = useProducts();

  return (
    <section className="od-items">
      <h2>Items in this order</h2>

      <ul>
        {items.map((item) => {
          const product = item.productId ? findProductById(item.productId) : null;
          const options = [item.size, item.potStyle && `${item.potStyle} pot`]
            .filter(Boolean)
            .join(" · ");

          return (
            <li key={item.id} className="od-item">
              <div className="od-item-image">
                {item.image && <img src={item.image} alt={item.name} />}
              </div>

              <div className="od-item-info">
                {product ? (
                  <Link to={getProductPath(product)} className="od-item-name">
                    {item.name}
                    <ArrowUpRight size={14} />
                  </Link>
                ) : (
                  <span className="od-item-name">{item.name}</span>
                )}

                {options && <p>{options}</p>}

                <p>
                  {item.quantity} × ${item.price.toFixed(2)}
                </p>
              </div>

              <strong className="od-item-total">
                ${(item.price * item.quantity).toFixed(2)}
              </strong>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default OdItems;
