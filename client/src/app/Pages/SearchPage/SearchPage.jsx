import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, Search, SearchX, X } from "lucide-react";

import "./SearchPage.css";

import Navbar from "../../ReusedComponents/Navbar/Navbar";
import HomeFooter from "../HomePage/Components/HomeFooter/HomeFooter";
import Card from "../ProductsPage/Components/Card/Cards";
import { useProducts } from "../../Context/ProductsContext";

const TYPES = [
  { value: "all", label: "All" },
  { value: "plant", label: "Plants" },
  { value: "fertilizer", label: "Fertilizers" },
];

const SORTS = {
  relevance: { label: "Best match", compare: (a, b) => b.score - a.score },
  "price-low": { label: "Price: low to high", compare: (a, b) => a.product.price - b.product.price },
  "price-high": { label: "Price: high to low", compare: (a, b) => b.product.price - a.product.price },
  rating: {
    label: "Top rated",
    compare: (a, b) =>
      (b.product.rating ?? 0) - (a.product.rating ?? 0) ||
      (b.product.reviews ?? 0) - (a.product.reviews ?? 0),
  },
};

const PICKS_COUNT = 6;
const URL_DELAY = 300;

const normalize = (value) =>
  String(value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

function scoreProduct(product, words) {
  const name = normalize(product.name);
  const category = normalize(product.category);
  const details = normalize(
    [product.type, product.badge, product.careLevel, product.light, product.watering, product.description].join(" ")
  );

  let score = 0;
  for (const word of words) {
    if (name.startsWith(word)) score += 6;
    else if (name.split(/\s+/).some((part) => part.startsWith(word))) score += 5;
    else if (name.includes(word)) score += 4;
    else if (category.includes(word)) score += 3;
    else if (details.includes(word)) score += 1;
    else return 0;
  }
  return score;
}

function SearchPage() {
  const { plants, fertilizers, loading, error } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const inputRef = useRef(null);

  const query = searchParams.get("q") ?? "";
  const [text, setText] = useState(query);
  const [seenQuery, setSeenQuery] = useState(query);

  if (query !== seenQuery) {
    setSeenQuery(query);
    setText(query);
  }

  useEffect(() => {
    if (text === query) return undefined;
    const timer = setTimeout(() => {
      setSearchParams(
        (previous) => {
          const next = new URLSearchParams(previous);
          if (text) next.set("q", text);
          else next.delete("q");
          return next;
        },
        { replace: true }
      );
    }, URL_DELAY);
    return () => clearTimeout(timer);
  }, [text, query, setSearchParams]);
  const type = TYPES.some((item) => item.value === searchParams.get("type"))
    ? searchParams.get("type")
    : "all";
  const sort = SORTS[searchParams.get("sort")] ? searchParams.get("sort") : "relevance";

  const products = useMemo(() => [...plants, ...fertilizers], [plants, fertilizers]);

  const categories = useMemo(
    () => [...new Set(products.map((product) => product.category).filter(Boolean))],
    [products]
  );

  const words = useMemo(() => normalize(text).split(/\s+/).filter(Boolean), [text]);

  const matches = useMemo(
    () =>
      words.length === 0
        ? []
        : products
            .map((product) => ({ product, score: scoreProduct(product, words) }))
            .filter((match) => match.score > 0),
    [products, words]
  );

  const counts = useMemo(
    () => ({
      all: matches.length,
      plant: matches.filter((match) => match.product.type === "plant").length,
      fertilizer: matches.filter((match) => match.product.type === "fertilizer").length,
    }),
    [matches]
  );

  const results = matches
    .filter((match) => type === "all" || match.product.type === type)
    .sort(SORTS[sort].compare)
    .map((match) => match.product);

  const picks = useMemo(
    () =>
      [...plants]
        .sort((a, b) => Boolean(b.badge) - Boolean(a.badge) || (b.rating ?? 0) - (a.rating ?? 0))
        .slice(0, PICKS_COUNT),
    [plants]
  );

  const updateParams = (changes) => {
    setSearchParams(
      (previous) => {
        const next = new URLSearchParams(previous);
        Object.entries(changes).forEach(([key, value]) => {
          if (value && value !== "all" && value !== "relevance") next.set(key, value);
          else next.delete(key);
        });
        return next;
      },
      { replace: true }
    );
  };

  const clearSearch = () => {
    setText("");
    updateParams({ q: "", type: "", sort: "" });
    inputRef.current?.focus();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    inputRef.current?.blur();
  };

  const suggestionChips = (
    <div className="sp-chips">
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          className="sp-chip"
          onClick={() => updateParams({ q: category, type: "" })}
        >
          {category}
        </button>
      ))}
    </div>
  );

  let body;
  if (loading) {
    body = (
      <div className="sp-grid" aria-busy="true" aria-label="Loading products">
        {Array.from({ length: 6 }).map((_, index) => (
          <div className="sp-skeleton-card" key={index}>
            <div className="sp-skeleton sp-skeleton-image" />
            <div className="sp-skeleton sp-skeleton-line" />
            <div className="sp-skeleton sp-skeleton-line sp-skeleton-short" />
          </div>
        ))}
      </div>
    );
  } else if (error) {
    body = (
      <div className="sp-empty">
        <SearchX size={36} strokeWidth={1.4} aria-hidden="true" />
        <h2 className="sp-empty-title">We couldn't load the shop right now.</h2>
        <p>Please refresh the page in a moment.</p>
      </div>
    );
  } else if (words.length === 0) {
    body = (
      <>
        <div className="sp-block">
          <h2 className="sp-block-title">Popular searches</h2>
          {suggestionChips}
        </div>

        {picks.length > 0 && (
          <div className="sp-block">
            <div className="sp-block-head">
              <h2 className="sp-block-title">Customer favourites</h2>
              <Link to="/products" className="hm-text-link">
                View all plants
                <ArrowRight size={16} />
              </Link>
            </div>
            <div className="sp-grid">
              {picks.map((product) => (
                <Card key={`${product.type}-${product.id}`} product={product} />
              ))}
            </div>
          </div>
        )}
      </>
    );
  } else if (matches.length === 0) {
    body = (
      <div className="sp-empty">
        <SearchX size={36} strokeWidth={1.4} aria-hidden="true" />
        <h2 className="sp-empty-title">No results for “{text.trim()}”</h2>
        <p>Check the spelling, try a shorter word, or start from one of these:</p>
        {suggestionChips}
        <Link to="/products" className="hm-text-link">
          Browse all plants
          <ArrowRight size={16} />
        </Link>
      </div>
    );
  } else {
    body = (
      <>
        <div className="sp-toolbar">
          <div className="sp-tabs" role="tablist" aria-label="Product type">
            {TYPES.map((item) => (
              <button
                key={item.value}
                type="button"
                role="tab"
                aria-selected={type === item.value}
                className={`sp-tab${type === item.value ? " is-active" : ""}`}
                onClick={() => updateParams({ type: item.value })}
                disabled={item.value !== "all" && counts[item.value] === 0}
              >
                {item.label}
                <span className="sp-tab-count">{counts[item.value]}</span>
              </button>
            ))}
          </div>

          <label className="sp-sort">
            <span>Sort by</span>
            <select value={sort} onChange={(event) => updateParams({ sort: event.target.value })}>
              {Object.entries(SORTS).map(([value, option]) => (
                <option key={value} value={value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {results.length > 0 ? (
          <div className="sp-grid">
            {results.map((product) => (
              <Card key={`${product.type}-${product.id}`} product={product} />
            ))}
          </div>
        ) : (
          <div className="sp-empty">
            <p>No {type === "plant" ? "plants" : "fertilizers"} match “{text.trim()}”.</p>
            <button type="button" className="sp-chip" onClick={() => updateParams({ type: "" })}>
              Show all results
            </button>
          </div>
        )}
      </>
    );
  }

  return (
    <main className="sp-page">
      <Navbar />

      <section className="sp-hero">
        <div className="hm-container">
          <span className="hm-eyebrow">Search the shop</span>
          <h1 className="hm-title">
            Find your <em>plant</em>
          </h1>

          <form className="sp-form" role="search" onSubmit={handleSubmit}>
            <Search size={20} className="sp-form-icon" aria-hidden="true" />
            <input
              ref={inputRef}
              type="search"
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="Search plants, categories, fertilizers…"
              aria-label="Search the shop"
              autoFocus
            />
            {text && (
              <button type="button" className="sp-form-clear" onClick={clearSearch} aria-label="Clear search">
                <X size={18} />
              </button>
            )}
          </form>

          <p className="sp-status" aria-live="polite">
            {!loading && words.length > 0 && matches.length > 0
              ? `${results.length} ${results.length === 1 ? "result" : "results"} for “${text.trim()}”`
              : ""}
          </p>
        </div>
      </section>

      <section className="sp-results">
        <div className="hm-container">{body}</div>
      </section>

      <HomeFooter />
    </main>
  );
}

export default SearchPage;
