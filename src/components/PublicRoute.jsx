// components/PublicRoute.js
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const auth = useSelector((state) => state.auth);


  // Agar user already logged in hai
  if (auth.token && auth.isAuthenticated) {
    // Redirect to appropriate dashboard based on role
    let redirectPath = "/";
    
    switch(auth?.user?.data?.role) {
      case "patient":
        redirectPath = "/patient/dashboard";
        break;
      case "doctor":
        redirectPath = "/doctor/dashboard";
        break;
      case "admin":
        redirectPath = "/admin/dashboard";
        break;
      default:
        redirectPath = "/";
    }
    
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default PublicRoute;