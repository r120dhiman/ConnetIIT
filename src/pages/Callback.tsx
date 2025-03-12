import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { getCurrentUser } from '../lib/appwrite/auth';

export default function Callback() {
  const navigate = useNavigate();

  useEffect(() => {
    const verifySession = async () => {
      const user = await getCurrentUser();
      console.log(user, "user");
      
      if (user) {
        navigate('/profile'); // Redirect to profile if authenticated
      } else {
        navigate('/sign-in');
      }
    };
    verifySession();
  }, [navigate]);

  return <div>Verifying your session...</div>;
}
