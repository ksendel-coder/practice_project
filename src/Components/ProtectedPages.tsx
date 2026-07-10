import { Navigate, Outlet } from 'react-router-dom';
import { useUserContext } from '../Contexts/UserContext';

function ProtectedPages() {
  const { isAuth } = useUserContext();

  if (isAuth) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}

export default ProtectedPages;