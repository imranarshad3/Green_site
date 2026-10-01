import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./app/Pages/HomePage/HomePage";
import ProductsPage from "./app/Pages/ProductsPage/ProductsPage";
import ProductDetails from "./app/Pages/ProductDetails/ProductDetails";
import FertilizerPage from "./app/Pages/FertilizerPage/FertilizerPage";
import GuidePage from "./app/Pages/GuidePage/GuidePage";
import CartPage from "./app/Pages/CartPage/CartPage";
import SearchPage from "./app/Pages/SearchPage/SearchPage";

import AuthPage from "./app/Pages/AuthPage/AuthPage";
import ProtectedRoute from "./app/ReusedComponents/ProtectedRoute/ProtectedRoute";
import OrdersPage from "./app/Pages/OrdersPage/OrdersPage";
import WishlistPage from "./app/Pages/WishlistPage/WishlistPage";
import UserAccount from "./app/Pages/UserAccount/UserAccount";
import NotFoundPage from "./app/Pages/NotFoundPage/NotFoundPage";
import AdminPage from "./app/Pages/AdminPage/AdminPage";
import AdminRoute from "./app/ReusedComponents/AdminRoute/AdminRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/products/fertilizer/:id" element={<ProductDetails />} />
        <Route path="/fertilizers" element={<FertilizerPage />} />
        <Route path="/guide" element={<GuidePage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <OrdersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <WishlistPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <UserAccount />
            </ProtectedRoute>
          }
        />
        <Route path="/accounts" element={<Navigate to="/account" replace />} />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
