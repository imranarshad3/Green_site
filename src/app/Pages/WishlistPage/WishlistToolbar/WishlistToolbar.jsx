import React from "react";

import "./WishlistToolbar.css";

function WishlistToolbar({
  count,
  sort,
  setSort,
}) {
  return (
    <div className="wishlist-toolbar">

      <div className="wishlist-toolbar-inner">

        <p>
          <strong>{count}</strong>{" "}
          {count === 1 ? "item" : "items"} saved
        </p>

        <div className="wishlist-sort">

          <span>
            Sort by
          </span>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="latest">
              Recently added
            </option>

            <option value="low">
              Price: Low to high
            </option>

            <option value="high">
              Price: High to low
            </option>
          </select>

        </div>

      </div>

    </div>
  );
}

export default WishlistToolbar;

