import React, { useState } from "react";

import { useCartLine } from "../../Context/useCartLine";
import { getAvailabilityLabel, isPurchasable } from "../../utils/products";
import QuantityStepper from "./QuantityStepper";
import "./CartButton.css";

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
  const unavailableLabel = isPurchasable(product)
    ? null
    : getAvailabilityLabel(product);

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
        disabled={Boolean(cartItem) || Boolean(unavailableLabel)}
      >
        {!unavailableLabel && icon}
        {cartItem ? inCartLabel : unavailableLabel ?? label}
      </button>

      {cartItem && (
        <QuantityStepper
          quantity={quantity}
          onDecrease={decrease}
          onIncrease={increase}
          name={product.name}
          compact={compact}
          canIncrease={quantity < product.stock}
        />
      )}
    </div>
  );
}

export default CartButton;
