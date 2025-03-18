import { Navigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';

export function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, userProfile } = useAuth();

  if (loading) return <div>Loading...</div>; // Prevent flickering

  if (!user) return <Navigate to="/sign-in" replace />;

  console.log(userProfile,"up PR");
  
  if (user && !userProfile?.isOnBoarded) return <Navigate to="/onboarding" replace />;

  return children;

  // return user ? <>{children}</> : <Navigate to="/sign-in" />;
}