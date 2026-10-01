import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

import "./SearchPage.css";

import Card from "../ProductsPage/Components/Card/Cards";

function SearchPage({ products }) {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  const closeSearch = () => {
    navigate(-1);
  };

  return (
    <div className="search-page-section">

      <button
        className="search-page-close"
        onClick={closeSearch}
        aria-label="Close search"
      >
        <X size={28} strokeWidth={1.8} />
      </button>

      <div className="search-box">

        <input
          type="text"
          className="input-search"
          placeholder="Search plants..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          autoFocus
        />

      </div>

      <div className="search-products">

        {search && filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <Card
              key={product.id}
              product={product}
            />
          ))
        ) : search && filteredProducts.length === 0 ? (
          <p className="no-results">
            No products found for "{search}"
          </p>
        ) : null}

      </div>

    </div>
  );
}

export default SearchPage;
