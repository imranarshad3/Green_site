import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { SupabaseProvider } from "./app/Context/SupabaseProvider";
import { ProductsProvider } from "./app/Context/ProductsProvider";
import { CartProvider } from "./app/Context/CartProvider";
import { WishlistProvider } from "./app/Context/WishlistProvider";
import { OrdersProvider } from "./app/Context/OrdersProvider";
import { ClerkProvider } from "@clerk/clerk-react";
import "./styles/base.css";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key");
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <SupabaseProvider>
        <ProductsProvider>
          <CartProvider>
            <WishlistProvider>
              <OrdersProvider>
                <App />
              </OrdersProvider>
            </WishlistProvider>
          </CartProvider>
        </ProductsProvider>
      </SupabaseProvider>
    </ClerkProvider>
  </React.StrictMode>
);
