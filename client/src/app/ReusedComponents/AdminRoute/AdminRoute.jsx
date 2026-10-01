import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import NotFoundPage from "../../Pages/NotFoundPage/NotFoundPage";
import { useIsAdmin } from "../../Context/useIsAdmin";

function AdminOnly({ children }) {
  const { isAdmin, loading } = useIsAdmin();

  if (loading) {
    return null;
  }

  return isAdmin ? children : <NotFoundPage />;
}

function AdminRoute({ children }) {
  return (
    <ProtectedRoute>
      <AdminOnly>{children}</AdminOnly>
    </ProtectedRoute>
  );
}

export default AdminRoute;
