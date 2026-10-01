import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import "./Featured.css";
import ProductCard from "../ProductCard/ProductCard";
import { useProducts } from "../../../../Context/ProductsContext";

const FEATURED_COUNT = 4;

function Featured() {
  const { plants, loading, error } = useProducts();

  const featuredProducts = [
    ...plants.filter((product) => product.badge),
    ...plants.filter((product) => !product.badge),
  ].slice(0, FEATURED_COUNT);

  return (
    <section className="hm-section hm-featured">
      <div className="hm-container">
        <div className="hm-section-head">
          <div>
            <span className="hm-eyebrow">Curated picks</span>
            <h2 className="hm-title">
              Featured <em>plants</em>
            </h2>
            <p className="hm-lead">
              Our most-loved greenery this season, ready to settle into
              your space.
            </p>
          </div>

          <Link to="/products" className="hm-text-link">
            View all plants
            <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="hm-featured-grid" aria-busy="true" aria-label="Loading featured plants">
            {Array.from({ length: FEATURED_COUNT }).map((_, index) => (
              <div className="hm-card-skeleton" key={index}>
                <div className="hm-skeleton hm-skeleton-image" />
                <div className="hm-skeleton hm-skeleton-line" />
                <div className="hm-skeleton hm-skeleton-line short" />
              </div>
            ))}
          </div>
        ) : featuredProducts.length > 0 ? (
          <div className="hm-featured-grid">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="hm-featured-empty">
            <p className="hm-featured-empty-title">
              {error
                ? "We couldn't load our plants right now."
                : "New plants are on their way."}
            </p>
            <p>
              {error
                ? "Please refresh the page in a moment."
                : "Check back soon, or browse the full collection."}
            </p>
            <Link to="/products" className="hm-text-link">
              Browse the collection
              <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

export default Featured;
