import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, ROLES } from 'context/AuthContext';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

const Signup = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const nameRef = useRef();
  const { signup } = useAuth();
  const [role, setRole] = useState(ROLES.TENANT);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError('Passwords do not match');
    }

    try {
      setError('');
      setLoading(true);
      
      // Create the user in Firebase Auth
      const userCredential = await signup(emailRef.current.value, passwordRef.current.value, role);
      
      // Save the user data in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email: emailRef.current.value,
        name: nameRef.current.value,
        role: role,
        onboardingComplete: false,
        createdAt: new Date().toISOString()
      });
      
      navigate('/onboarding');
    } catch (error) {
      setError('Failed to create an account: ' + error.message);
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="name" className="sr-only">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Full Name"
                ref={nameRef}
              />
            </div>
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                ref={emailRef}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                ref={passwordRef}
              />
            </div>
            <div>
              <label htmlFor="password-confirm" className="sr-only">
                Confirm Password
              </label>
              <input
                id="password-confirm"
                name="password-confirm"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Confirm Password"
                ref={passwordConfirmRef}
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Select your role</label>
            <div className="mt-2 space-y-2">
              <div className="flex items-center">
                <input
                  id="role-tenant"
                  name="role"
                  type="radio"
                  checked={role === ROLES.TENANT}
                  onChange={() => setRole(ROLES.TENANT)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <label htmlFor="role-tenant" className="ml-3 block text-sm font-medium text-gray-700">
                  Tenant
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="role-landlord"
                  name="role"
                  type="radio"
                  checked={role === ROLES.LANDLORD}
                  onChange={() => setRole(ROLES.LANDLORD)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <label htmlFor="role-landlord" className="ml-3 block text-sm font-medium text-gray-700">
                  Landlord
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="role-contractor"
                  name="role"
                  type="radio"
                  checked={role === ROLES.CONTRACTOR}
                  onChange={() => setRole(ROLES.CONTRACTOR)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <label htmlFor="role-contractor" className="ml-3 block text-sm font-medium text-gray-700">
                  Contractor
                </label>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign up
            </button>
          </div>
        </form>
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup; 