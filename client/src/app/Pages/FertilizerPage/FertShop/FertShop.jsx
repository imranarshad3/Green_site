import React from 'react';
import { Link } from "react-router-dom";

import { useProducts } from "../../../Context/ProductsContext";
import { getProductPath } from "../../../utils/products";

import "./FertShop.css"

function FertCard({ product }) {
  return (
    <div className="fert-shop-card">
      <div className="fert-shop-card-image">
        <img src={product.images[0]} alt={product.name} />
      </div>

      <div className="fert-shop-card-info">
        <p className="fert-card-tag">{product.category}</p>
        <h3 className="fert-card-title">{product.name}</h3>
        <p className="fert-card-desc">{product.desc}</p>
      </div>

      <div className="fert-shop-card-bottom">
        <p className="fert-price">${product.price}</p>
        <Link to={getProductPath(product)}>
          View product
        </Link>
      </div>
    </div>
  );
}

function FertShop() {
  const { fertilizers } = useProducts();

  return (
    <div className="fert-shop-section" id="shop">
      <div className="fert-shop-top">
        <p>Shop by need</p>
        <h2 className="fert-h2">
          The right nourishment <br />
          for every plant.
        </h2>
        <p className="fert-shop-desc">
          Build a simple feeding routine with formulas selected around the way your plants actually grow.
        </p>

        <div className="fert-shop-grid">
          {fertilizers.map((product) => (
            <div className="fert-shop-product" key={product.id}>
              <FertCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FertShop;

