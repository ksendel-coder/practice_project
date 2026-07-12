import { Navigate } from 'react-router-dom';
import { useUserContext } from '../Contexts/UserContext';

interface ProtectedPages {
  children: React.ReactNode;
}

function ProtectedRoute({ children }: ProtectedPages) {
  const { isAuth } = useUserContext();

  if (!isAuth) {
    return <Navigate to="/createUser" replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;