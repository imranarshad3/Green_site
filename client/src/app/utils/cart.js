export const FREE_DELIVERY_MIN = 50;
export const DELIVERY_FEE = 6;
export const DISCOUNT_MIN = 60;
export const DISCOUNT_AMOUNT = 9;

export function getPromoDiscount(promo, subtotal) {
  if (!promo || subtotal < promo.minSubtotal) return 0;

  const amount =
    promo.kind === "percent"
      ? Math.round(subtotal * promo.amount) / 100
      : promo.amount;

  return Math.min(amount, subtotal);
}

export const toPromo = (row) => ({
  code: row.code,
  kind: row.kind,
  amount: Number(row.amount),
  minSubtotal: Number(row.min_subtotal),
});

export const describePromo = (promo) =>
  promo.kind === "percent" ? `${promo.amount}% off` : `$${promo.amount.toFixed(2)} off`;

export function getCartTotals(cartItems, promo = null) {
  const subtotal = cartItems.reduce(
    (total, item) => total + Number(item.price) * Number(item.quantity),
    0
  );

  const promoDiscount = getPromoDiscount(promo, subtotal);
  const discount = Math.min(
    (subtotal >= DISCOUNT_MIN ? DISCOUNT_AMOUNT : 0) + promoDiscount,
    subtotal
  );
  const delivery = subtotal >= FREE_DELIVERY_MIN ? 0 : DELIVERY_FEE;

  return {
    subtotal,
    promoDiscount,
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

export const getCartItemId = (product, size, potStyle) =>
  product.type === "fertilizer"
    ? `${product.type}-${product.id}`
    : `${product.type}-${product.id}-${size}-${potStyle}`;

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
