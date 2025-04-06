import { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { account } from "../lib/appwrite";
import { toast } from "react-toastify";

export default function Callback() {
  const { CreateEmailPasswordSession } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        setLoading(true);
        
        // Extract userId and secret from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get('userId');
        const secret = urlParams.get('secret');
          
        if (!userId || !secret) {
          throw new Error("Missing authentication parameters");
        }
  
        await CreateEmailPasswordSession(userId, secret);
      } catch (err) {
        console.error("Authentication error:", err);
        setError(`Authentication failed: ${err.message}`);
        toast.error("Login failed. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    handleCallback();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-[#fafafa]">
        <p>Processing your login...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen ">
        <p className="text-red-500">{error}</p>
        <a href="/sign-in" className="text-blue-500 ml-2">Go back to sign in</a>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen text-[#fafafa]">
      <p>Authentication successful! Redirecting...</p>
    </div>
  );
}