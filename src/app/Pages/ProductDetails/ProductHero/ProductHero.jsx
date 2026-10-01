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

import { useCart } from "../../../Context/CartContext";
import "./ProductHero.css";

const ProductHero = ({ product }) => {
  const { addToCart } = useCart();

  const [selectedImage, setSelectedImage] = useState(
    product?.images?.[0] || ""
  );

  const [quantity, setQuantity] = useState(1);
  const [liked, setLiked] = useState(false);
  const [size, setSize] = useState("Medium");
  const [potStyle, setPotStyle] = useState("Ivory");

  const sizes = ["Small", "Medium", "Large"];
  const potStyles = ["Ivory", "Sand", "Charcoal"];

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const discountPercentage =
    product?.oldPrice && product.oldPrice > product.price
      ? Math.round(
          ((product.oldPrice - product.price) / product.oldPrice) * 100
        )
      : null;

  const handleAddToCart = () => {
    if (!product) return;

    const cartProduct = {
      ...product,
      cartItemId: `${product.id}-${size}-${potStyle}`,
      selectedSize: size,
      selectedPotStyle: potStyle,
      quantity: quantity,
    };

    addToCart(cartProduct);

    setQuantity(1);
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

        <div className="product-info">
          <p className="product-category">
            {product?.category}
          </p>

          <h1>{product?.name}</h1>

          <div className="product-rating">
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

          <div className="product-price">
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

          <div className="product-option">
            <div className="option-header">
              <h3>Plant Size</h3>

              <span className="option-hint">
                Choose your size
              </span>
            </div>

            <div className="size-options">
              {sizes.map((item) => (
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
              {potStyles.map((style) => (
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

          <div className="productactions">
            <div className="quantity-control">
              <button
                type="button"
                onClick={decreaseQuantity}
                aria-label="Decrease quantity"
              >
                <Minus size={16} />
              </button>

              <span>{quantity}</span>

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
              className="addto-cart"
              onClick={handleAddToCart}
            >
              <ShoppingBag size={19} />
              <span>Add to Cart →</span>
            </button>

            <button
              type="button"
              className={`wishlistbutton ${
                liked ? "liked" : ""
              }`}
              onClick={() => setLiked((prev) => !prev)}
              aria-label="Add to wishlist"
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
                <span>30-day healthy plant promise</span>
              </div>
            </div>

            <div className="benefit">
              <RotateCcw size={21} />

              <div>
                <strong>Easy returns</strong>
                <span>Hassle-free within 14 days</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductHero;

