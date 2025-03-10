import React from 'react';
import { Link } from 'react-router';
import { SignUpForm } from '../components/auth/SignUpForm';
import { Laptop } from 'lucide-react';

export function SignUp() {
  return (
    <div className="max-w-md mx-auto mt-8">
      <div className="text-center mb-8">
        <Laptop className="h-12 w-12 mx-auto text-primary" />
        <h1 className="text-2xl font-bold mt-4">Join ConnectIT</h1>
        <p className="text-gray-600 mt-2">Create your account to get started</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <SignUpForm />
        
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/sign-in" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}