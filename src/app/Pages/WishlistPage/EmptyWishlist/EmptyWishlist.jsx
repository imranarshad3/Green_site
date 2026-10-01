import React from "react";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

import "./EmptyWishlist.css";

function EmptyWishlist() {
  return (
    <section className="empty-wishlist">

      <div className="empty-wishlist-icon">
        <Heart
          size={30}
          strokeWidth={1.5}
        />
      </div>

      <span className="empty-wishlist-label">
        Your saved plants
      </span>

      <h2>
        Your wishlist is waiting
      </h2>

      <p>
        Save the plants you love and come back
        whenever you're ready to bring something green home.
      </p>

      <Link
        to="/products"
        className="empty-wishlist-button"
      >
        Explore plants
        <span>→</span>
      </Link>

    </section>
  );
}

export default EmptyWishlist;

