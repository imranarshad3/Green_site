import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, useClerk } from "@clerk/clerk-react";

import Navbar from "../../ReusedComponents/Navbar/Navbar";

import CartHeading from "./CartHeading/CartHeading";
import CartLayout from "./CartLayout/CartLayout";
import EmptyCart from "./EmptyCart/EmptyCart";
import ProductRelated from "../ProductDetails/ProductRelated/ProductRelated";
import CartFooter from "./CartFooter/CartFooter";

import { useCart } from "../../Context/CartContext";
import { useOrders } from "../../Context/OrdersContext";

function CartPage() {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();
  const { openSignIn } = useClerk();
  const [checkingOut, setCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);

  const {
    cartItems,
    cartCount,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    resetCart,
  } = useCart();

  const { placeOrder } = useOrders();

  const hasItems = cartItems.length > 0;

  const handleCheckout = async () => {
    if (!isSignedIn) {
      openSignIn();
      return;
    }

    setCheckingOut(true);
    setCheckoutError(null);

    try {
      const order = await placeOrder();
      resetCart();
      navigate("/orders", { state: { placedOrder: order?.order_number ?? null } });
    } catch (error) {
      setCheckoutError(error.message || "Checkout failed. Please try again.");
    } finally {
      setCheckingOut(false);
    }
  };

  return (
    <div className="cart-page">
      <Navbar />

      {hasItems ? (
        <>
          <CartHeading
            plantCount={cartCount}
          />

          <CartLayout
            cartItems={cartItems}
            onIncrease={increaseQuantity}
            onDecrease={decreaseQuantity}
            onRemove={removeFromCart}
            onCheckout={handleCheckout}
            checkingOut={checkingOut}
            checkoutError={checkoutError}
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
