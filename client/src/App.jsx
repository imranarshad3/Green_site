import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./app/Pages/HomePage/HomePage";
import ProtectedRoute from "./app/ReusedComponents/ProtectedRoute/ProtectedRoute";
import AdminRoute from "./app/ReusedComponents/AdminRoute/AdminRoute";
import NotFoundPage from "./app/Pages/NotFoundPage/NotFoundPage";

// Every page except the home page is its own chunk, loaded on first visit.
const ProductsPage = lazy(() => import("./app/Pages/ProductsPage/ProductsPage"));
const ProductDetails = lazy(() => import("./app/Pages/ProductDetails/ProductDetails"));
const FertilizerPage = lazy(() => import("./app/Pages/FertilizerPage/FertilizerPage"));
const GuidePage = lazy(() => import("./app/Pages/GuidePage/GuidePage"));
const CartPage = lazy(() => import("./app/Pages/CartPage/CartPage"));
const SearchPage = lazy(() => import("./app/Pages/SearchPage/SearchPage"));
const AuthPage = lazy(() => import("./app/Pages/AuthPage/AuthPage"));
const OrdersPage = lazy(() => import("./app/Pages/OrdersPage/OrdersPage"));
const WishlistPage = lazy(() => import("./app/Pages/WishlistPage/WishlistPage"));
const UserAccount = lazy(() => import("./app/Pages/UserAccount/UserAccount"));
const AdminPage = lazy(() => import("./app/Pages/AdminPage/AdminPage"));
const ContactPage = lazy(() => import("./app/Pages/ContactPage/ContactPage"));
const FaqPage = lazy(() => import("./app/Pages/FaqPage/FaqPage"));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="page-loading" aria-busy="true" />}>
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
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/shipping" element={<Navigate to="/faq#delivery" replace />} />
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
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
