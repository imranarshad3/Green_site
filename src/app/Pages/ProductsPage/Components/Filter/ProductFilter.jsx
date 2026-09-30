import React from "react";
import "./ProductFilter.css";

function ProductFilter({ filters, setFilters }) {
  const categories = [
    {
      name: "Flowering plants",
      value: "Flowering",
      count: 64,
    },
    {
      name: "Foliage plants",
      value: "Foliage",
      count: 88,
    },
    {
      name: "Succulents & cacti",
      value: "Succulents & Cacti",
      count: 52,
    },
    {
      name: "Hanging plants",
      value: "Hanging Plants",
      count: 36,
    },
  ];

  const careLevels = [
    {
      name: "Easy",
      value: "Easy",
      count: 120,
    },
    {
      name: "Moderate",
      value: "Moderate",
      count: 76,
    },
    {
      name: "Expert",
      value: "Expert",
      count: 44,
    },
  ];

  const potColors = [
    {
      name: "White",
      value: "#eee9dc",
    },
    {
      name: "Terracotta",
      value: "#e1846a",
    },
    {
      name: "Blue",
      value: "#31bc82",
    },
    {
      name: "Brown",
      value: "#bc6831",
    },
    {
      name: "Green",
      value: "#718268",
    },
  ];

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
    setFilters({
      categories: [],
      careLevels: [],
      maxPrice: 150,
      potColor: null,
    });
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

