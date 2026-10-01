import React from "react";
import { Heart } from "lucide-react";

import "./WishlistHeader.css";

function WishlistHeader({ count }) {
  return (
    <section className="wishlist-header">

      <div className="wishlist-header-content">

        <span className="wishlist-eyebrow">
          Saved for later
        </span>

        <h1>
          My Wishlist
        </h1>

        <p>
          Keep the plants you love close.
          Your saved favorites will be waiting whenever you're ready.
        </p>

      </div>

      <div className="wishlist-header-icon">
        <Heart size={30} strokeWidth={1.5} />
        <span>{count}</span>
      </div>

    </section>
  );
}

export default WishlistHeader;
