import {
  ArrowUpRightIcon,
  HeartIcon,
  ShoppingBagIcon,
  XIcon
} from "lucide-react";
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./AccountWishlist.css";

function AccountWishlist({
  products = [],
  initialWishlist = [],
  maxItems = 4
}) {
  const [wishlistIds, setWishlistIds] = useState(initialWishlist);

  const wishlistProducts = useMemo(() => {
    return products
      .filter((product) => wishlistIds.includes(product.id))
      .slice(0, maxItems);
  }, [products, wishlistIds, maxItems]);

  const removeFromWishlist = (id) => {
    setWishlistIds((current) =>
      current.filter((productId) => productId !== id)
    );
  };

  return (
    <section className="account-wishlist-section">
      <div className="account-wishlist-container">

        <div className="account-wishlist-heading">
          <div>
            <p className="account-wishlist-kicker">
              SAVED FOR LATER
            </p>

            <h2>
              Your
              <span> wishlist.</span>
            </h2>

            <p className="account-wishlist-description">
              A little collection of plants you've fallen for.
              Keep your favourites close until you're ready to
              bring them home.
            </p>
          </div>

          <Link
            to="/wishlist"
            className="account-wishlist-view-all"
          >
            View wishlist
            <ArrowUpRightIcon size={15} />
          </Link>
        </div>

        {wishlistProducts.length > 0 ? (
          <div className="account-wishlist-grid">
            {wishlistProducts.map((product) => (
              <article
                className="account-wishlist-card"
                key={product.id}
              >
                <div className="account-wishlist-image-wrap">

                  <Link
                    to={`/products/${product.id}`}
                    className="account-wishlist-image-link"
                  >
                    <img
                      src={product.images?.[0] || product.image}
                      alt={product.name}
                    />
                  </Link>

                  <button
                    type="button"
                    className="account-wishlist-remove"
                    onClick={() =>
                      removeFromWishlist(product.id)
                    }
                    aria-label={`Remove ${product.name} from wishlist`}
                  >
                    <XIcon size={15} />
                  </button>

                  {product.badge && (
                    <span className="account-wishlist-badge">
                      {product.badge}
                    </span>
                  )}

                </div>

                <div className="account-wishlist-card-content">

                  <div className="account-wishlist-card-top">
                    <div>
                      <p className="account-wishlist-category">
                        {product.category || "PLANTIFY PLANT"}
                      </p>

                      <Link
                        to={`/products/${product.id}`}
                        className="account-wishlist-product-name"
                      >
                        {product.name}
                      </Link>
                    </div>

                    <span className="account-wishlist-price">
                      {product.currency || "$"}
                      {Number(product.price || 0).toFixed(2)}
                    </span>
                  </div>

                  <div className="account-wishlist-card-bottom">

                    <span className="account-wishlist-care">
                      {product.careLevel || "Easy care"}
                    </span>

                    <Link
                      to={`/products/${product.id}`}
                      className="account-wishlist-shop"
                    >
                      <ShoppingBagIcon size={14} />
                      Add to bag
                    </Link>

                  </div>

                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="account-wishlist-empty">

            <div className="account-wishlist-empty-icon">
              <HeartIcon size={21} />
            </div>

            <p className="account-wishlist-empty-kicker">
              NOTHING SAVED YET
            </p>

            <h3>
              Your wishlist is waiting.
            </h3>

            <p>
              Save the plants you love and they'll stay here
              until you're ready to make them yours.
            </p>

            <Link to="/products">
              Discover plants
              <ArrowUpRightIcon size={15} />
            </Link>

          </div>
        )}

      </div>
    </section>
  );
}

export default AccountWishlist;
