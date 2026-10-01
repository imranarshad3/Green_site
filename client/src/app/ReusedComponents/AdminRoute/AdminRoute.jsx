import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import NotFoundPage from "../../Pages/NotFoundPage/NotFoundPage";
import { useIsAdmin } from "../../Context/useIsAdmin";

function AdminOnly({ children }) {
  const { isAdmin, loading } = useIsAdmin();

  if (loading) {
    return null;
  }

  // Non-admins get the same page as a missing route.
  return isAdmin ? children : <NotFoundPage />;
}

// The real protection is row-level security in the database; this only keeps
// the admin UI out of sight.
function AdminRoute({ children }) {
  return (
    <ProtectedRoute>
      <AdminOnly>{children}</AdminOnly>
    </ProtectedRoute>
  );
}

export default AdminRoute;
