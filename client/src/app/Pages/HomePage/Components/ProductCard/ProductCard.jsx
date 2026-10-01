import React from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

import "./ProductCard.css";
import { getProductPath } from "../../../../utils/products";
import { useWishlist } from "../../../../Context/WishlistContext";
import CartButton from "../../../../ReusedComponents/CartButton/CartButton";

function ProductCard({ product }) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const saved = isWishlisted(product);
  const path = getProductPath(product);

  return (
    <article className="hm-card">
      <div className="hm-card-media">
        <Link to={path} className="hm-card-image" tabIndex={-1} aria-hidden="true">
          <img src={product.images[0]} alt="" loading="lazy" />
        </Link>

        {product.badge && <span className="hm-card-badge">{product.badge}</span>}

        <button
          type="button"
          className={`hm-card-heart ${saved ? "is-saved" : ""}`}
          onClick={() => toggleWishlist(product)}
          aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          aria-pressed={saved}
        >
          <Heart size={17} fill={saved ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="hm-card-body">
        <p className="hm-card-category">{product.category}</p>

        <div className="hm-card-row">
          <Link to={path} className="hm-card-name">
            {product.name}
          </Link>

          <p className="hm-card-price">
            ${product.price}
            {product.oldPrice && <del>${product.oldPrice}</del>}
          </p>
        </div>

        {product.colors?.length > 0 && (
          <div className="hm-card-colors" aria-label="Available pot colors">
            {product.colors.map((color) => (
              <span key={color} style={{ backgroundColor: color }} />
            ))}
          </div>
        )}

        <CartButton
          product={product}
          className="hm-card-cart"
          buttonClassName="hm-card-add"
          label="Add to cart"
          inCartLabel="In cart ✓"
        />
      </div>
    </article>
  );
}

export default ProductCard;
