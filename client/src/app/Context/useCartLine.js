import { useCart } from "./CartContext";
import { buildCartItem } from "../utils/cart";

// The cart line a product (with the given size/pot options) maps to, plus
// actions scoped to that line. `cartItem` is undefined until it's added.
export function useCartLine(product, options) {
  const { cartItems, addToCart, increaseQuantity, decreaseQuantity } =
    useCart();

  const item = buildCartItem(product, options);
  const cartItem = cartItems.find(
    (cartLine) => cartLine.cartItemId === item.cartItemId
  );

  return {
    cartItem,
    quantity: cartItem?.quantity ?? 0,
    add: (quantity = 1) => addToCart({ ...item, quantity }),
    increase: () => increaseQuantity(item.cartItemId),
    decrease: () => decreaseQuantity(item.cartItemId),
  };
}
