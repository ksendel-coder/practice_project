import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../Stores/Store";

interface ProtectedPages {
  children: React.ReactNode;
}

function ProtectedRoute({ children }: ProtectedPages) {
  const isAuth = useSelector((state: RootState) => state.user.isAuth);

  if (!isAuth) {
    return <Navigate to="/createUser" replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
