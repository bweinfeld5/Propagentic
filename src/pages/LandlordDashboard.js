import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/config';
import { collection, query, where, onSnapshot, getDocs } from 'firebase/firestore';

import OverviewCards from '../components/landlord/OverviewCards';
import RequestFeed from '../components/landlord/RequestFeed';
import PropertyTable from '../components/landlord/PropertyTable';
import TenantTable from '../components/landlord/TenantTable';

const LandlordDashboard = () => {
  const { currentUser, userProfile, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [tenants, setTenants] = useState([]); // Assuming you fetch tenants separately or derive from properties/tickets
  const [loadingData, setLoadingData] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  // Basic redirect and auth loading check
  useEffect(() => {
    if (!authLoading && (!currentUser || userProfile?.userType !== 'landlord')) {
      navigate('/login');
    }
  }, [currentUser, userProfile, authLoading, navigate]);

  // Fetch properties
  useEffect(() => {
    if (!currentUser) return;
    setLoadingData(true);
    const q = query(collection(db, 'properties'), where('landlordId', '==', currentUser.uid));
    
    try {
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const propsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProperties(propsData);
      }, (error) => {
        console.error("Error fetching properties: ", error);
        // Set empty array on error to prevent rendering issues
        setProperties([]);
      });
      
      return () => unsubscribe();
    } catch (error) {
      console.error("Error setting up properties listener: ", error);
      setProperties([]);
      setLoadingData(false);
    }
  }, [currentUser]);

  // Fetch maintenance tickets
  useEffect(() => {
    if (!currentUser) return;
    
    try {
      // TODO: Refine this query to get tickets linked to the landlord's properties
      const q = query(collection(db, 'tickets')); 
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const ticketsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : new Date()
        }));
        setTickets(ticketsData);
        setLoadingData(false);
      }, (error) => {
        console.error("Error fetching tickets: ", error);
        setTickets([]);
        setLoadingData(false);
      });
      
      return () => unsubscribe();
    } catch (error) {
      console.error("Error setting up tickets listener: ", error);
      setTickets([]);
      setLoadingData(false);
    }
  }, [currentUser]);

  // Fetch tenants data
  useEffect(() => {
    if (!currentUser) return;
    
    // Query users collection for tenants linked to landlord's properties
    const fetchTenants = async () => {
      try {
        const tenantsQuery = query(
          collection(db, 'users'), 
          where('userType', '==', 'tenant')
        );
        const tenantsSnapshot = await getDocs(tenantsQuery);
        const tenantsData = tenantsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTenants(tenantsData);
      } catch (error) {
        console.error("Error fetching tenants: ", error);
        // Set empty array on error to prevent rendering issues
        setTenants([]);
      } finally {
        // Ensure loading state is updated regardless of success/failure
        setLoadingData(false);
      }
    };

    fetchTenants();
  }, [currentUser]);

  const handleAssignContractor = (ticketId) => {
    console.log("Assign contractor for ticket:", ticketId);
    // TODO: Implement modal to select contractor
  };

  // Property filter handlers
  const filteredProperties = activeFilter === 'all' 
    ? properties 
    : activeFilter === 'vacant' 
      ? properties.filter(p => !p.isOccupied)
      : properties.filter(p => p.isOccupied);

  // Calculate stats for OverviewCards
  const dashboardStats = {
    totalProperties: properties.length,
    activeTenants: tenants.length,
    openRequests: tickets.filter(t => t.status !== 'completed' && t.status !== 'cancelled').length,
    occupancyRate: properties.length 
      ? Math.round((properties.filter(p => p.isOccupied).length / properties.length) * 100) 
      : 0
  };

  // Display loading indicator until authentication and data are ready
  if (authLoading || loadingData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-t-2 border-b-2 border-teal-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-1 md:p-4">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-800">Landlord Dashboard</h1>
        <p className="text-sm text-slate-500">Welcome back, {userProfile?.firstName || 'Landlord'}</p>
      </div>
      
      {/* 1. Overview Cards Panel */}
      <section aria-labelledby="overview-heading">
        <h2 id="overview-heading" className="sr-only">Dashboard Overview</h2>
        <OverviewCards stats={dashboardStats} />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 2. Maintenance Request Feed */}
        <section aria-labelledby="maintenance-heading" className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md p-5 h-full">
            <div className="flex items-center justify-between mb-4">
              <h2 id="maintenance-heading" className="text-lg font-medium text-gray-900">Maintenance Requests</h2>
              <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                {tickets.filter(t => t.status !== 'completed').length} Open
              </span>
            </div>
            <RequestFeed requests={tickets} onAssignContractor={handleAssignContractor} />
          </div>
        </section>

        {/* Quick Actions Panel */}
        <section aria-labelledby="actions-heading" className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-5 h-full">
            <h2 id="actions-heading" className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full py-2.5 px-4 bg-teal-600 text-white rounded-lg shadow hover:bg-teal-700 transition-colors flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="12" y1="8" x2="12" y2="16"></line>
                  <line x1="8" y1="12" x2="16" y2="12"></line>
                </svg>
                Add New Property
              </button>
              <button className="w-full py-2.5 px-4 bg-white border border-gray-300 text-gray-700 rounded-lg shadow-sm hover:bg-gray-50 transition-colors flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="8.5" cy="7" r="4"></circle>
                  <line x1="20" y1="8" x2="20" y2="14"></line>
                  <line x1="23" y1="11" x2="17" y2="11"></line>
                </svg>
                Invite Tenant
              </button>
              <button className="w-full py-2.5 px-4 bg-white border border-gray-300 text-gray-700 rounded-lg shadow-sm hover:bg-gray-50 transition-colors flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                Generate Report
              </button>
            </div>

            {/* Recent Activity */}
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Recent Activity</h3>
              <div className="space-y-3">
                {tickets.slice(0, 3).map((ticket, index) => (
                  <div key={index} className="flex items-start space-x-3 border-l-2 border-blue-500 pl-3 py-1">
                    <div className="flex-grow">
                      <p className="text-sm font-medium text-gray-900 truncate">{ticket.title || 'Maintenance Request'}</p>
                      <p className="text-xs text-gray-500">{new Date(ticket.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      ticket.status === 'completed' ? 'bg-green-100 text-green-800' : 
                      ticket.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {ticket.status || 'New'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* 3. Property Management Table */}
      <section aria-labelledby="properties-heading" className="bg-white rounded-xl shadow-md p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
          <h2 id="properties-heading" className="text-lg font-medium text-gray-900">Properties</h2>
          <div className="mt-2 sm:mt-0 flex space-x-2">
            <button 
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1 text-xs font-medium rounded-full ${
                activeFilter === 'all' 
                  ? 'bg-teal-100 text-teal-800' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button 
              onClick={() => setActiveFilter('vacant')}
              className={`px-3 py-1 text-xs font-medium rounded-full ${
                activeFilter === 'vacant' 
                  ? 'bg-amber-100 text-amber-800' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              Vacant
            </button>
            <button 
              onClick={() => setActiveFilter('occupied')}
              className={`px-3 py-1 text-xs font-medium rounded-full ${
                activeFilter === 'occupied' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              Fully Occupied
            </button>
          </div>
        </div>
        <PropertyTable properties={filteredProperties} />
      </section>

      {/* 4. Tenant Management Section */}
      <section aria-labelledby="tenants-heading" className="bg-white rounded-xl shadow-md p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
          <h2 id="tenants-heading" className="text-lg font-medium text-gray-900">Tenants</h2>
          <div className="relative mt-2 sm:mt-0">
            <input 
              type="text" 
              placeholder="Search tenants..." 
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-teal-500 focus:border-teal-500 w-full sm:w-64"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
        <TenantTable tenants={tenants} />
      </section>

      {/* Toast notification container */}
      <div aria-live="assertive" className="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start z-50">
        <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
          {/* Toast notifications would be rendered here */}
        </div>
      </div>
    </div>
  );
};

export default LandlordDashboard; 