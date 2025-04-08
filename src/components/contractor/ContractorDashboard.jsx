import React, { useState, useEffect, useRef } from 'react';
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc, arrayUnion, getDocs, limit, startAfter } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, auth, storage, callFunction } from '../../firebase/config';
import NotificationPreferences from '../notifications/NotificationPreferences';

// Constants for validation
const MAX_PROGRESS_UPDATE_LENGTH = 500;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
const ITEMS_PER_PAGE = 10; // Number of tickets to load per page

const ContractorDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [affiliatedLandlords, setAffiliatedLandlords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [progressUpdate, setProgressUpdate] = useState('');
  const [progressPercent, setProgressPercent] = useState(0);
  const [progressPhotos, setProgressPhotos] = useState([]);
  const [progressPhotoURLs, setProgressPhotoURLs] = useState([]);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [submittingUpdate, setSubmittingUpdate] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [decisionLoading, setDecisionLoading] = useState({ accept: false, reject: false });
  // Pagination state
  const [lastVisible, setLastVisible] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  // Status filter state
  const [statusFilter, setStatusFilter] = useState('all');
  // Unsubscribe references
  const unsubscribeRefs = useRef({});
  // Add this state 
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    const contractorId = currentUser.uid;
    
    // Fetch tickets assigned to this contractor
    const fetchTickets = () => {
      // Clear any existing subscription
      if (unsubscribeRefs.current.tickets) {
        unsubscribeRefs.current.tickets();
      }
      
      const ticketsRef = collection(db, 'tickets');
      
      // Build query based on filter
      let ticketsQuery;
      if (statusFilter === 'all') {
        ticketsQuery = query(
          ticketsRef,
          where('contractorId', '==', contractorId),
          where('status', 'in', ['assigned', 'accepted', 'in_progress', 'dispatched']),
          orderBy('updatedAt', 'desc'),
          limit(ITEMS_PER_PAGE)
        );
      } else {
        ticketsQuery = query(
          ticketsRef,
          where('contractorId', '==', contractorId),
          where('status', '==', statusFilter),
          orderBy('updatedAt', 'desc'),
          limit(ITEMS_PER_PAGE)
        );
      }
      
      const unsubscribeTickets = onSnapshot(ticketsQuery, (snapshot) => {
        if (!snapshot.empty) {
          const ticketsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate() || new Date(),
            updatedAt: doc.data().updatedAt?.toDate() || new Date(),
          }));
          setTickets(ticketsData);
          // Store the last document for pagination
          setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
          setHasMore(snapshot.docs.length >= ITEMS_PER_PAGE);
        } else {
          setTickets([]);
          setHasMore(false);
        }
        setLoading(false);
      }, (err) => {
        console.error('Error fetching tickets:', err);
        setError('Failed to load assigned tickets');
        setLoading(false);
      });
      
      // Store unsubscribe function
      unsubscribeRefs.current.tickets = unsubscribeTickets;
    };
    
    // Fetch incoming assignments waiting for acceptance/rejection
    const fetchPendingTickets = () => {
      // Clear any existing subscription
      if (unsubscribeRefs.current.pendingTickets) {
        unsubscribeRefs.current.pendingTickets();
      }
      
      // Only fetch pending tickets if we're showing "all" or specifically "pending_acceptance"
      if (statusFilter !== 'all' && statusFilter !== 'pending_acceptance') {
        return;
      }
      
      const pendingTicketsRef = collection(db, 'tickets');
      const pendingTicketsQuery = query(
        pendingTicketsRef,
        where('contractorId', '==', contractorId),
        where('status', '==', 'pending_acceptance'),
        limit(ITEMS_PER_PAGE)
      );
      
      const unsubscribePending = onSnapshot(pendingTicketsQuery, (snapshot) => {
        if (!snapshot.empty) {
          const pendingTicketsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            isPending: true,
            createdAt: doc.data().createdAt?.toDate() || new Date(),
            updatedAt: doc.data().updatedAt?.toDate() || new Date(),
          }));
          
          // Combine with active tickets
          setTickets(currentTickets => {
            const activeTickets = currentTickets.filter(ticket => !ticket.isPending);
            return [...pendingTicketsData, ...activeTickets];
          });
        }
      }, (err) => {
        console.error('Error fetching pending tickets:', err);
      });
      
      // Store unsubscribe function
      unsubscribeRefs.current.pendingTickets = unsubscribePending;
    };
    
    // Fetch affiliated landlords
    const fetchAffiliatedLandlords = async () => {
      try {
        // Query landlord profiles where contractors array contains this contractor's ID
        const landlordProfilesRef = collection(db, 'landlordProfiles');
        const landlordQuery = query(
          landlordProfilesRef, 
          where('contractors', 'array-contains', contractorId),
          limit(20) // Limit to 20 landlords max
        );
        
        const landlordSnapshot = await getDocs(landlordQuery);
        const landlordData = landlordSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setAffiliatedLandlords(landlordData);
      } catch (err) {
        console.error('Error fetching affiliated landlords:', err);
      }
    };
    
    fetchTickets();
    fetchPendingTickets();
    fetchAffiliatedLandlords();
    
    // Cleanup function to unsubscribe from all listeners when component unmounts
    return () => {
      Object.values(unsubscribeRefs.current).forEach(unsubscribe => {
        if (typeof unsubscribe === 'function') {
          unsubscribe();
        }
      });
    };
  }, [statusFilter]); // Re-run when statusFilter changes

  // Function to load more tickets
  const loadMoreTickets = async () => {
    if (!lastVisible || loadingMore || !hasMore) return;
    
    setLoadingMore(true);
    const currentUser = auth.currentUser;
    if (!currentUser) return;
    
    try {
      const contractorId = currentUser.uid;
      const ticketsRef = collection(db, 'tickets');
      
      // Build query based on status filter
      let nextQuery;
      if (statusFilter === 'all') {
        nextQuery = query(
          ticketsRef,
          where('contractorId', '==', contractorId),
          where('status', 'in', ['assigned', 'accepted', 'in_progress', 'dispatched']),
          orderBy('updatedAt', 'desc'),
          startAfter(lastVisible),
          limit(ITEMS_PER_PAGE)
        );
      } else {
        nextQuery = query(
          ticketsRef,
          where('contractorId', '==', contractorId),
          where('status', '==', statusFilter),
          orderBy('updatedAt', 'desc'),
          startAfter(lastVisible),
          limit(ITEMS_PER_PAGE)
        );
      }
      
      const snapshot = await getDocs(nextQuery);
      
      if (!snapshot.empty) {
        const newTickets = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date()
        }));
        
        setTickets(currentTickets => {
          // Filter out pending tickets first
          const activeTickets = currentTickets.filter(ticket => !ticket.isPending);
          // Filter out pending tickets from new tickets too (just in case)
          const newActiveTickets = newTickets.filter(ticket => !ticket.isPending);
          // Combine both active ticket sets
          return [
            ...currentTickets.filter(ticket => ticket.isPending),
            ...activeTickets,
            ...newActiveTickets
          ];
        });
        
        setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
        setHasMore(snapshot.docs.length >= ITEMS_PER_PAGE);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error loading more tickets:', err);
      setError('Failed to load more tickets');
    } finally {
      setLoadingMore(false);
    }
  };

  // Validate progress update input
  const validateProgressUpdate = () => {
    const errors = {};
    
    if (!progressUpdate.trim()) {
      errors.progressUpdate = 'Please enter a progress update';
    } else if (progressUpdate.length > MAX_PROGRESS_UPDATE_LENGTH) {
      errors.progressUpdate = `Update must be less than ${MAX_PROGRESS_UPDATE_LENGTH} characters`;
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Sanitize text input
  const sanitizeText = (text) => {
    return text
      .replace(/<(|\/|[^>\/bi]|\/[^>bi]|[^\/>][^>]+|\/[^>][^>]+)>/g, '')
      .trim();
  };

  const handleAcceptTicket = async (ticketId) => {
    setDecisionLoading({ accept: true, reject: false });
    
    try {
      await callFunction('handleContractorAcceptance', {
        ticketId
      });
    } catch (err) {
      console.error('Error accepting ticket:', err);
      setError('Failed to accept ticket');
    } finally {
      setDecisionLoading({ accept: false, reject: false });
    }
  };

  const handleRejectTicket = async (ticketId) => {
    setDecisionLoading({ accept: false, reject: true });
    
    try {
      await callFunction('handleContractorRejection', {
        ticketId
      });
    } catch (err) {
      console.error('Error rejecting ticket:', err);
      setError('Failed to reject ticket');
    } finally {
      setDecisionLoading({ accept: false, reject: false });
    }
  };

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    const errors = {};
    const validFiles = [];
    const validPhotoURLs = [];
    
    files.forEach(file => {
      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        errors.fileSize = `File "${file.name}" exceeds the maximum size of 5MB`;
        return;
      }
      
      // Validate file type
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        errors.fileType = `File "${file.name}" is not a supported image type (JPG/PNG only)`;
        return;
      }
      
      validFiles.push(file);
      validPhotoURLs.push(URL.createObjectURL(file));
    });
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors({...validationErrors, ...errors});
    } else {
      setProgressPhotos([...progressPhotos, ...validFiles]);
      setProgressPhotoURLs([...progressPhotoURLs, ...validPhotoURLs]);
      
      // Clear file-related validation errors
      if (validationErrors.fileSize || validationErrors.fileType) {
        const newErrors = {...validationErrors};
        delete newErrors.fileSize;
        delete newErrors.fileType;
        setValidationErrors(newErrors);
      }
    }
  };

  const removePhoto = (index) => {
    const newPhotos = [...progressPhotos];
    const newPhotoURLs = [...progressPhotoURLs];
    
    newPhotos.splice(index, 1);
    newPhotoURLs.splice(index, 1);
    
    setProgressPhotos(newPhotos);
    setProgressPhotoURLs(newPhotoURLs);
  };

  const handleSubmitProgress = async (e) => {
    e.preventDefault();
    
    if (!selectedTicket) return;
    
    // Validate form
    if (!validateProgressUpdate()) {
      return;
    }
    
    setSubmittingUpdate(true);
    setError(null);
    
    try {
      const photoUrls = [];
      
      // Upload photos if any
      if (progressPhotos.length > 0) {
        setUploadingPhotos(true);
        
        for (const photo of progressPhotos) {
          const storageRef = ref(storage, `tickets/${selectedTicket.id}/progress_${Date.now()}_${photo.name}`);
          await uploadBytes(storageRef, photo);
          const url = await getDownloadURL(storageRef);
          photoUrls.push(url);
        }
        
        setUploadingPhotos(false);
      }
      
      // Sanitize text
      const sanitizedUpdate = sanitizeText(progressUpdate);
      
      // Update ticket document
      const ticketRef = doc(db, 'tickets', selectedTicket.id);
      
      const updateData = {
        progressUpdates: arrayUnion({
          timestamp: new Date().toISOString(),
          message: sanitizedUpdate,
          progressPercent: progressPercent,
          photos: photoUrls,
          contractorId: auth.currentUser.uid
        }),
        updatedAt: new Date()
      };
      
      // Update overall status if progress is 100%
      if (progressPercent === 100) {
        updateData.status = 'completed';
        updateData.completedAt = new Date();
      } else if (selectedTicket.status === 'accepted' || selectedTicket.status === 'assigned') {
        updateData.status = 'in_progress';
      }
      
      await updateDoc(ticketRef, updateData);
      
      // Create notification for tenant and landlord
      await callFunction('sendNotification', {
        ticketId: selectedTicket.id,
        title: progressPercent === 100 ? 'Job Completed' : 'Job Progress Update',
        message: sanitizedUpdate,
        notifyRoles: ['tenant', 'landlord']
      });
      
      // Reset form
      setProgressUpdate('');
      setProgressPhotos([]);
      setProgressPhotoURLs([]);
      setProgressPercent(0);
      
    } catch (err) {
      console.error('Error submitting progress update:', err);
      setError('Failed to submit progress update');
    } finally {
      setSubmittingUpdate(false);
    }
  };

  const renderTicketStatus = (ticket) => {
    const statusMap = {
      pending_acceptance: { color: 'yellow', text: 'Pending Your Acceptance' },
      accepted: { color: 'blue', text: 'Accepted' },
      in_progress: { color: 'blue', text: 'In Progress' },
      completed: { color: 'green', text: 'Completed' },
      rejected: { color: 'red', text: 'Rejected' }
    };
    
    const status = ticket.status;
    const style = statusMap[status] || { color: 'gray', text: status?.replace(/_/g, ' ') };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium 
        ${style.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
          style.color === 'blue' ? 'bg-blue-100 text-blue-800' :
          style.color === 'green' ? 'bg-green-100 text-green-800' :
          style.color === 'red' ? 'bg-red-100 text-red-800' :
          'bg-gray-100 text-gray-800'}`}
      >
        {style.text}
      </span>
    );
  };

  // Render urgency badge
  const renderUrgencyBadge = (urgency) => {
    const urgencyMap = {
      low: { color: 'green', text: 'Low' },
      normal: { color: 'blue', text: 'Normal' },
      high: { color: 'red', text: 'High' },
    };
    
    const style = urgencyMap[urgency] || { color: 'blue', text: 'Normal' };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
        ${style.color === 'green' ? 'bg-green-100 text-green-800' :
          style.color === 'blue' ? 'bg-blue-100 text-blue-800' :
          style.color === 'red' ? 'bg-red-100 text-red-800' :
          'bg-gray-100 text-gray-800'}`}
      >
        {style.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Contractor Dashboard</h1>
      
      {affiliatedLandlords.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-3">Your Network</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <ul className="divide-y divide-gray-200">
                {affiliatedLandlords.map(landlord => (
                  <li key={landlord.id} className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{landlord.displayName}</p>
                      <p className="text-sm text-gray-500">{landlord.email}</p>
                    </div>
                    <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mt-2 sm:mt-0">
                      Connected
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-3 gap-2">
          <h2 className="text-lg font-medium text-gray-900">Job Assignments</h2>
          
          {/* Status filter */}
          <div className="w-full md:w-auto">
            <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Status:
            </label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full md:w-auto rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="all">All Jobs</option>
              <option value="pending_acceptance">Pending Acceptance</option>
              <option value="accepted">Accepted</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
        
        {tickets.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-500">No active job assignments.</p>
            <p className="text-sm text-gray-400 mt-2">
              You'll see jobs here when landlords assign maintenance requests to you.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Property
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Issue
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Urgency
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {tickets.map((ticket) => (
                        <tr 
                          key={ticket.id} 
                          className={selectedTicket?.id === ticket.id ? 'bg-blue-50' : 'hover:bg-gray-50'}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{ticket.propertyName || 'Unknown'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="text-sm font-medium text-gray-900 capitalize">
                                {ticket.issueType?.replace('_', ' ') || 'Unknown'}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {renderUrgencyBadge(ticket.urgencyLevel)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {renderTicketStatus(ticket)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {ticket.updatedAt.toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            {ticket.status === 'pending_acceptance' ? (
                              <div className="flex space-x-2 justify-end">
                                <button
                                  onClick={() => handleAcceptTicket(ticket.id)}
                                  disabled={decisionLoading.accept || decisionLoading.reject}
                                  className={`text-green-600 hover:text-green-900 ${decisionLoading.accept ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                  {decisionLoading.accept ? 'Accepting...' : 'Accept'}
                                </button>
                                <button
                                  onClick={() => handleRejectTicket(ticket.id)}
                                  disabled={decisionLoading.accept || decisionLoading.reject}
                                  className={`text-red-600 hover:text-red-900 ${decisionLoading.reject ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                  {decisionLoading.reject ? 'Rejecting...' : 'Reject'}
                                </button>
                              </div>
                            ) : (
                              <button
                                className="text-blue-600 hover:text-blue-900"
                                onClick={() => setSelectedTicket(ticket)}
                              >
                                Manage
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Pagination controls */}
                {hasMore && (
                  <div className="px-6 py-4 border-t border-gray-200">
                    <button 
                      onClick={loadMoreTickets}
                      disabled={loadingMore}
                      className={`w-full sm:w-auto flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loadingMore ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {loadingMore ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Loading...
                        </>
                      ) : 'Load More'}
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              {selectedTicket ? (
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Job Details</h3>
                    <p className="text-sm text-gray-500">#{selectedTicket.id.substring(0, 8)}</p>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Property</h4>
                      <p className="mt-1 text-gray-900">{selectedTicket.propertyName}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Issue Type</h4>
                      <p className="mt-1 text-gray-900 capitalize">{selectedTicket.issueType?.replace('_', ' ')}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Description</h4>
                      <p className="mt-1 text-gray-900">{selectedTicket.description}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Urgency</h4>
                      <p className="mt-1">{renderUrgencyBadge(selectedTicket.urgencyLevel)}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Status</h4>
                      <p className="mt-1">{renderTicketStatus(selectedTicket)}</p>
                    </div>
                    
                    {selectedTicket.photos?.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Photos</h4>
                        <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {selectedTicket.photos.map((photo, idx) => (
                            <a 
                              key={idx} 
                              href={photo} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="block"
                            >
                              <img 
                                src={photo} 
                                alt={`Ticket photo ${idx+1}`} 
                                className="h-24 w-full object-cover rounded-md"
                              />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Progress update form */}
                  {(selectedTicket.status === 'accepted' || selectedTicket.status === 'in_progress') && (
                    <div className="border-t border-gray-200 pt-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Update Progress</h4>
                      
                      <form onSubmit={handleSubmitProgress}>
                        <div className="space-y-4">
                          <div>
                            <label htmlFor="progress-update" className="block text-sm font-medium text-gray-700">
                              Progress Update <span className="text-red-500">*</span>
                            </label>
                            <textarea
                              id="progress-update"
                              value={progressUpdate}
                              onChange={(e) => {
                                setProgressUpdate(e.target.value);
                                // Clear validation error if fixed
                                if (validationErrors.progressUpdate && e.target.value.trim()) {
                                  const newErrors = {...validationErrors};
                                  delete newErrors.progressUpdate;
                                  setValidationErrors(newErrors);
                                }
                              }}
                              rows={3}
                              maxLength={MAX_PROGRESS_UPDATE_LENGTH}
                              className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                                validationErrors.progressUpdate 
                                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                              }`}
                              placeholder="Describe the work done or in progress..."
                              required
                              disabled={submittingUpdate || uploadingPhotos}
                            ></textarea>
                            <div className="mt-1 flex justify-between">
                              <p className={`text-xs ${progressUpdate.length > MAX_PROGRESS_UPDATE_LENGTH * 0.8 ? 'text-orange-500' : 'text-gray-500'}`}>
                                {progressUpdate.length}/{MAX_PROGRESS_UPDATE_LENGTH} characters
                              </p>
                              {validationErrors.progressUpdate && (
                                <p className="text-sm text-red-600">{validationErrors.progressUpdate}</p>
                              )}
                            </div>
                          </div>
                          
                          <div>
                            <label htmlFor="progress-percent" className="block text-sm font-medium text-gray-700">
                              Progress Percentage: {progressPercent}%
                            </label>
                            <input
                              type="range"
                              id="progress-percent"
                              min="0"
                              max="100"
                              step="5"
                              value={progressPercent}
                              onChange={(e) => setProgressPercent(parseInt(e.target.value))}
                              className="mt-1 block w-full"
                              disabled={submittingUpdate || uploadingPhotos}
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Add Photos (optional)
                            </label>
                            <div className="mt-1 flex justify-center px-6 py-4 border-2 border-gray-300 border-dashed rounded-md">
                              <div className="space-y-1 text-center">
                                <svg
                                  className="mx-auto h-8 w-8 text-gray-400"
                                  stroke="currentColor"
                                  fill="none"
                                  viewBox="0 0 48 48"
                                  aria-hidden="true"
                                >
                                  <path
                                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                                <div className="flex text-sm text-gray-600">
                                  <label
                                    htmlFor="progress-photos"
                                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500"
                                  >
                                    <span>Upload photos</span>
                                    <input
                                      id="progress-photos"
                                      name="progress-photos"
                                      type="file"
                                      className="sr-only"
                                      accept="image/jpeg,image/jpg,image/png"
                                      multiple
                                      onChange={handlePhotoChange}
                                      disabled={submittingUpdate || uploadingPhotos}
                                    />
                                  </label>
                                </div>
                                <p className="text-xs text-gray-500">
                                  JPG, PNG only, up to 5MB each
                                </p>
                              </div>
                            </div>
                            
                            {(validationErrors.fileSize || validationErrors.fileType) && (
                              <div className="mt-2 text-sm text-red-600">
                                {validationErrors.fileSize && <p>{validationErrors.fileSize}</p>}
                                {validationErrors.fileType && <p>{validationErrors.fileType}</p>}
                              </div>
                            )}
                            
                            {progressPhotoURLs.length > 0 && (
                              <div className="mt-4 grid grid-cols-3 gap-2">
                                {progressPhotoURLs.map((url, idx) => (
                                  <div key={idx} className="relative">
                                    <img
                                      src={url}
                                      alt={`Upload ${idx + 1}`}
                                      className="h-20 w-full object-cover rounded-md"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => removePhoto(idx)}
                                      disabled={submittingUpdate || uploadingPhotos}
                                      className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600 focus:outline-none"
                                    >
                                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                      </svg>
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          
                          {uploadingPhotos && (
                            <div className="w-full">
                              <div className="text-xs font-semibold inline-block text-blue-600 mb-1">
                                Uploading photos...
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div className="bg-blue-600 h-2.5 rounded-full animate-pulse"></div>
                              </div>
                            </div>
                          )}
                          
                          <div>
                            <button
                              type="submit"
                              disabled={submittingUpdate || uploadingPhotos}
                              className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                                submittingUpdate || uploadingPhotos 
                                  ? 'bg-blue-400 cursor-not-allowed' 
                                  : 'bg-blue-600 hover:bg-blue-700'
                              }`}
                            >
                              {uploadingPhotos ? 'Uploading Photos...' : 
                               submittingUpdate ? 'Updating...' : 
                               progressPercent === 100 ? 'Mark as Complete' : 'Update Progress'}
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  )}
                  
                  <button
                    type="button"
                    onClick={() => setSelectedTicket(null)}
                    className="mt-6 w-full inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Close Details
                  </button>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow p-6 text-center">
                  <p className="text-gray-500">Select a job to view details</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Settings/Preferences Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-medium text-gray-900">Settings & Preferences</h2>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {showSettings ? 'Hide Settings' : 'Show Settings'}
          </button>
        </div>
        
        {showSettings && (
          <div className="bg-white rounded-lg shadow">
            <NotificationPreferences />
          </div>
        )}
      </div>
    </div>
  );
};

export default ContractorDashboard; 