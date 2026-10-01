import React from "react";

import "./OrderFilters.css";

const filters = [
  "All",
  "Processing",
  "Shipped",
  "Delivered",
];

function OrderFilters({
  activeFilter,
  setActiveFilter,
  sort,
  setSort,
}) {
  return (
    <div className="order-filters">

      <div className="order-filters-inner">

        {filters.map((filter) => (
          <button
            key={filter}
            className={
              activeFilter === filter
                ? "order-filter active"
                : "order-filter"
            }
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}

      </div>

      <div className="orders-sort">
        <span>Sort by</span>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="latest">
            Latest
          </option>

          <option value="oldest">
            Oldest
          </option>
        </select>
      </div>

    </div>
  );
}

export default OrderFilters;
