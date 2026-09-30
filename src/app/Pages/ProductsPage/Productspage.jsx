import React, { useState, useEffect } from "react";

import Navbar from "../../ReusedComponents/Navbar/Navbar";
import "./Productspage.css";

import Herosection from "./Components/Herosection/Herosection";
import ProductFilter from "./Components/Filter/ProductFilter";
import Toolsbar from "./Components/Toolsbar/Toolsbar";
import Collection from "./Components/Collections/Collection";
import Footer from "./Components/Footer/Footer";

import productsData from "./Components/Collections/Plantify_Products/data";

function Productspage() {
  const [sort, setSort] = useState("featured");

  const [view, setView] = useState("grid");

  const [filters, setFilters] = useState({
    categories: ["Flowering"],
    careLevels: [],
    maxPrice: 150,
    potColor: null,
  });

  const [filteredCount, setFilteredCount] = useState(0);

  const totalProducts = productsData.length;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="products-page">

      <header className="products-navbar">
        <Navbar />
      </header>

      <section className="products-hero">
        <Herosection />
      </section>

      <section className="products-container">

        <div className="products-toolbar">
          <Toolsbar
            productCount={filteredCount}
            totalProducts={totalProducts}
            sort={sort}
            setSort={setSort}
            view={view}
            setView={setView}
          />
        </div>

        <div className="products-content">

          <aside className="products-sidebar">
            <ProductFilter
              filters={filters}
              setFilters={setFilters}
            />
          </aside>

          <section className="products-collection">
            <Collection
              view={view}
              sort={sort}
              filters={filters}
              onFilteredCountChange={setFilteredCount}
            />
          </section>

        </div>

      </section>

      <div className="footer-part">
        <Footer />
      </div>

    </main>
  );
}

export default Productspage;

