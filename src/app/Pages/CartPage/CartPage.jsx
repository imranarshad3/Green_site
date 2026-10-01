import React from "react";

import Navbar from "../../ReusedComponents/Navbar/Navbar";

import CartHeading from "./CartHeading/CartHeading";
import CartLayout from "./CartLayout/CartLayout";
import EmptyCart from "./EmptyCart/EmptyCart";
import ProductRelated from "../ProductDetails/ProductRelated/ProductRelated";
import CartFooter from "./CartFooter/CartFooter";

function CartPage() {
  const cartItems = [];

  const hasItems = cartItems.length > 0;

  return (
    <div className="cart-page">
      <Navbar />

      {hasItems ? (
        <>
          <CartHeading
            plantCount={cartItems.length}
          />

          <CartLayout
            cartItems={cartItems}
          />

          <ProductRelated />

          <CartFooter />
        </>
      ) : (
        <EmptyCart />
      )}
    </div>
  );
}

export default CartPage;
