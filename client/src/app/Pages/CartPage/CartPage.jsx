import React, { useState } from "react";
import { useAuth, useClerk } from "@clerk/clerk-react";

import Navbar from "../../ReusedComponents/Navbar/Navbar";

import CartHeading from "./CartHeading/CartHeading";
import CartLayout from "./CartLayout/CartLayout";
import EmptyCart from "./EmptyCart/EmptyCart";
import ProductRelated from "../ProductDetails/ProductRelated/ProductRelated";
import CartFooter from "./CartFooter/CartFooter";
import CheckoutDialog from "../../ReusedComponents/CheckoutDialog/CheckoutDialog";

import { useCart } from "../../Context/CartContext";
import { useOrders } from "../../Context/OrdersContext";

function CartPage() {
  const { isSignedIn } = useAuth();
  const { openSignIn } = useClerk();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [promo, setPromo] = useState(null);

  const {
    cartItems,
    cartCount,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    resetCart,
  } = useCart();

  const { placeOrder, checkPromo } = useOrders();

  const hasItems = cartItems.length > 0;

  const handleCheckout = () => {
    if (!isSignedIn) {
      openSignIn();
      return;
    }

    setCheckoutOpen(true);
  };

  const applyPromo = async (code, subtotal) => {
    setPromo(await checkPromo(code, subtotal));
  };

  const checkoutLines = cartItems.map((item) => ({
    key: item.cartItemId,
    name: item.name,
    image: item.images?.[0],
    options: [item.selectedSize, item.selectedPotStyle && `${item.selectedPotStyle} pot`]
      .filter(Boolean)
      .join(" · "),
    price: item.price,
    quantity: item.quantity,
  }));

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
            promo={promo}
            onApplyPromo={applyPromo}
            onRemovePromo={() => setPromo(null)}
          />

          {checkoutOpen && (
            <CheckoutDialog
              lines={checkoutLines}
              initialPromo={promo}
              onClose={() => setCheckoutOpen(false)}
              onPlace={placeOrder}
              onPlaced={() => {
                resetCart();
                setPromo(null);
              }}
            />
          )}

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
