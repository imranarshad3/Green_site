import React from 'react';
import img1 from "../FertilizerImages/Leafbloom.png" 
import img2 from "../FertilizerImages/Rootrevival.png";
import img3 from "../FertilizerImages/Balancedgrowth.png";
import { Link } from "react-router-dom";

import "./FertShop.css"

const Fertilizer = [
  {
    id : 1,
    category: "Bestseller",
    name: "Balanced Growth",
    desc: "For foliage and everyday growth.",
    price: "$18",
    image: img1,
  },
  {
    id : 2,
    category: "Root Care",
    name: "Root Revival",
    desc: "For stronger, healthier roots.",
    price: "$22",
    image: img2,
  },
  {
    id : 3,
    category: "New Formula",
    name: "Leaf & Bloom",
    desc: "For vibrant foliage and flowers.",
    price: "$20",
    image: img3,
  }
];

function FertCard({ product }) {
  return (
    <div className="fert-shop-card">
      <div className="fert-shop-card-image">
        <img src={product.image} alt={product.name} />
      </div>

      <div className="fert-shop-card-info">
        <p className="fert-card-tag">{product.category}</p>
        <h3 className="fert-card-title">{product.name}</h3>
        <p className="fert-card-desc">{product.desc}</p>
      </div>

      <div className="fert-shop-card-bottom">
        <p className="fert-price">{product.price}</p>
        <Link to={`/products/fertilizer/${product.id}`}>
  View product
</Link>
      </div>
    </div>
  );
}

function FertShop() {
  return (
    <div className="fert-shop-section">
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
          {Fertilizer.map((product) => (
            <div className="fert-shop-product" key={product.name}>
              <FertCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FertShop;

