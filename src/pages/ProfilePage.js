import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import HeaderBar from '../components/layout/HeaderBar';
import SidebarNav from '../components/layout/SidebarNav';

const ProfilePage = () => {
  const { currentUser, userProfile, fetchUserProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    preferredContactMethod: '',
    address: '',
    propertyType: '',
  });
  const [saveMessage, setSaveMessage] = useState('');

  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  // Load profile data
  useEffect(() => {
    if (userProfile) {
      setProfileData({
        firstName: userProfile.firstName || '',
        lastName: userProfile.lastName || '',
        phoneNumber: userProfile.phoneNumber || '',
        preferredContactMethod: userProfile.preferredContactMethod || 'email',
        address: userProfile.address || '',
        propertyType: userProfile.propertyType || '',
      });
    }
  }, [userProfile]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Save profile changes
  const handleSave = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    setSaveMessage('');
    
    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      
      await updateDoc(userDocRef, {
        ...profileData,
        updatedAt: new Date()
      });
      
      // Refresh user profile
      await fetchUserProfile(currentUser.uid);
      
      setIsEditing(false);
      setSaveMessage('Profile updated successfully!');
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setSaveMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setSaveMessage('Error updating profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderBar />
      
      <div className="flex">
        <SidebarNav />
        
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
              
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                >
                  Edit Profile
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </div>
            
            {saveMessage && (
              <div className={`mb-4 p-3 rounded-md ${saveMessage.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                {saveMessage}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={profileData.firstName}
                        onChange={handleChange}
                        className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                      />
                    ) : (
                      <p className="text-gray-900">{profileData.firstName || 'Not provided'}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={profileData.lastName}
                        onChange={handleChange}
                        className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                      />
                    ) : (
                      <p className="text-gray-900">{profileData.lastName || 'Not provided'}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <p className="text-gray-900">{currentUser?.email}</p>
                  </div>
                  
                  <div>
                    <label htmlFor="userType" className="block text-sm font-medium text-gray-700 mb-1">
                      Account Type
                    </label>
                    <p className="text-gray-900 capitalize">{userProfile?.userType || 'User'}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={profileData.phoneNumber}
                        onChange={handleChange}
                        className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                      />
                    ) : (
                      <p className="text-gray-900">{profileData.phoneNumber || 'Not provided'}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="preferredContactMethod" className="block text-sm font-medium text-gray-700 mb-1">
                      Preferred Contact Method
                    </label>
                    {isEditing ? (
                      <select
                        id="preferredContactMethod"
                        name="preferredContactMethod"
                        value={profileData.preferredContactMethod}
                        onChange={handleChange}
                        className="block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                      >
                        <option value="email">Email</option>
                        <option value="phone">Phone</option>
                        <option value="text">Text Message</option>
                      </select>
                    ) : (
                      <p className="text-gray-900 capitalize">{profileData.preferredContactMethod || 'Not provided'}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    {isEditing ? (
                      <textarea
                        id="address"
                        name="address"
                        rows="3"
                        value={profileData.address}
                        onChange={handleChange}
                        className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                      />
                    ) : (
                      <p className="text-gray-900">{profileData.address || 'Not provided'}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 mb-1">
                      Property Type
                    </label>
                    {isEditing ? (
                      <select
                        id="propertyType"
                        name="propertyType"
                        value={profileData.propertyType}
                        onChange={handleChange}
                        className="block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                      >
                        <option value="Apartment">Apartment</option>
                        <option value="Home">Home</option>
                        <option value="Commercial Unit">Commercial Unit</option>
                      </select>
                    ) : (
                      <p className="text-gray-900">{profileData.propertyType || 'Not provided'}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfilePage; 