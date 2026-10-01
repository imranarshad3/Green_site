import React from "react";
import "./ProductFilter.css";

// Swatch values match the hex codes in each product's `colors` list; the
// names follow the pot styles offered on the product page.
const potColors = [
  {
    name: "Ivory",
    value: "#eee9dc",
  },
  {
    name: "Sand",
    value: "#e9b86d",
  },
  {
    name: "Terracotta",
    value: "#bc6831",
  },
  {
    name: "Charcoal",
    value: "#292929",
  },
];

const countBy = (products, field, value) =>
  products.filter((product) => product[field] === value).length;

function ProductFilter({ products, filters, setFilters, defaultFilters }) {
  const categories = [
    {
      name: "Flowering plants",
      value: "Flowering",
    },
    {
      name: "Foliage plants",
      value: "Foliage",
    },
    {
      name: "Succulents & cacti",
      value: "Succulents & Cacti",
    },
    {
      name: "Hanging plants",
      value: "Hanging Plants",
    },
  ].map((category) => ({
    ...category,
    count: countBy(products, "category", category.value),
  }));

  const careLevels = [
    {
      name: "Easy",
      value: "Easy",
    },
    {
      name: "Moderate",
      value: "Moderate",
    },
    {
      name: "Expert",
      value: "Expert",
    },
  ].map((level) => ({
    ...level,
    count: countBy(products, "careLevel", level.value),
  }));

  const handleCategoryChange = (value) => {
    setFilters((previous) => {
      const exists = previous.categories.includes(value);

      return {
        ...previous,
        categories: exists
          ? previous.categories.filter((item) => item !== value)
          : [...previous.categories, value],
      };
    });
  };

  const handleCareChange = (value) => {
    setFilters((previous) => {
      const exists = previous.careLevels.includes(value);

      return {
        ...previous,
        careLevels: exists
          ? previous.careLevels.filter((item) => item !== value)
          : [...previous.careLevels, value],
      };
    });
  };

  const handlePotColorChange = (value) => {
    setFilters((previous) => ({
      ...previous,
      potColor:
        previous.potColor === value ? null : value,
    }));
  };

  const handlePriceChange = (event) => {
    const value = Number(event.target.value);

    setFilters((previous) => ({
      ...previous,
      maxPrice: value,
    }));
  };

  const clearFilters = () => {
    setFilters(defaultFilters);
  };

  return (
    <aside className="product-filters">

      <div className="filter-section">
        <h3>Category</h3>

        <div className="filter-options">
          {categories.map((category) => (
            <label
              className="filter-checkbox"
              key={category.value}
            >
              <input
                type="checkbox"
                checked={filters.categories.includes(
                  category.value
                )}
                onChange={() =>
                  handleCategoryChange(category.value)
                }
              />

              <span>{category.name}</span>

              <small>{category.count}</small>
            </label>
          ))}
        </div>
      </div>

      <div className="filter-section filter-price">
        <h3>Price</h3>

        <div className="price-values">
          <span>$10</span>

          <input
            type="range"
            min="10"
            max="150"
            value={filters.maxPrice}
            onChange={handlePriceChange}
            style={{
              "--range-progress": `${
                ((filters.maxPrice - 10) / 140) * 100
              }%`,
            }}
          />

          <span>${filters.maxPrice}</span>
        </div>
      </div>

      <div className="filter-section filter-pots-color">
        <h3>Pot Color</h3>

        <div className="pots-filter-colors">
          {potColors.map((color) => (
            <button
              type="button"
              key={color.name}
              className={`pots-filter-color ${
                filters.potColor === color.value
                  ? "selected"
                  : ""
              }`}
              style={{
                backgroundColor: color.value,
              }}
              onClick={() =>
                handlePotColorChange(color.value)
              }
              aria-label={color.name}
            />
          ))}
        </div>
      </div>

      <div className="filter-section care-level">
        <h3>Care Level</h3>

        <div className="filter-options">
          {careLevels.map((level) => (
            <label
              className="filter-checkbox"
              key={level.value}
            >
              <input
                type="checkbox"
                checked={filters.careLevels.includes(
                  level.value
                )}
                onChange={() =>
                  handleCareChange(level.value)
                }
              />

              <span>{level.name}</span>

              <small>{level.count}</small>
            </label>
          ))}
        </div>
      </div>

      <button
        type="button"
        className="clear-filters"
        onClick={clearFilters}
      >
        Clear all filters
      </button>

    </aside>
  );
}

export default ProductFilter;

