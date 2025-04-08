import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { db, auth, callFunction } from '../../firebase/config';

const LandlordTicketDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [properties, setProperties] = useState([]);
  const [contractors, setContractors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [recommendedContractors, setRecommendedContractors] = useState([]);
  const [assigningTicket, setAssigningTicket] = useState(false);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    const landlordId = currentUser.uid;
    
    // Fetch properties owned by landlord
    const propertiesRef = collection(db, 'properties');
    const propertiesQuery = query(propertiesRef, where('landlordId', '==', landlordId));
    
    const unsubscribeProperties = onSnapshot(propertiesQuery, (snapshot) => {
      const propertiesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProperties(propertiesData);
      
      // Extract property IDs to query tickets
      const propertyIds = propertiesData.map(property => property.id);
      
      if (propertyIds.length > 0) {
        // Fetch tickets for these properties
        const ticketsRef = collection(db, 'tickets');
        const ticketsQuery = query(
          ticketsRef,
          where('propertyId', 'in', propertyIds),
          orderBy('createdAt', 'desc')
        );
        
        const unsubscribeTickets = onSnapshot(ticketsQuery, (snapshot) => {
          const ticketsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate() || new Date()
          }));
          setTickets(ticketsData);
          setLoading(false);
        }, (err) => {
          console.error('Error fetching tickets:', err);
          setError('Failed to load maintenance tickets');
          setLoading(false);
        });
        
        return () => unsubscribeTickets();
      } else {
        setLoading(false);
      }
    }, (err) => {
      console.error('Error fetching properties:', err);
      setError('Failed to load properties');
      setLoading(false);
    });
    
    // Fetch contractors in landlord's rolodex
    const fetchContractors = async () => {
      try {
        const landlordProfileRef = doc(db, 'landlordProfiles', landlordId);
        const landlordProfileSnap = await getDoc(landlordProfileRef);
        
        if (landlordProfileSnap.exists()) {
          const contractorIds = landlordProfileSnap.data().contractors || [];
          
          if (contractorIds.length > 0) {
            const contractorsData = [];
            
            for (const contractorId of contractorIds) {
              const contractorRef = doc(db, 'users', contractorId);
              const contractorSnap = await getDoc(contractorRef);
              
              if (contractorSnap.exists()) {
                contractorsData.push({
                  id: contractorId,
                  ...contractorSnap.data()
                });
              }
            }
            
            setContractors(contractorsData);
          }
        }
      } catch (err) {
        console.error('Error fetching contractors:', err);
      }
    };
    
    fetchContractors();
    
    return () => unsubscribeProperties();
  }, []);

  const handleTicketSelect = async (ticket) => {
    setSelectedTicket(ticket);
    
    if (ticket.status === 'ready_to_dispatch' && contractors.length > 0) {
      try {
        // Match contractors by specialty
        const matches = contractors.filter(contractor => 
          contractor.specialties?.includes(ticket.issueType)
        );
        
        setRecommendedContractors(matches);
      } catch (err) {
        console.error('Error finding recommended contractors:', err);
      }
    } else {
      setRecommendedContractors([]);
    }
  };

  const handleAssignContractor = async (contractorId) => {
    if (!selectedTicket) return;
    
    setAssigningTicket(true);
    
    try {
      await callFunction('assignContractorToTicket', {
        ticketId: selectedTicket.id,
        contractorId: contractorId
      });
      
      setAssigningTicket(false);
      setSelectedTicket(null);
    } catch (err) {
      console.error('Error assigning contractor:', err);
      setAssigningTicket(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 my-4">
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
    );
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Maintenance Tickets</h1>
      
      {tickets.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">No maintenance tickets found.</p>
          <p className="text-sm text-gray-400 mt-2">
            Tickets will appear here when your tenants submit maintenance requests.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="border-b border-gray-200">
                <div className="px-6 py-4 flex items-center justify-between">
                  <h2 className="text-lg font-medium text-gray-900">All Tickets</h2>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full">
                    {tickets.length} Total
                  </span>
                </div>
              </div>
              
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
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Urgency
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
                        onClick={() => handleTicketSelect(ticket)}
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
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${ticket.status === 'ready_to_dispatch' ? 'bg-yellow-100 text-yellow-800' : 
                              ticket.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                              ticket.status === 'completed' ? 'bg-green-100 text-green-800' :
                              ticket.status === 'pending_classification' ? 'bg-gray-100 text-gray-800' :
                              'bg-red-100 text-red-800'}`}>
                            {ticket.status?.replace(/_/g, ' ') || 'Unknown'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${ticket.urgencyLevel === 'high' ? 'bg-red-100 text-red-800' : 
                              ticket.urgencyLevel === 'normal' ? 'bg-blue-100 text-blue-800' :
                              'bg-green-100 text-green-800'}`}>
                            {ticket.urgencyLevel || 'Normal'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {ticket.createdAt.toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            className="text-blue-600 hover:text-blue-900"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTicketSelect(ticket);
                            }}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          <div>
            {selectedTicket ? (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900">Ticket Details</h3>
                  <p className="text-sm text-gray-500">#{selectedTicket.id.substring(0, 8)}</p>
                </div>
                
                <div className="space-y-4">
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
                    <h4 className="text-sm font-medium text-gray-500">Status</h4>
                    <p className="mt-1">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${selectedTicket.status === 'ready_to_dispatch' ? 'bg-yellow-100 text-yellow-800' : 
                          selectedTicket.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                          selectedTicket.status === 'completed' ? 'bg-green-100 text-green-800' :
                          selectedTicket.status === 'pending_classification' ? 'bg-gray-100 text-gray-800' :
                          'bg-red-100 text-red-800'}`}>
                        {selectedTicket.status?.replace(/_/g, ' ') || 'Unknown'}
                      </span>
                    </p>
                  </div>
                  
                  {selectedTicket.photos?.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Photos</h4>
                      <div className="mt-2 grid grid-cols-2 gap-2">
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
                  
                  {selectedTicket.status === 'ready_to_dispatch' && (
                    <div className="mt-6">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Assign Contractor</h4>
                      
                      {recommendedContractors.length > 0 ? (
                        <div className="space-y-3">
                          <p className="text-xs text-green-700 mb-2">
                            <svg className="inline-block h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {recommendedContractors.length} contractor(s) match this job type
                          </p>
                          
                          {recommendedContractors.map((contractor) => (
                            <div 
                              key={contractor.id}
                              className="flex items-center justify-between p-3 border border-green-200 bg-green-50 rounded-md"
                            >
                              <div>
                                <h5 className="font-medium">{contractor.displayName}</h5>
                                <p className="text-xs text-gray-500">{contractor.companyName || 'Independent'}</p>
                                <div className="flex mt-1">
                                  {contractor.specialties?.map((specialty) => (
                                    <span 
                                      key={specialty}
                                      className={`mr-1 px-1.5 py-0.5 text-xs rounded ${
                                        specialty === selectedTicket.issueType 
                                          ? 'bg-green-200 text-green-800' 
                                          : 'bg-gray-200 text-gray-600'
                                      }`}
                                    >
                                      {specialty}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <button
                                onClick={() => handleAssignContractor(contractor.id)}
                                disabled={assigningTicket}
                                className={`px-3 py-1 text-sm font-medium text-white rounded-md ${
                                  assigningTicket 
                                    ? 'bg-blue-400 cursor-not-allowed' 
                                    : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                              >
                                {assigningTicket ? 'Assigning...' : 'Assign'}
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center p-4 border border-gray-200 rounded-md">
                          <p className="text-gray-500">No matching contractors found</p>
                          <p className="text-xs text-gray-400 mt-1">
                            Try adding contractors with {selectedTicket.issueType} specialty
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {selectedTicket.status !== 'ready_to_dispatch' && selectedTicket.contractorId && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Assigned To</h4>
                      <p className="mt-1 text-gray-900">
                        {contractors.find(c => c.id === selectedTicket.contractorId)?.displayName || 'Unknown Contractor'}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="mt-8">
                  <button
                    type="button"
                    onClick={() => setSelectedTicket(null)}
                    className="w-full inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Close Details
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <p className="text-gray-500">Select a ticket to view details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LandlordTicketDashboard; 