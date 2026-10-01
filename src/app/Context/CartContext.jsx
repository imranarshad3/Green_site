import React, { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

const getCartItemId = (item) => {
  return (
    item.cartItemId ||
    `${item.id}-${item.selectedSize || "default"}-${item.selectedPotStyle || "default"}`
  );
};

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem("plantify-cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("plantify-cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    const newItem = {
      ...product,
      quantity: Number(product.quantity) || 1,
      cartItemId: getCartItemId(product),
    };

    setCartItems((previousItems) => {
      const existingItem = previousItems.find(
        (item) => getCartItemId(item) === newItem.cartItemId
      );

      if (existingItem) {
        return previousItems.map((item) =>
          getCartItemId(item) === newItem.cartItemId
            ? {
                ...item,
                quantity: item.quantity + newItem.quantity,
              }
            : item
        );
      }

      return [...previousItems, newItem];
    });
  };

  const removeFromCart = (cartItemId) => {
    setCartItems((previousItems) =>
      previousItems.filter(
        (item) => getCartItemId(item) !== cartItemId
      )
    );
  };

  const increaseQuantity = (cartItemId) => {
    setCartItems((previousItems) =>
      previousItems.map((item) =>
        getCartItemId(item) === cartItemId
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  };

  const decreaseQuantity = (cartItemId) => {
    setCartItems((previousItems) =>
      previousItems
        .map((item) =>
          getCartItemId(item) === cartItemId
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce(
    (total, item) => total + Number(item.quantity || 0),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}
