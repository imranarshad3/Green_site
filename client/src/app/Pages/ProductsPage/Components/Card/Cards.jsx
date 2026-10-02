import React from "react";
import { Heart, Eye, Star } from "lucide-react";
import "./Cards.css";
import { Link } from "react-router-dom";
import { useWishlist } from "../../../../Context/WishlistContext";
import CartButton from "../../../../ReusedComponents/CartButton/CartButton";
import { getProductPath } from "../../../../utils/products";

function ProductCard({ product }) {
  const { isWishlisted: isInWishlist, toggleWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product);
  const productPath = getProductPath(product);

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <article className="product-card">
      <div className="product-card-image">
        {product.badge && (
          <span className="product-badge">
            {product.badge}
          </span>
        )}

        <div className="product-actions">
          <button
            className="action-btn"
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            onClick={handleWishlistClick}
          >
            <Heart
              size={18}
              strokeWidth={1.5}
              fill={isWishlisted ? "#ff4d4d" : "none"}
              color={isWishlisted ? "#ff4d4d" : "currentColor"}
            />
          </button>
          <button className="action-btn" aria-label="Quick view">
            <Link to={productPath}>
                <Eye size={18} strokeWidth={1.5} style={{color:"white"}} />
            </Link>
          </button>
        </div>

        <Link
          to={productPath}
          className="product-card-image-link"
          aria-label={`View ${product.name}`}
        >
          <img
            src={product.images[0]}
            alt={product.name}
          />
        </Link>

        <CartButton
          product={product}
          className="product-card-cart"
          buttonClassName="add-to-cart-btn"
          label={`ADD TO CART — $${product.price}`}
          inCartLabel="IN CART ✓"
        />

      </div>

      <div className="product-card-content">
        <span className="product-category">
          {product.category}
        </span>

        <h2 className="product-name">
          {product.name}
        </h2>

        <div className="product-rating">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={index}
              size={15}
              strokeWidth={1.5}
              fill={index < product.rating ? "currentColor" : "none"}
            />
          ))}
        </div>

        <div className="product-card-bottom">
          <div className="product-price">
            <span>${product.price}</span>

            {product.oldPrice && (
              <del>${product.oldPrice}</del>
            )}
          </div>

          {product.colors?.length > 0 && (
            <div className="product-colors">
              {product.colors.map((color, index) => (
                <span
                  key={index}
                  className="product-color"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
