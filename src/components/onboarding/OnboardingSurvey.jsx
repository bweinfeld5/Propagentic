import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import HomeNavLink from '../layout/HomeNavLink';

const OnboardingSurvey = () => {
  const { currentUser, userProfile, fetchUserProfile } = useAuth();
  const navigate = useNavigate();
  
  // Form state
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    preferredContactMethod: 'email',
    address: '',
    propertyType: 'Apartment',
  });

  // Redirect if user is not authenticated
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    } else if (userProfile?.onboardingComplete) {
      // Redirect to the appropriate dashboard based on user type
      if (userProfile.userType) {
        navigate(`/${userProfile.userType}`);
      } else {
        navigate('/dashboard');
      }
    }
  }, [currentUser, userProfile, navigate]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Navigate to next step
  const handleNext = () => {
    setCurrentStep(prev => prev + 1);
  };

  // Navigate to previous step
  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  // Submit form to Firestore
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) return;
    
    setLoading(true);
    
    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      
      // Use setDoc with merge option instead of updateDoc
      await setDoc(userDocRef, {
        ...formData,
        onboardingComplete: true,
        name: `${formData.firstName} ${formData.lastName}`,
        updatedAt: new Date()
      }, { merge: true });
      
      // Refresh the user profile before redirecting
      const updatedProfile = await fetchUserProfile(currentUser.uid);
      
      console.log('Onboarding complete, redirecting to dashboard', updatedProfile);
      
      // Redirect to dashboard based on the updated profile
      if (updatedProfile && updatedProfile.userType) {
        navigate(`/${updatedProfile.userType}`);
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error saving onboarding data:', error);
      alert(`Error saving your information: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Progress indicator
  const ProgressIndicator = () => {
    return (
      <div className="mb-8 flex justify-center">
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((step) => (
            <React.Fragment key={step}>
              <div 
                className={`rounded-full h-8 w-8 flex items-center justify-center border-2 
                  ${currentStep >= step 
                    ? 'border-teal-500 bg-teal-500 text-white' 
                    : 'border-gray-300 text-gray-300'}`}
              >
                {step}
              </div>
              {step < 5 && (
                <div 
                  className={`w-10 h-1 mx-1 
                    ${currentStep > step ? 'bg-teal-500' : 'bg-gray-300'}`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  // Step 1: Name
  const renderStep1 = () => (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Tell us your name</h3>
      <div className="space-y-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
          />
        </div>
      </div>
    </div>
  );

  // Step 2: Contact Info
  const renderStep2 = () => (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
      <div className="space-y-4">
        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
          />
        </div>
        <div>
          <label htmlFor="preferredContactMethod" className="block text-sm font-medium text-gray-700">
            Preferred Contact Method
          </label>
          <select
            id="preferredContactMethod"
            name="preferredContactMethod"
            value={formData.preferredContactMethod}
            onChange={handleChange}
            className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
          >
            <option value="email">Email</option>
            <option value="phone">Phone</option>
            <option value="text">Text Message</option>
          </select>
        </div>
      </div>
    </div>
  );

  // Step 3: Address
  const renderStep3 = () => (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Living Address</h3>
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
          Current Address
        </label>
        <textarea
          id="address"
          name="address"
          rows="3"
          value={formData.address}
          onChange={handleChange}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
          placeholder="Enter your full address"
        />
      </div>
    </div>
  );

  // Step 4: Property Type
  const renderStep4 = () => (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Property Information</h3>
      <div>
        <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700">
          Property Type
        </label>
        <select
          id="propertyType"
          name="propertyType"
          value={formData.propertyType}
          onChange={handleChange}
          className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
        >
          <option value="Apartment">Apartment</option>
          <option value="Home">Home</option>
          <option value="Commercial Unit">Commercial Unit</option>
        </select>
      </div>
    </div>
  );

  // Step 5: Confirmation
  const renderStep5 = () => (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Role Confirmation</h3>
      <div className="p-4 bg-gray-50 rounded-md">
        <p className="text-gray-700 mb-2">
          <span className="font-medium">Account Type:</span> {userProfile?.userType ? userProfile.userType.charAt(0).toUpperCase() + userProfile.userType.slice(1) : 'User'}
        </p>
        <p className="text-sm text-gray-500">
          This is the account type you selected during registration. This determines which features and functionalities you'll have access to in Propagentic.
        </p>
      </div>
      <div className="mt-6 space-y-2">
        <h4 className="font-medium text-gray-800">Please review your information:</h4>
        <p><span className="text-gray-500">Name:</span> {formData.firstName} {formData.lastName}</p>
        <p><span className="text-gray-500">Phone:</span> {formData.phoneNumber}</p>
        <p><span className="text-gray-500">Preferred Contact:</span> {formData.preferredContactMethod}</p>
        <p><span className="text-gray-500">Address:</span> {formData.address}</p>
        <p><span className="text-gray-500">Property Type:</span> {formData.propertyType}</p>
      </div>
    </div>
  );

  // Render the appropriate step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      case 5:
        return renderStep5();
      default:
        return null;
    }
  };

  // Validation
  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.firstName && formData.lastName;
      case 2:
        return formData.phoneNumber && formData.preferredContactMethod;
      case 3:
        return formData.address;
      case 4:
        return formData.propertyType;
      case 5:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-end mb-2">
          <HomeNavLink showOnAuth={true} />
        </div>
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Welcome to Propagentic</h2>
          <p className="mt-2 text-sm text-gray-600">
            Let's set up your profile to get started
          </p>
        </div>

        <ProgressIndicator />
        
        <form onSubmit={currentStep === 5 ? handleSubmit : (e) => e.preventDefault()}>
          {renderStepContent()}
          
          <div className="mt-8 flex justify-between">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              >
                Back
              </button>
            )}
            
            {currentStep < 5 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={!isStepValid()}
                className={`ml-auto py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                  ${isStepValid() 
                    ? 'bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500' 
                    : 'bg-teal-300 cursor-not-allowed'}`}
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="ml-auto py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </div>
                ) : (
                  'Complete Setup'
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default OnboardingSurvey; 