import React from 'react';
import { Link } from 'react-router';
import { SignInForm } from '../components/auth/SignInForm';
import { Laptop } from 'lucide-react';

export function SignIn() {
  return (
    <div className="max-w-md mx-auto mt-8">
      <div className="text-center mb-8">
        <Laptop className="h-12 w-12 mx-auto text-primary" />
        <h1 className="text-2xl font-bold mt-4">Welcome back to ConnectIT</h1>
        <p className="text-gray-600 mt-2">Sign in to continue to your account</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <SignInForm />
        
        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/sign-up" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}