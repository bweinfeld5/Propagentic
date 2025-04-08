import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const SignupForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState('tenant');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    terms: ''
  });
  
  const navigate = useNavigate();
  const { register, fetchUserProfile } = useAuth();

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

  // Password strength checker
  const checkPasswordStrength = (pass) => {
    if (pass.length === 0) return { score: 0, message: '' };
    if (pass.length < 6) return { score: 1, message: 'Weak: Too short' };
    
    let score = 0;
    // Add 1 point for length
    if (pass.length >= 8) score += 1;
    // Add 1 point for lowercase letter
    if (/[a-z]/.test(pass)) score += 1;
    // Add 1 point for uppercase letter
    if (/[A-Z]/.test(pass)) score += 1;
    // Add 1 point for number
    if (/[0-9]/.test(pass)) score += 1;
    // Add 1 point for special character
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    
    let message = '';
    if (score <= 2) message = 'Weak';
    else if (score <= 3) message = 'Medium';
    else if (score <= 4) message = 'Strong';
    else message = 'Very strong';
    
    return { score, message };
  };

  const passwordStrength = checkPasswordStrength(password);

  // Validate form inputs in real-time
  useEffect(() => {
    const errors = { email: '', password: '', confirmPassword: '', terms: '' };
    
    // Email validation
    if (email.length > 0 && !/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    // Password validation
    if (password.length > 0 && password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }
    
    // Confirm password validation
    if (confirmPassword.length > 0 && password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setValidationErrors(errors);
  }, [email, password, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    const errors = { ...validationErrors };
    
    if (!termsAccepted) {
      errors.terms = 'You must accept the terms and conditions';
      setValidationErrors(errors);
      return;
    }
    
    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
      setValidationErrors(errors);
      return;
    }
    
    if (password.length < 6) {
      errors.password = 'Password should be at least 6 characters long';
      setValidationErrors(errors);
      return;
    }
    
    // If there are validation errors, don't proceed
    if (Object.values(errors).some(error => error !== '')) {
      return;
    }
    
    // Reset error state and set loading
    setError('');
    setLoading(true);
    setSuccess(false);
    
    try {
      // Use the register function from AuthContext
      console.log('Attempting to register user with email:', email);
      const userCredential = await register(email, password, userType);
      console.log('User registered successfully');
      
      // Fetch user profile data to ensure it's loaded in context
      console.log('Fetching user profile data...');
      await fetchUserProfile(userCredential.user.uid);
      console.log('User profile data loaded');
      
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
      <div className="bg-white rounded-lg p-6">
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
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 ${
                validationErrors.email ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            {validationErrors.email && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
            )}
          </div>
          
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 ${
                  validationErrors.password ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            {validationErrors.password && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.password}</p>
            )}
            {password.length > 0 && (
              <div className="mt-2">
                <div className="flex items-center">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${
                        passwordStrength.score <= 2 ? 'bg-red-500' : 
                        passwordStrength.score <= 3 ? 'bg-yellow-500' : 
                        'bg-green-500'
                      }`}
                      style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                    ></div>
                  </div>
                  <span className="ml-2 text-xs text-gray-600">{passwordStrength.message}</span>
                </div>
                <ul className="mt-1 text-xs text-gray-600 space-y-1">
                  <li className={password.length >= 8 ? 'text-green-600' : ''}>• At least 8 characters</li>
                  <li className={/[A-Z]/.test(password) ? 'text-green-600' : ''}>• At least one uppercase letter</li>
                  <li className={/[0-9]/.test(password) ? 'text-green-600' : ''}>• At least one number</li>
                  <li className={/[^A-Za-z0-9]/.test(password) ? 'text-green-600' : ''}>• At least one special character</li>
                </ul>
              </div>
            )}
          </div>
          
          <div className="mb-4">
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirm-password"
                name="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 ${
                  validationErrors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex="-1"
              >
                {showConfirmPassword ? (
                  <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            {validationErrors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.confirmPassword}</p>
            )}
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
          
          <div className="mb-6">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  disabled={loading}
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="text-gray-700">
                  I agree to the{' '}
                  <a href="/terms" className="text-teal-600 hover:text-teal-500">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="/privacy" className="text-teal-600 hover:text-teal-500">
                    Privacy Policy
                  </a>
                </label>
              </div>
            </div>
            {validationErrors.terms && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.terms}</p>
            )}
          </div>
          
          <div className="mb-6">
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
          
          <div className="flex items-center my-4">
            <div className="flex-grow h-px bg-gray-300"></div>
            <span className="mx-4 text-sm text-gray-500">Or sign up with</span>
            <div className="flex-grow h-px bg-gray-300"></div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              disabled={loading}
            >
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Google
            </button>
            <button
              type="button"
              className="flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              disabled={loading}
            >
              <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
              </svg>
              Facebook
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupForm; 