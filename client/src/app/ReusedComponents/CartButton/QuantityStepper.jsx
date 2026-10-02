import React from "react";
import { Minus, Plus } from "lucide-react";

import "./CartButton.css";

function QuantityStepper({
  quantity,
  onDecrease,
  onIncrease,
  name = "item",
  compact = false,
  className = "",
  canIncrease = true,
}) {
  return (
    <div
      className={`cart-stepper ${compact ? "cart-stepper--compact" : ""} ${className}`}
      role="group"
      aria-label={`${name} quantity`}
    >
      <button
        type="button"
        onClick={onDecrease}
        aria-label={quantity === 1 ? `Remove ${name} from cart` : `Decrease ${name} quantity`}
      >
        <Minus size={compact ? 13 : 15} />
      </button>

      <span key={quantity} className="cart-stepper-count" aria-live="polite">
        {quantity}
      </span>

      <button
        type="button"
        onClick={onIncrease}
        disabled={!canIncrease}
        aria-label={`Increase ${name} quantity`}
      >
        <Plus size={compact ? 13 : 15} />
      </button>
    </div>
  );
}

export default QuantityStepper;
