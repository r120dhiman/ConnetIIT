// import React from 'react';
// import { Link } from 'react-router';
import { SignInForm } from '../components/auth/SignInForm';
import { Laptop } from 'lucide-react';

export function SignIn() {
  return (
    <div className='w-full h-screen flex justify-center items-center'>
    <div className="max-w-md mx-auto shadow-md">
      <div className="text-center mb-8">
        <Laptop className="h-12 w-12 mx-auto text-[#FE744D]" />
        <h1 className="text-2xl font-bold mt-4 text-[#fafafa]">Welcome back to Connect<span className='text-[#FE744D]'>IIT</span></h1>
        <p className="text-zinc-400 mt-2">Please sign in using your institute email ID.</p>
      </div>
      {/* <p className="mt-4 text-center text-sm text-gray-600">
         Getting Problem SignIn after SignUp{' '}
            <a href="/" className="text-primary hover:underline font-medium transition-colors duration-200 ease-in-out">
            Move to Home
            </a>
        </p> */}

      <div className=" p-6 rounded-lg shadow-md mb-20">
        <SignInForm />
        
        {/* <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/sign-up" className="text-primary hover:underline">
            Sign up
          </Link>
        </p> */}
        
      </div>
    </div>
    </div>
  );
}