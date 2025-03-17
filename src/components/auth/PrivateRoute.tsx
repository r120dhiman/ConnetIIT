import { Navigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';

export function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading,userProfile } = useAuth();
  

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return user ? <>{children}</> : <Navigate to="/sign-in" />;
}