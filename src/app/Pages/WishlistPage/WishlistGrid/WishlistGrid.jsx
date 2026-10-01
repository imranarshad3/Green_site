import React from "react";

import WishlistCard from "../WishlistCard/WishlistCard";

import "./WishlistGrid.css";

function WishlistGrid({
  products,
  removeProduct,
}) {
  return (
    <section className="wishlist-grid">

      {products.map((product) => (
        <WishlistCard
          key={product.id}
          product={product}
          removeProduct={removeProduct}
        />
      ))}

    </section>
  );
}

export default WishlistGrid;

