import React from "react";
import "./ProductStory.css";
import image from "./image.webp";

function ProductStory({ product }) {
  const features = [
    `${product.careLevel} care`,
    product.light,
    product.petFriendly ? "Safe around pets" : "Hand-selected healthy plant",
  ];

  return (
    <section className="product-story">
      <div className="product-story-content">
        <span className="product-story-label">
          WHY YOU'LL LOVE IT
        </span>

        <h2 className="product-story-title">
          Bring a little jungle home.
        </h2>

        <p className="product-story-description">
          {product.description}
        </p>

        <div className="product-story-features">
          {features.map((feature, index) => (
            <div className="pd-feature" key={feature}>
              <span className="feature-number">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p>{feature}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="pd-story-image">
        <img
          src={image}
          alt="Houseplants styled in a bright living space"
        />
      </div>
    </section>
  );
}

export default ProductStory;
