export const FREE_DELIVERY_MIN = 50;
export const DELIVERY_FEE = 6;
export const DISCOUNT_MIN = 60;
export const DISCOUNT_AMOUNT = 9;

export function getCartTotals(cartItems) {
  const subtotal = cartItems.reduce(
    (total, item) => total + Number(item.price) * Number(item.quantity),
    0
  );

  const discount = subtotal >= DISCOUNT_MIN ? DISCOUNT_AMOUNT : 0;
  const delivery = subtotal >= FREE_DELIVERY_MIN ? 0 : DELIVERY_FEE;

  return {
    subtotal,
    discount,
    delivery,
    total: subtotal - discount + delivery,
    remainingForFreeDelivery: Math.max(0, FREE_DELIVERY_MIN - subtotal),
  };
}

export const PLANT_SIZES = ["Small", "Medium", "Large"];
export const POT_STYLES = ["Ivory", "Sand", "Charcoal"];
export const DEFAULT_SIZE = "Medium";
export const DEFAULT_POT_STYLE = "Ivory";

// Identifies one cart line: a product plus its size/pot options. Fertilizers
// have no options, so they get one line per product.
export const getCartItemId = (product, size, potStyle) =>
  product.type === "fertilizer"
    ? `${product.type}-${product.id}`
    : `${product.type}-${product.id}-${size}-${potStyle}`;

// Builds the item passed to addToCart.
export function buildCartItem(
  product,
  { size = DEFAULT_SIZE, potStyle = DEFAULT_POT_STYLE, quantity = 1 } = {}
) {
  if (product.type === "fertilizer") {
    return {
      ...product,
      cartItemId: getCartItemId(product),
      quantity,
    };
  }

  return {
    ...product,
    cartItemId: getCartItemId(product, size, potStyle),
    selectedSize: size,
    selectedPotStyle: potStyle,
    quantity,
  };
}
