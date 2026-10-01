import React from "react";
import "./ProductRelated.css";

import { Link } from "react-router-dom";
import { useProducts } from "../../../Context/ProductsContext";
import { getProductKey, getProductPath } from "../../../utils/products";

const RELATED_COUNT = 3;

function ProductRelatedCard({ product }) {
    
  return (
    <Link to={getProductPath(product)} className="pd-card">
      <div className="pd-card-image">
        <img
          src={product.images[0]}
          alt={product.name}
        />
      </div>

      <div className="pd-card-content">
        <h2 className="pd-related-title">
          {product.name}
        </h2>

        <p className="pd-related-price">
          ${product.price}
        </p>
      </div>
    </Link>
  );
}

// Same-category items first, then the rest of the catalog. Without a
// product (e.g. on the cart page) this is just the start of the plant catalog.
function getRelatedProducts(product, products, fertilizers) {
  if (!product) {
    return products.slice(0, RELATED_COUNT);
  }

  const catalog = product.type === "fertilizer" ? fertilizers : products;
  const others = catalog.filter(
    (item) => getProductKey(item) !== getProductKey(product)
  );

  return [
    ...others.filter((item) => item.category === product.category),
    ...others.filter((item) => item.category !== product.category),
  ].slice(0, RELATED_COUNT);
}

function ProductRelated({ product }) {
  const { plants, fertilizers } = useProducts();
  const relatedProducts = getRelatedProducts(product, plants, fertilizers);

  return (
    <section className="product-related-section">
      <div className="pd-related-head">
        <p className="pd-related-label">
          YOU MAY ALSO LIKE
        </p>

        <div className="heading-link">
          <h3>
            Complete your green space
          </h3>

          <Link to={product?.type === "fertilizer" ? "/fertilizers" : "/products"}>
             View all →
            </Link>
        </div>
      </div>

      <div className="pd-related-products">
        {relatedProducts.map((item) => (
          <ProductRelatedCard
            key={getProductKey(item)}
            product={item}
          />
        ))}
      </div>
    </section>
  );
}

export default ProductRelated;
