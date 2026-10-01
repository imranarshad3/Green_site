import React, { useState } from "react";

import { useCartLine } from "../../Context/useCartLine";
import QuantityStepper from "./QuantityStepper";
import "./CartButton.css";

// Add-to-cart button that, once the product is in the cart, disables itself
// and shows a stepper controlling that cart line's quantity. Pressing − at 1
// removes the line and brings the button back.
function CartButton({
  product,
  options,
  label = "Add to cart",
  inCartLabel = "In cart ✓",
  icon = null,
  className = "",
  buttonClassName = "",
  compact = false,
}) {
  const { cartItem, quantity, add, increase, decrease } = useCartLine(
    product,
    options
  );
  const [popping, setPopping] = useState(false);

  const handleAdd = () => {
    add();
    setPopping(true);
  };

  return (
    <div
      className={`cart-control ${cartItem ? "is-in-cart" : ""} ${className}`}
    >
      <button
        type="button"
        className={`cart-control-add ${buttonClassName} ${popping ? "cart-pop" : ""}`}
        onClick={handleAdd}
        onAnimationEnd={() => setPopping(false)}
        disabled={Boolean(cartItem)}
      >
        {icon}
        {cartItem ? inCartLabel : label}
      </button>

      {cartItem && (
        <QuantityStepper
          quantity={quantity}
          onDecrease={decrease}
          onIncrease={increase}
          name={product.name}
          compact={compact}
        />
      )}
    </div>
  );
}

export default CartButton;
