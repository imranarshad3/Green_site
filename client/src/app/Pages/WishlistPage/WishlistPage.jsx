import React, { useState } from "react";

import Navbar from "../../ReusedComponents/Navbar/Navbar";
import SiteFooter from "../ProductDetails/SiteFooter/SiteFooter";

import WishlistHeader from "./WishlistHeader/WishlistHeader";
import WishlistToolbar from "./WishlistToolbar/WishlistToolbar";
import WishlistGrid from "./WishlistGrid/WishlistGrid";
import EmptyWishlist from "./EmptyWishlist/EmptyWishlist";

import { useWishlist } from "../../Context/WishlistContext";

import "./WishlistPage.css";
import WishlistRitual from "./WishlistRitual/WishlistRitual";

function WishlistPage() {
  const { wishlistProducts: products, removeFromWishlist } = useWishlist();
  const [sort, setSort] = useState("latest");

  const sortedProducts = [...products].reverse().sort((a, b) => {
    if (sort === "low") {
      return a.price - b.price;
    }

    if (sort === "high") {
      return b.price - a.price;
    }

    return 0;
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
              removeProduct={removeFromWishlist}
            />

            <WishlistRitual />
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
