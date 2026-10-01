import React, { useEffect } from "react";

import { useLocation, useParams } from "react-router-dom";

import Navbar from "../../ReusedComponents/Navbar/Navbar";

import ProductHero from "./ProductHero/ProductHero";

import {
  products,
} from "../ProductsPage/Components/Collections/Plantify_Products/data";

import { fertilizers } from "../FertilizerPage/data/fertilizerData";

import ProductSpecs from "./ProductSpecs/ProductSpecs";
import ProductStroy from "./ProductStory/ProductStroy";
import ProductRelated from "./ProductRelated/ProductRelated";
import SiteFooter from "./SiteFooter/SiteFooter";

function ProductDetails() {

  const { id } = useParams();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const isFertilizer = location.pathname.includes("/fertilizer");

  const product = isFertilizer
    ? fertilizers.find(
        (item) => String(item.id) === String(id)
      )
    : products.find(
        (item) => String(item.id) === String(id)
      );

  if (!product) {
    return (
      <div className="product-details">
        <Navbar />

        <p>Product not found.</p>
      </div>
    );
  }

  return (
    <div className="product-details">

      <Navbar />

      <ProductHero product={product} />

      <ProductSpecs />

      <ProductStroy />

      <ProductRelated />

      <SiteFooter />

    </div>
  );
}

export default ProductDetails;
