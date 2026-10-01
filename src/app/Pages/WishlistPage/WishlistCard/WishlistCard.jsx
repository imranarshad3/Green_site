import React from "react";
import { Heart, ShoppingBag, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

import "./WishlistCard.css";

function WishlistCard({
  product,
  removeProduct,
}) {
  return (
    <article className="wishlist-card">

      <div className="wishlist-card-image">

        <img
          src={product.image}
          alt={product.name}
        />

        <button
          className="wishlist-remove"
          onClick={() => removeProduct(product.id)}
          aria-label="Remove from wishlist"
        >
          <Heart
            size={19}
            fill="currentColor"
          />
        </button>

        {!product.available && (
          <div className="wishlist-soldout">
            Currently unavailable
          </div>
        )}

        {product.oldPrice && (
          <span className="wishlist-sale">
            Sale
          </span>
        )}

      </div>

      <div className="wishlist-card-content">

        <p className="wishlist-category">
          {product.category}
        </p>

        <Link
          to={`/product/${product.id}`}
          className="wishlist-product-name"
        >
          {product.name}
        </Link>

        <div className="wishlist-card-bottom">

          <div className="wishlist-price">

            <span>
              ${product.price}
            </span>

            {product.oldPrice && (
              <del>
                ${product.oldPrice}
              </del>
            )}

          </div>

          <Link
            to={`/product/${product.id}`}
            className="wishlist-view"
          >
            <ArrowUpRight size={18} />
          </Link>

        </div>

        <button
          className="wishlist-cart-btn"
          disabled={!product.available}
        >
          <ShoppingBag size={17} />

          {product.available
            ? "Add to cart"
            : "Unavailable"}
        </button>

      </div>

    </article>
  );
}

export default WishlistCard;
