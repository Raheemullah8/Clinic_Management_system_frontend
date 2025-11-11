import { useSelector } from "react-redux";
import { useLocation, Navigate } from "react-router-dom";

const ProtectedRoute = ({children,requirRole}) =>{
    const auth = useSelector((state)=> state.auth);
    const location = useLocation();

    if(!auth.token || !auth.isAuthenticated){
        return <Navigate to={"/login"} state={{ from: location }} replace />
    }
    if(requirRole && auth.user.data.role !== requirRole){
          return <Navigate to="/unauthorized" replace />;
    }
    return children

}

export default ProtectedRoute