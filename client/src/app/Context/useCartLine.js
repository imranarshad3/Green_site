import { useCart } from "./CartContext";
import { buildCartItem } from "../utils/cart";

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
