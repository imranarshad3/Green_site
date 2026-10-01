import React, { useState, useEffect } from "react";

import Navbar from "../../ReusedComponents/Navbar/Navbar";
import "./ProductsPage.css";

import Herosection from "./Components/Herosection/Herosection";
import ProductFilter from "./Components/Filter/ProductFilter";
import Toolsbar from "./Components/Toolsbar/Toolsbar";
import Collection from "./Components/Collections/Collection";
import Footer from "./Components/Footer/Footer";

import { useProducts } from "../../Context/ProductsContext";

const DEFAULT_FILTERS = {
  categories: [],
  careLevels: [],
  maxPrice: 150,
  potColor: null,
};

function matchesFilters(product, filters) {
  const categoryMatch =
    filters.categories.length === 0 ||
    filters.categories.includes(product.category);

  const careMatch =
    filters.careLevels.length === 0 ||
    filters.careLevels.includes(product.careLevel);

  const priceMatch =
    Number(product.price) <= Number(filters.maxPrice);

  const potColorMatch =
    !filters.potColor ||
    product.colors?.includes(filters.potColor);

  return categoryMatch && careMatch && priceMatch && potColorMatch;
}

const sorters = {
  featured: () => 0,
  newest: (a, b) => b.id - a.id,
  "price-low": (a, b) => a.price - b.price,
  "price-high": (a, b) => b.price - a.price,
  rating: (a, b) => b.rating - a.rating || b.reviews - a.reviews,
};

function ProductsPage() {
  const { plants: productsData } = useProducts();
  const [sort, setSort] = useState("featured");

  const [view, setView] = useState("grid");

  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const visibleProducts = productsData
    .filter((product) => matchesFilters(product, filters))
    .sort(sorters[sort]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="products-page">

      <Navbar />

      <section className="products-hero">
        <Herosection />
      </section>

      <section className="products-container">

        <div className="products-toolbar">
          <Toolsbar
            productCount={visibleProducts.length}
            totalProducts={productsData.length}
            sort={sort}
            setSort={setSort}
            view={view}
            setView={setView}
          />
        </div>

        <div className="products-content">

          <aside className="products-sidebar">
            <ProductFilter
              products={productsData}
              filters={filters}
              setFilters={setFilters}
              defaultFilters={DEFAULT_FILTERS}
            />
          </aside>

          <section className="products-collection">
            <Collection
              key={`${JSON.stringify(filters)}-${sort}`}
              products={visibleProducts}
              view={view}
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

export default ProductsPage;
