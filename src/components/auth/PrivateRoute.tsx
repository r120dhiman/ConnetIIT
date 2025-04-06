import { Navigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import Loader from '../shared/Loader';

export function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, userProfile } = useAuth();

  if (loading) return <Loader fullScreen message="Checking authorization..." />;

  if (!user) return <Navigate to="/sign-in" replace />;


  if (user && !userProfile) return <Navigate to="/sign-in" replace />;
  
  if (user && !userProfile?.isOnBoarded) return <Navigate to="/onboarding" replace />;
 
  return children;

 
}