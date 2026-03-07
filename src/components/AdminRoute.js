import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { currentUser, userData } = useAuth();

  if (!currentUser) {
    return <Navigate to="/signin" replace />;
  }

  if (userData?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
