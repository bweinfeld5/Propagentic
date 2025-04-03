import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase/config';
import { v4 as uuidv4 } from 'uuid';

// Category options for maintenance requests
const CATEGORIES = [
  { id: 'plumbing', label: 'Plumbing' },
  { id: 'electrical', label: 'Electrical' },
  { id: 'hvac', label: 'HVAC/Heating/Cooling' },
  { id: 'structural', label: 'Structural/Building' },
  { id: 'appliance', label: 'Appliance Issue' },
  { id: 'other', label: 'Other' },
];

// Urgency options
const URGENCY_LEVELS = [
  { id: 1, label: '1 - Low Priority' },
  { id: 2, label: '2 - Minor Issue' },
  { id: 3, label: '3 - Normal Priority' },
  { id: 4, label: '4 - Important' },
  { id: 5, label: '5 - Emergency' },
];

// Interface for form data (optional but good practice)
interface MaintenanceFormData {
  issueTitle: string;
  description: string;
  unitNumber: string;
  urgency: string; // Assuming urgency is handled as string like 'low', 'medium', 'high'
  // category: string; // Removed category as it wasn't in the state
}

const MaintenanceRequestForm: React.FC = () => {
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();
  
  // Use inferred types where possible, keep explicit for complex/union types
  const [formData, setFormData] = useState<MaintenanceFormData>({
      issueTitle: '',
      description: '',
      unitNumber: '', 
      urgency: 'medium' 
  });
  const [photo, setPhoto] = useState<File | null>(null); // Keep explicit type for File | null
  const [photoPreview, setPhotoPreview] = useState(''); // Infer string type
  const [loading, setLoading] = useState(false); // Infer boolean type
  const [error, setError] = useState(''); // Infer string type
  const [success, setSuccess] = useState(''); // Infer string type

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Photo size must be less than 5MB');
        return;
      }
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
      setError(''); // Clear error if a valid photo is selected
    }
  };
  
  const removePhoto = () => {
      if(photoPreview) {
          URL.revokeObjectURL(photoPreview);
      }
      setPhoto(null);
      setPhotoPreview('');
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Basic Validation
    if (!formData.issueTitle || !formData.description || !formData.unitNumber) {
        setError('Please fill out title, description, and unit number.');
        return;
    }

    setError('');
    setLoading(true);
    setSuccess('');

    if (!currentUser) {
        setError('User not authenticated.');
        setLoading(false);
        return;
    }

    try {
      let photoUrl: string | null = null;
      if (photo) {
        // Upload photo to Firebase Storage
        const fileRef = ref(storage, `maintenance-requests/${currentUser.uid}/${Date.now()}-${photo.name}`);
        await uploadBytes(fileRef, photo);
        photoUrl = await getDownloadURL(fileRef);
      }
      
      // Generate a unique ID for the request
      const ticketId = uuidv4();
      
      // Create document in Firestore
      await setDoc(doc(db, 'tickets', ticketId), {
        ...formData,
        photoUrl: photoUrl, // Add the photo URL
        submittedBy: currentUser.uid,
        tenantName: userProfile?.firstName ? `${userProfile.firstName} ${userProfile.lastName || ''}`.trim() : currentUser.email,
        tenantEmail: currentUser.email,
        status: 'pending_classification',
        createdAt: serverTimestamp(), 
      });
      
      setSuccess('Maintenance request submitted successfully!');
      setFormData({ issueTitle: '', description: '', unitNumber: '', urgency: 'medium' }); // Reset form
      removePhoto(); // Clear photo
      
      // Optional: Redirect after a delay
      // setTimeout(() => navigate('/maintenance/my-requests'), 2000);

    } catch (err) {
      console.error('Error submitting maintenance request:', err);
      setError('Failed to submit maintenance request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Submit New Maintenance Request</h2>
        
        {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-4 text-sm" role="alert">{error}</div>}
        {success && <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-3 mb-4 text-sm" role="alert">{success}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="issueTitle" className="block text-sm font-medium text-gray-700">Issue Title *</label>
                <input type="text" name="issueTitle" id="issueTitle" required value={formData.issueTitle} onChange={handleChange} className="input-field mt-1" />
            </div>
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description *</label>
                <textarea name="description" id="description" required rows={4} value={formData.description} onChange={handleChange} className="input-field mt-1"></textarea>
            </div>
             <div>
                <label htmlFor="unitNumber" className="block text-sm font-medium text-gray-700">Unit Number *</label>
                <input type="text" name="unitNumber" id="unitNumber" required value={formData.unitNumber} onChange={handleChange} className="input-field mt-1" />
            </div>
            <div>
                <label htmlFor="urgency" className="block text-sm font-medium text-gray-700">Urgency</label>
                <select name="urgency" id="urgency" value={formData.urgency} onChange={handleChange} className="input-field mt-1 bg-white">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
            </div>
           
            {/* Photo Upload */}
            <div>
                 <label className="block text-sm font-medium text-gray-700">Photo (Optional, Max 5MB)</label>
                {!photoPreview ? (
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                            {/* SVG Icon */}
                            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            <div className="flex text-sm text-gray-600">
                                <label htmlFor="photo-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-teal-600 hover:text-teal-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-teal-500">
                                    <span>Upload a file</span>
                                    <input id="photo-upload" name="photo" type="file" className="sr-only" accept="image/*" onChange={handlePhotoChange} />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                        </div>
                    </div>
                 ) : (
                     <div className="mt-2 relative">
                        <img src={photoPreview} alt="Preview" className="max-h-60 w-auto rounded-md border border-gray-300" />
                        <button type="button" onClick={removePhoto} className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 text-xs leading-none hover:bg-red-700 focus:outline-none">
                            &times;
                        </button>
                     </div>
                 )}
            </div>

            <div>
                <button type="submit" disabled={loading} className="w-full btn btn-primary mt-2">
                    {loading ? 'Submitting...' : 'Submit Request'}
                </button>
            </div>
        </form>
         {/* Add shared button styles if not global */}
         <style jsx global>{`
            .input-field {
              @apply appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm;
            }
            .btn {
               @apply py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2;
            }
            .btn-primary {
               @apply text-white bg-teal-600 hover:bg-teal-700 focus:ring-teal-500 disabled:opacity-50;
            }
         `}</style>
    </div>
  );
};

export default MaintenanceRequestForm; 