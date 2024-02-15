import { Navigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    if (user?.roles?.includes("USER") || user?.roles?.includes("ADMIN")) {
      return children 
    }
    // user is not authenticated
    return <Navigate to="/login" />;
}

export default ProtectedRoute