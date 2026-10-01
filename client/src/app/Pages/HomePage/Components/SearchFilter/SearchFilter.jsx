import { Search } from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./SearchFilter.css";

const QUICK_SEARCHES = ["Flowering", "Foliage", "Succulents", "Hanging"];

function SearchFilter() {
  const [term, setTerm] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate(`/search?q=${encodeURIComponent(term.trim())}`);
  };

  return (
    <section className="hm-search">
      <div className="hm-container">
        <div className="hm-search-panel">
          <span className="hm-eyebrow">Find your plant</span>
          <h2 className="hm-title">
            What are you <em>looking for?</em>
          </h2>

          <form className="hm-search-form" role="search" onSubmit={handleSubmit}>
            <Search size={20} className="hm-search-icon" aria-hidden="true" />
            <input
              type="search"
              value={term}
              onChange={(event) => setTerm(event.target.value)}
              placeholder="Search plants, flowers, fertilizers…"
              aria-label="Search the shop"
            />
            <button type="submit">Search</button>
          </form>

          <div className="hm-search-chips">
            <span>Popular:</span>
            {QUICK_SEARCHES.map((item) => (
              <Link key={item} to={`/search?q=${encodeURIComponent(item)}`}>
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default SearchFilter;
