import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Homepage from "./app/Pages/HomePage/Homepage";
import Productspage from "./app/Pages/ProductsPage/Productspage";
import ProductDetails from "./app/Pages/ProductDetails/ProductDetails";
import FertilizerPage from "./app/Pages/FertilizerPage/FertilizerPage";
import Guidepage from "./app/Pages/GuidePage/Guidepage";
import CartPage from "./app/Pages/CartPage/CartPage";
import SearchPage from "./app/Pages/SearchPage/SearchPage";
import products from "./app/Pages/ProductsPage/Components/Collections/Plantify_Products/data";

import AuthPage from "./app/Pages/AuthPage/AuthPage";
import AccountPage from "./app/Pages/AccountPage/AccountPage";
import ProtectedRoute from "./app/ReusedComponents/ProtectedRoute/ProtectedRoute";
import { SignedIn, RedirectToSignIn } from "@clerk/clerk-react";
import OrdersPage from "./app/Pages/OrdersPage/OrdersPage";
import WishlistPage from "./app/Pages/WishlistPage/WishListPage";
import UserAccount from "./app/Pages/UserAccount/UserAccount";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/products" element={<Productspage />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/fertilizers" element={<FertilizerPage />} />
        <Route path="/guide" element={<Guidepage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/search" element={<SearchPage products={products} />} />
        <Route path="/auth" element={<AuthPage />} />
        accounts <Route path="/orders" element={<OrdersPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/accounts" element={<UserAccount />} />
        <Route path="/products/fertilizer/:id" element={<ProductDetails />} />
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <AccountPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
