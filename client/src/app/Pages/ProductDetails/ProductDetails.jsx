import React, { useEffect } from "react";

import { useLocation, useParams } from "react-router-dom";

import Navbar from "../../ReusedComponents/Navbar/Navbar";

import ProductHero from "./ProductHero/ProductHero";

import { getProductKey } from "../../utils/products";
import { useProducts } from "../../Context/ProductsContext";

import ProductSpecs from "./ProductSpecs/ProductSpecs";
import ProductStory from "./ProductStory/ProductStory";
import ProductRelated from "./ProductRelated/ProductRelated";
import SiteFooter from "./SiteFooter/SiteFooter";

function ProductDetails() {

  const { id } = useParams();
  const location = useLocation();
  const { findProduct, loading } = useProducts();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

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

      {/* Keyed so gallery/quantity state resets when moving between products. */}
      <ProductHero key={getProductKey(product)} product={product} />

      {!isFertilizer && <ProductSpecs product={product} />}

      {!isFertilizer && <ProductStory product={product} />}

      <ProductRelated product={product} />

      <SiteFooter />

    </div>
  );
}

export default ProductDetails;
