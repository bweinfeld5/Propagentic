import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const SignupForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState('tenant');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const navigate = useNavigate();
  const { register } = useAuth(); // Use the register function from AuthContext

  // Firebase error message mapping for user-friendly messages
  const getErrorMessage = (errorCode) => {
    const errorMessages = {
      'auth/email-already-in-use': 'An account with this email already exists.',
      'auth/invalid-email': 'Please provide a valid email address.',
      'auth/weak-password': 'Password should be at least 6 characters long.',
      'auth/network-request-failed': 'Network error. Please check your connection and try again.',
      'auth/too-many-requests': 'Too many unsuccessful attempts. Please try again later.',
      'auth/user-disabled': 'This account has been disabled. Please contact support.'
    };
    
    return errorMessages[errorCode] || 'Failed to create an account. Please try again.';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password should be at least 6 characters long');
      return;
    }
    
    // Reset error state and set loading
    setError('');
    setLoading(true);
    setSuccess(false);
    
    try {
      // Use the register function from AuthContext
      console.log('Attempting to register user with email:', email);
      await register(email, password, userType);
      console.log('User registered successfully');
      
      // Set success state
      setSuccess(true);
      
      // Redirect based on user type
      console.log('Redirecting to onboarding based on user type:', userType);
      setTimeout(() => {
        if (userType === 'landlord') {
          navigate('/landlord-onboarding');
        } else if (userType === 'contractor') {
          navigate('/contractor-onboarding');
        } else {
          navigate('/onboarding');
        }
      }, 1000); // Short delay to show success state
      
    } catch (error) {
      console.error('Firebase Auth Error:', error);
      // Extract the error code and message for better debugging
      const errorCode = error.code || 'unknown';
      const errorMessage = error.message || 'Unknown error';
      console.error(`Error code: ${errorCode}, Message: ${errorMessage}`);
      
      // Handle specific Firebase auth errors
      setError(getErrorMessage(errorCode));
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Create your account
        </h2>
        
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
            <p>{error}</p>
          </div>
        )}
        
        {success && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert">
            <p>Account created successfully! Redirecting you to onboarding survey...</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              id="confirm-password"
              name="confirm-password"
              type="password"
              autoComplete="new-password"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              I am a:
            </label>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <input
                  type="radio"
                  id="tenant"
                  name="userType" 
                  value="tenant"
                  className="sr-only"
                  checked={userType === 'tenant'}
                  onChange={() => setUserType('tenant')}
                  disabled={loading}
                />
                <label
                  htmlFor="tenant"
                  className={`cursor-pointer block text-center py-2 px-4 border rounded-md ${
                    userType === 'tenant'
                      ? 'bg-teal-50 border-teal-500 text-teal-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Tenant
                </label>
              </div>
              <div>
                <input
                  type="radio"
                  id="landlord"
                  name="userType"
                  value="landlord"
                  className="sr-only"
                  checked={userType === 'landlord'}
                  onChange={() => setUserType('landlord')}
                  disabled={loading}
                />
                <label
                  htmlFor="landlord"
                  className={`cursor-pointer block text-center py-2 px-4 border rounded-md ${
                    userType === 'landlord'
                      ? 'bg-teal-50 border-teal-500 text-teal-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Landlord
                </label>
              </div>
              <div>
                <input
                  type="radio"
                  id="contractor"
                  name="userType"
                  value="contractor"
                  className="sr-only"
                  checked={userType === 'contractor'}
                  onChange={() => setUserType('contractor')}
                  disabled={loading}
                />
                <label
                  htmlFor="contractor"
                  className={`cursor-pointer block text-center py-2 px-4 border rounded-md ${
                    userType === 'contractor'
                      ? 'bg-teal-50 border-teal-500 text-teal-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Contractor
                </label>
              </div>
            </div>
          </div>
          
          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                ${loading 
                  ? 'bg-teal-400 cursor-not-allowed' 
                  : 'bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500'
                }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </>
              ) : (
                'Sign Up'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupForm; 