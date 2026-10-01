import React from "react";
import { Grid2X2, List, ChevronDown } from "lucide-react";
import "./Toolsbar.css";

function ProductToolbar({
  productCount = 0,
  totalProducts = 0,
  sort = "featured",
  setSort,
  view = "grid",
  setView,
}) {
  return (
    <div className="product-toolbar">

      <p className="product-count">
        Showing <span>{productCount}</span> of {totalProducts} plants
      </p>

      <div className="toolbar-actions">

        <div className="sort-wrapper">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="sort-select"
            aria-label="Sort products"
          >
            <option value="featured">Featured</option>
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>

          <ChevronDown
            className="sort-icon"
            size={14}
          />
        </div>

        <div className="view-buttons">

          <button
            type="button"
            className={`view-button ${
              view === "grid" ? "active" : ""
            }`}
            onClick={() => setView("grid")}
            aria-label="Grid view"
          >
            <Grid2X2 size={16} strokeWidth={1.5} />
          </button>

          <button
            type="button"
            className={`view-button ${
              view === "list" ? "active" : ""
            }`}
            onClick={() => setView("list")}
            aria-label="List view"
          >
            <List size={17} strokeWidth={1.5} />
          </button>

        </div>

      </div>

    </div>
  );
}

export default ProductToolbar;

