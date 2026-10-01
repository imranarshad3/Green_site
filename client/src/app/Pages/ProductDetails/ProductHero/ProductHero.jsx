import { useState } from "react";

import {
  Heart,
  Minus,
  Plus,
  ShoppingBag,
  Truck,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";

import { useCartLine } from "../../../Context/useCartLine";
import "../../../ReusedComponents/CartButton/CartButton.css";
import { useWishlist } from "../../../Context/WishlistContext";
import {
  DEFAULT_POT_STYLE,
  DEFAULT_SIZE,
  PLANT_SIZES,
  POT_STYLES,
} from "../../../utils/cart";
import "./ProductHero.css";
import { GUARANTEE_DAYS, RETURN_DAYS } from "../../../utils/storeInfo";

const ProductHero = ({ product }) => {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const liked = product ? isWishlisted(product) : false;

  const [selectedImage, setSelectedImage] = useState(
    product?.images?.[0] || ""
  );

  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState(DEFAULT_SIZE);
  const [potStyle, setPotStyle] = useState(DEFAULT_POT_STYLE);
  const [popping, setPopping] = useState(false);

  const cartLine = useCartLine(product, { size, potStyle });
  const inCart = Boolean(cartLine.cartItem);
  const shownQuantity = inCart ? cartLine.quantity : quantity;

  const increaseQuantity = () => {
    if (inCart) {
      cartLine.increase();
    } else {
      setQuantity((prev) => prev + 1);
    }
  };

  const decreaseQuantity = () => {
    if (inCart) {
      cartLine.decrease();
    } else {
      setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
    }
  };

  const discountPercentage =
    product?.oldPrice && product.oldPrice > product.price
      ? Math.round(
          ((product.oldPrice - product.price) / product.oldPrice) * 100
        )
      : null;

  const hasPlantOptions = product?.type !== "fertilizer";

  const handleAddToCart = () => {
    cartLine.add(quantity);
    setQuantity(1);
    setPopping(true);
  };

  return (
    <section className="producthero">
      <div className="producthero-container">
        <div className="productgallery">
          <div className="productthumbnails">
            {product?.images?.map((image, index) => (
              <button
                key={index}
                type="button"
                className={`thumbnaill ${
                  selectedImage === image ? "active" : ""
                }`}
                onClick={() => setSelectedImage(image)}
              >
                <img
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                />
              </button>
            ))}
          </div>

          <div className="product-main-image">
            <img
              src={selectedImage}
              alt={product?.name}
            />
          </div>
        </div>

        <div className="ph-info">
          <p className="ph-category">
            {product?.category}
          </p>

          <h1>{product?.name}</h1>

          {product?.rating && (
          <div className="ph-rating">
            <span className="stars">
              {"★".repeat(Math.floor(product?.rating || 5))}
              {"☆".repeat(5 - Math.floor(product?.rating || 5))}
            </span>

            <span className="rating-value">
              {product?.rating}
            </span>

            <span className="separator">·</span>

            <span className="review-count">
              {product?.reviews} reviews
            </span>
          </div>
          )}

          <div className="ph-price">
            <span className="current-price">
              ${product?.price}
            </span>

            {product?.oldPrice && (
              <>
                <span className="old-price">
                  ${product.oldPrice}
                </span>

                {discountPercentage && (
                  <span className="discount-badge">
                    {discountPercentage}% OFF
                  </span>
                )}
              </>
            )}
          </div>

          <p className="product-description">
            {product?.description || product?.desc}
          </p>

          <div className="product-divider"></div>

          {hasPlantOptions && (
          <>
          <div className="product-option">
            <div className="option-header">
              <h3>Plant Size</h3>

              <span className="option-hint">
                Choose your size
              </span>
            </div>

            <div className="size-options">
              {PLANT_SIZES.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={`size-option ${
                    size === item ? "active" : ""
                  }`}
                  onClick={() => setSize(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="product-option">
            <h3>Pot Style</h3>

            <div className="size-options">
              {POT_STYLES.map((style) => (
                <button
                  key={style}
                  type="button"
                  className={`size-option ${
                    potStyle === style ? "active" : ""
                  }`}
                  onClick={() => setPotStyle(style)}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>
          </>
          )}

          <div className="productactions">
            <div className={`ph-quantity ${inCart ? "is-in-cart" : ""}`}>
              <button
                type="button"
                onClick={decreaseQuantity}
                aria-label={
                  inCart && shownQuantity === 1
                    ? "Remove from cart"
                    : "Decrease quantity"
                }
              >
                <Minus size={16} />
              </button>

              <span key={shownQuantity} className="cart-stepper-count">
                {shownQuantity}
              </span>

              <button
                type="button"
                onClick={increaseQuantity}
                aria-label="Increase quantity"
              >
                <Plus size={16} />
              </button>
            </div>

            <button
              type="button"
              className={`addto-cart ${popping ? "cart-pop" : ""}`}
              onClick={handleAddToCart}
              onAnimationEnd={() => setPopping(false)}
              disabled={inCart}
            >
              <ShoppingBag size={19} />
              <span>{inCart ? "In cart ✓" : "Add to Cart →"}</span>
            </button>

            <button
              type="button"
              className={`wishlistbutton ${
                liked ? "liked" : ""
              }`}
              onClick={() => toggleWishlist(product)}
              aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart
                size={21}
                fill={liked ? "currentColor" : "none"}
              />
            </button>
          </div>

          <div className="product-benefits">
            <div className="benefit">
              <Truck size={21} />

              <div>
                <strong>Free delivery</strong>
                <span>Orders over $50</span>
              </div>
            </div>

            <div className="benefit">
              <ShieldCheck size={21} />

              <div>
                <strong>Plant guarantee</strong>
                <span>{GUARANTEE_DAYS}-day healthy plant promise</span>
              </div>
            </div>

            <div className="benefit">
              <RotateCcw size={21} />

              <div>
                <strong>Easy returns</strong>
                <span>Hassle-free within {RETURN_DAYS} days</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductHero;

