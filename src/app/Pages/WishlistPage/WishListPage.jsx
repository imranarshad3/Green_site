import React, { useState } from "react";

import Navbar from "../../ReusedComponents/Navbar/Navbar";
import SiteFooter from "../ProductDetails/SiteFooter/SiteFooter";

import WishlistHeader from "./WishListHeader/WishlistHeader";
import WishlistToolbar from "./WishlistToolbar/WishlistToolbar";
import WishlistGrid from "./WishlistGrid/WishlistGrid";
import EmptyWishlist from "./EmptyWishlist/EmptyWishlist";

import { wishlistProducts } from "./data/wishlistData";

import "./WishListPage.css";
import WishListRitual from "./WishlistRitual/WishListRitual";

function WishlistPage() {
  const [products, setProducts] = useState(wishlistProducts);
  const [sort, setSort] = useState("latest");

  const removeProduct = (id) => {
    setProducts((current) =>
      current.filter((product) => product.id !== id)
    );
  };

  const sortedProducts = [...products].sort((a, b) => {
    if (sort === "low") {
      return a.price - b.price;
    }

    if (sort === "high") {
      return b.price - a.price;
    }

    return b.id - a.id;
  });

  return (
    <div className="wishlist-page">

      <Navbar />

      <main className="wishlist-main">

        <WishlistHeader count={products.length} />

        {products.length > 0 ? (
          <>
            <WishlistToolbar
              count={products.length}
              sort={sort}
              setSort={setSort}
            />

            <WishlistGrid
              products={sortedProducts}
              removeProduct={removeProduct}
            />

            <WishListRitual />
          </>
        ) : (
          <EmptyWishlist />
        )}

      </main>

      <SiteFooter />

    </div>
  );
}

export default WishlistPage;
