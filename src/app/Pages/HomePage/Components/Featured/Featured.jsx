import React from "react";
import "./Featured.css";
import { Products } from "../../../../../../Data/data";
import ProductCard from "../ProductCard/ProductCard";
import { Link } from "react-router-dom";

function Featured() {
  return (
    <section className="featured">
      <div className="featured-header">
        <h1>Featured</h1>

        <Link to="/products" >
          View all
        </Link>
      </div>

      <div className="featured-slider">
        <div className="featured-products">
          {Products.map((product) => (
            <ProductCard
              key={product.name}
              product={product}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Featured;
