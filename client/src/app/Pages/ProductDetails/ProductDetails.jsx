import React from "react";

import { useLocation, useParams } from "react-router-dom";

import Navbar from "../../ReusedComponents/Navbar/Navbar";

import ProductHero from "./ProductHero/ProductHero";

import { getProductKey } from "../../utils/products";
import { useProducts } from "../../Context/ProductsContext";

import ProductSpecs from "./ProductSpecs/ProductSpecs";
import ProductStory from "./ProductStory/ProductStory";
import ProductRelated from "./ProductRelated/ProductRelated";
import ProductReviews from "./ProductReviews/ProductReviews";
import SiteFooter from "./SiteFooter/SiteFooter";

function ProductDetails() {
  const { id } = useParams();
  const location = useLocation();
  const { findProduct, loading } = useProducts();

  const isFertilizer = location.pathname.includes("/fertilizer");

  const product = findProduct(isFertilizer ? "fertilizer" : "plant", id);

  if (!product) {
    return (
      <div className="product-details">
        <Navbar />

        <p>{loading ? "Loading…" : "Product not found."}</p>
      </div>
    );
  }

  return (
    <div className="product-details">

      <Navbar />

      <ProductHero key={getProductKey(product)} product={product} />

      {!isFertilizer && <ProductSpecs product={product} />}

      {!isFertilizer && <ProductStory product={product} />}

      <ProductReviews key={getProductKey(product)} product={product} />

      <ProductRelated product={product} />

      <SiteFooter />

    </div>
  );
}

export default ProductDetails;
