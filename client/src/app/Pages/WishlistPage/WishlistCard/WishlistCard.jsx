import React from "react";
import { Heart, ShoppingBag, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { getProductPath } from "../../../utils/products";
import CartButton from "../../../ReusedComponents/CartButton/CartButton";

import "./WishlistCard.css";

function WishlistCard({
  product,
  removeProduct,
}) {
  return (
    <article className="wishlist-card">

      <div className="wishlist-card-image">

        <img
          src={product.images[0]}
          alt={product.name}
        />

        <button
          className="wishlist-remove"
          onClick={() => removeProduct(product.wishlistKey)}
          aria-label="Remove from wishlist"
        >
          <Heart
            size={19}
            fill="currentColor"
          />
        </button>

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
          to={getProductPath(product)}
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
            to={getProductPath(product)}
            className="wishlist-view"
          >
            <ArrowUpRight size={18} />
          </Link>

        </div>

        <CartButton
          product={product}
          buttonClassName="wishlist-cart-btn"
          icon={<ShoppingBag size={17} />}
          label="Add to cart"
          inCartLabel="In cart ✓"
        />

      </div>

    </article>
  );
}

export default WishlistCard;
