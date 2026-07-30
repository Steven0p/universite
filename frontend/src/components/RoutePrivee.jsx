import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function RoutePrivee({ children }) {
  const { utilisateur } = useAuth();
  if (!utilisateur) return <Navigate to="/admin/login" replace />;
  return children;
}
