import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SafeMotion } from '../../shared/SafeMotion';
import { UIComponentErrorBoundary } from '../../shared/ErrorBoundary';
import StatusPill from '../../ui/StatusPill';
import Button from '../../ui/Button';
import { AnimatePresence } from 'framer-motion';

const DashboardPreview = () => {
  const [activeTab, setActiveTab] = useState('landlord');
  const [activeRequest, setActiveRequest] = useState(null);
  const [showFeatureTooltip, setShowFeatureTooltip] = useState(null);
  
  // Mock data matching the screenshot
  const maintenanceRequests = [
    { id: 1, title: 'Leaking faucet in Unit 101', unit: 'Unit 101', timeAgo: '2 hours ago', status: 'New' },
    { id: 2, title: 'Broken thermostat', unit: 'Unit 205', timeAgo: '5 hours ago', status: 'Assigned' }
  ];

  const tenantRequests = [
    { id: 1, title: 'Leaking faucet in bathroom', unit: 'Unit 101', timeAgo: '2 hours ago', status: 'Submitted' },
    { id: 2, title: 'Ceiling fan not working', unit: 'Unit 101', timeAgo: '1 day ago', status: 'In Progress' }
  ];
  
  // Add contractor jobs mock data
  const contractorJobs = [
    { id: 1, title: 'Repair leaking faucet', location: 'Maple Gardens, Unit 101', timeAgo: '3 hours ago', status: 'New', client: 'John Doe' },
    { id: 2, title: 'HVAC maintenance', location: 'Cedar Heights, Unit 302', timeAgo: '1 day ago', status: 'Scheduled', client: 'Lisa Wong' }
  ];
  
  const handleFeatureHover = (feature) => {
    setShowFeatureTooltip(feature);
  };
  
  const renderTooltip = (feature) => {
    if (showFeatureTooltip !== feature) return null;
    
    const tooltipContent = {
      aiPowered: "AI analyzes maintenance requests and automatically categorizes them",
      statCards: "Real-time metrics of your property portfolio",
      maintenanceRequests: "Track and manage all maintenance requests in one place",
      jobStats: "Monitor your job metrics and earnings"
    };
    
    return (
      <SafeMotion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute -top-12 left-1/2 transform -translate-x-1/2 z-10 bg-slate-800 text-white p-2 rounded-md text-xs shadow-lg pointer-events-none whitespace-nowrap"
      >
        {tooltipContent[feature]}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-800"></div>
      </SafeMotion.div>
    );
  };
  
  return (
    <UIComponentErrorBoundary componentName="Dashboard Preview">
      <div className="dashboard-preview-container max-w-6xl mx-auto">
        {/* Toggle buttons */}
        <div className="flex justify-center mb-10">
          <div 
            className="inline-flex flex-wrap justify-center bg-neutral-100 dark:bg-neutral-800 rounded-full p-1 shadow-sm border border-border dark:border-border-dark"
            role="tablist"
            aria-label="Dashboard view selector"
          >
            <Button
              variant={activeTab === 'landlord' ? 'tab-active' : 'tab-inactive'}
              onClick={() => setActiveTab('landlord')}
              size="sm"
              role="tab"
              aria-selected={activeTab === 'landlord'}
              className="!rounded-full"
            >
              Landlord View
            </Button>
            <Button
              variant={activeTab === 'tenant' ? 'tab-active' : 'tab-inactive'}
              onClick={() => setActiveTab('tenant')}
              size="sm"
              role="tab"
              aria-selected={activeTab === 'tenant'}
              className="!rounded-full"
            >
              Tenant View
            </Button>
            <Button
              variant={activeTab === 'contractor' ? 'tab-active' : 'tab-inactive'}
              onClick={() => setActiveTab('contractor')}
              size="sm"
              role="tab"
              aria-selected={activeTab === 'contractor'}
              className="!rounded-full"
            >
              Contractor View
            </Button>
          </div>
        </div>
      
        <SafeMotion.div
          key={activeTab}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="dashboard-preview rounded-xl overflow-hidden shadow-xl border border-border dark:border-border-dark bg-background dark:bg-background-darkSubtle"
        >
          {/* Header */}
          <div className="bg-neutral-100 dark:bg-neutral-800 p-3 flex items-center border-b border-border dark:border-border-dark">
            <div className="flex space-x-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="text-sm font-medium text-content-secondary dark:text-content-darkSecondary mx-auto">
              {activeTab === 'landlord' ? 'Landlord Dashboard' : 
               activeTab === 'tenant' ? 'Tenant Dashboard' : 
               'Contractor Dashboard'}
            </div>
            <div
              className="px-2.5 py-1 bg-primary/10 border border-primary/20 rounded-md text-xs font-semibold text-primary dark:text-primary-light relative shadow-sm cursor-default"
              onMouseEnter={() => handleFeatureHover('aiPowered')}
              onMouseLeave={() => setShowFeatureTooltip(null)}
            >
              ✨ AI-Powered
              {renderTooltip('aiPowered')}
            </div>
          </div>
          
          {/* Dashboard content */}
          <div className="flex flex-col md:flex-row min-h-[450px]">
            {/* Sidebar */}
            <div className="w-full md:w-60 bg-background-subtle dark:bg-background-dark p-5 border-r border-border dark:border-border-dark">
              <div className="flex items-center mb-8">
                <div className="w-10 h-10 rounded-full bg-propagentic-teal flex items-center justify-center text-white text-lg font-bold shadow-inner">P</div>
                <div className="ml-3">
                  <div className="font-semibold text-gray-800 dark:text-gray-100">Propagentic Demo</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {activeTab === 'landlord' ? 'Landlord Account' : 
                     activeTab === 'tenant' ? 'Tenant Portal' : 
                     'Contractor Portal'}
                  </div>
                </div>
              </div>
              
              <nav className="space-y-2">
                <SidebarLink icon={<HomeIcon />} active>Dashboard</SidebarLink>
                {activeTab === 'contractor' ? (
                  <>
                    <SidebarLink icon={<BriefcaseIcon />}>Active Jobs</SidebarLink>
                    <SidebarLink icon={<ClipboardCheckIcon />}>Job History</SidebarLink>
                    <SidebarLink icon={<CurrencyDollarIcon />}>Earnings</SidebarLink>
                  </>
                ) : (
                  <>
                    <SidebarLink icon={<WrenchIcon />}>Maintenance</SidebarLink>
                    {activeTab === 'landlord' && <SidebarLink icon={<BuildingIcon />}>Properties</SidebarLink>}
                    {activeTab === 'tenant' && <SidebarLink icon={<CreditCardIcon />}>Payments</SidebarLink>}
                  </>
                )}
                <SidebarLink icon={<CogIcon />}>Settings</SidebarLink>
              </nav>
            </div>
            
            {/* Main content */}
            <div className="flex-1 p-6 bg-background dark:bg-background-darkSubtle">
              <h2 className="text-2xl font-semibold text-content dark:text-content-dark mb-6">Dashboard Overview</h2>
              
              {/* Stats cards - for landlord view */}
              {activeTab === 'landlord' && (
                <div
                  className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8 relative"
                  onMouseEnter={() => handleFeatureHover('statCards')}
                  onMouseLeave={() => setShowFeatureTooltip(null)}
                >
                  {renderTooltip('statCards')}
                  <StatCard title="Total Properties" value="3" />
                  <StatCard title="Total Units" value="44" />
                  <StatCard title="Occupancy Rate" value="91%" />
                </div>
              )}
              
              {/* Stats for tenant view */}
              {activeTab === 'tenant' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                  <StatCard title="Next Rent Due" value="May 1, 2024" subValue="$1,450.00" />
                  <StatCard title="Lease Ends" value="Oct 31, 2024" subValue="180 days remaining" />
                </div>
              )}
              
              {/* Stats for contractor view */}
              {activeTab === 'contractor' && (
                <div
                  className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8 relative"
                  onMouseEnter={() => handleFeatureHover('jobStats')}
                  onMouseLeave={() => setShowFeatureTooltip(null)}
                >
                  {renderTooltip('jobStats')}
                  <StatCard title="Active Jobs" value="2" />
                  <StatCard title="Completed Jobs" value="24" />
                  <StatCard title="This Month" value="$3,450" subValue="+12% from last month" />
                </div>
              )}
              
              {/* Maintenance requests - dynamically show based on active tab */}
              <div 
                className="relative"
                onMouseEnter={() => handleFeatureHover('maintenanceRequests')}
                onMouseLeave={() => setShowFeatureTooltip(null)}
              >
                {renderTooltip('maintenanceRequests')}
                <h3 className="text-lg font-semibold text-content dark:text-content-dark mb-4">
                  {activeTab === 'landlord' ? 'Recent Maintenance Requests' : 
                   activeTab === 'tenant' ? 'My Maintenance Requests' :
                   'Available Jobs'}
                </h3>
                <div className="space-y-3">
                  {activeTab === 'landlord' ? maintenanceRequests.map(request => (
                    <MaintenanceRequestItem 
                      key={request.id} 
                      request={request} 
                      isActive={activeRequest === request.id}
                      onClick={() => setActiveRequest(request.id === activeRequest ? null : request.id)}
                      activeTab={activeTab}
                    />
                  )) : activeTab === 'tenant' ? tenantRequests.map(request => (
                    <MaintenanceRequestItem 
                      key={request.id} 
                      request={request} 
                      isActive={activeRequest === request.id}
                      onClick={() => setActiveRequest(request.id === activeRequest ? null : request.id)}
                      activeTab={activeTab}
                    />
                  )) : contractorJobs.map(job => (
                    <ContractorJobItem 
                      key={job.id} 
                      job={job} 
                      isActive={activeRequest === job.id}
                      onClick={() => setActiveRequest(job.id === activeRequest ? null : job.id)}
                    />
                  ))}
                </div>
                {/* Add Button for Tenant */}
                {activeTab === 'tenant' && (
                  <div className="mt-6">
                    <Button variant="primary" icon={<PlusIcon className="w-5 h-5"/>}>
                      Submit New Request
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </SafeMotion.div>
        
        <div className="mt-10 text-center">
          <Button to="/demo" size="lg" variant="outline">
            Explore Full Interactive Demo
          </Button>
        </div>
      </div>
    </UIComponentErrorBoundary>
  );
};

// --- Sub Components for Styling --- 

const SidebarLink = ({ icon, children, active = false }) => (
  <a href="#" className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 relative group ${
    active 
      ? 'text-primary dark:text-primary-light font-semibold bg-primary/10 dark:bg-primary/10'
      : 'text-content-secondary dark:text-content-darkSecondary hover:bg-neutral-100 dark:hover:bg-neutral-700/50'
  }`}>
    {active && (
      <span className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-md"></span>
    )}
    {React.cloneElement(icon, { 
      className: `w-5 h-5 mr-3 flex-shrink-0 ${active ? 'text-primary dark:text-primary-light' : 'text-neutral-400 dark:text-neutral-500 group-hover:text-content dark:group-hover:text-content-dark'}`
    })}
    {children}
  </a>
);

// Helper to get an icon based on the StatCard title
const getStatCardIcon = (title) => {
  const iconProps = { className: "w-6 h-6 text-propagentic-teal opacity-70" };
  if (title.includes('Properties')) return <BuildingIcon {...iconProps} />;
  if (title.includes('Units')) return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" /></svg>; // ServerStackIcon
  if (title.includes('Occupancy')) return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m-12 0A5.971 5.971 0 006 18.72m0-3.198a5.968 5.968 0 00-1.07-.281 3 3 0 00-2.874 2.874 6.086 6.086 0 00-1.823.007M3 18.72v-1.027c0-.989.806-1.794 1.794-1.794h4.903c.989 0 1.794.805 1.794 1.794v1.027A5.968 5.968 0 019 18.72m-6 0A5.968 5.968 0 013 15.522m0 0V14.25a2.25 2.25 0 012.25-2.25h3.818c1.11 0 2.09.613 2.58 1.5H18M3 15.522A5.968 5.968 0 003 18.72m18 0v-1.027c0-.989-.806-1.794-1.794-1.794h-4.903c-.989 0-1.794.805-1.794 1.794v1.027A5.968 5.968 0 0115 18.72m-3 0a5.968 5.968 0 01-.75-1.07M15 15.522v-1.271a2.25 2.25 0 00-2.25-2.25H12V7.5m3 8.022H12M12 12.75a.75.75 0 00-.75.75v2.25a.75.75 0 00.75.75h3.75a.75.75 0 000-1.5H12V13.5a.75.75 0 00-.75-.75z" /></svg>; // UsersIcon
  if (title.includes('Rent Due')) return <CreditCardIcon {...iconProps} />;
  if (title.includes('Lease Ends')) return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18M9.75 12.75h4.5" /></svg>; // CalendarDaysIcon
  if (title.includes('Active Jobs')) return <BriefcaseIcon {...iconProps} />;
  if (title.includes('Completed Jobs')) return <ClipboardCheckIcon {...iconProps} />;
  if (title.includes('This Month')) return <CurrencyDollarIcon {...iconProps} />;
  return null;
}

const StatCard = ({ title, value, subValue }) => (
  <div className="bg-background dark:bg-background-dark p-5 rounded-xl shadow-md border border-border dark:border-border-dark flex flex-col justify-between min-h-[120px]">
    <div>
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm font-medium text-content-secondary dark:text-content-darkSecondary">{title}</div>
        {getStatCardIcon(title)}
      </div>
      <div className="text-3xl font-bold text-content dark:text-content-dark">{value}</div>
    </div>
    {subValue && <div className="text-xs text-content-subtle dark:text-content-darkSubtle mt-1 self-start">{subValue}</div>}
  </div>
);

const MaintenanceRequestItem = ({ request, isActive, onClick, activeTab }) => (
  <UIComponentErrorBoundary componentName="Maintenance Request Item">
    <div 
      className={`border border-border dark:border-border-dark rounded-xl transition-all duration-200 ${isActive ? 'bg-primary/5 dark:bg-primary/10 shadow-lg border-primary/30' : 'bg-background dark:bg-background-darkSubtle'}`}
    >
      <div 
        className="flex justify-between items-start p-4 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-700/50" 
        onClick={onClick} 
        aria-expanded={isActive}
        role="button"
        tabIndex={0}
        onKeyPress={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); }}
      >
        <div className="flex-1 pr-4">
          <div className="text-md font-semibold text-content dark:text-content-dark mb-0.5">{request.title}</div>
          <div className="text-xs text-content-secondary dark:text-content-darkSecondary">{request.unit} • {request.timeAgo}</div>
        </div>
        <div className="flex items-center">
          <StatusPill status={request.status} className="mt-0.5 mr-3"/>
          <SafeMotion.div 
            animate={{ rotate: isActive ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-neutral-400 dark:text-neutral-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </SafeMotion.div>
        </div>
      </div>
      
      <AnimatePresence>
        {isActive && (
          <SafeMotion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0, transition: { duration: 0.2 } }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-3 border-t border-border dark:border-border-dark">
              <div className="text-sm text-content dark:text-content-dark">
                <p className="mb-3">
                  {activeTab === 'landlord' 
                  ? `Submitted by: ${request.id === 1 ? 'Alex Johnson' : 'Sarah Chen'} (Unit ${request.unit.split(' ')[1]})`
                  : 'Details: ' + (request.title.includes('faucet') 
                      ? 'Water is continuously dripping from the bathroom sink faucet even when turned off.' 
                      : 'The ceiling fan in the living room doesn\'t turn on when using the switch or pull chain.')
                  }
                </p>
                <div className="flex justify-between items-center">
                  <div className="text-xs text-content-subtle dark:text-content-darkSubtle">
                    ID: REQ-{2024000 + request.id}
                  </div>
                  <Button size="xs" variant="outline">
                    {activeTab === 'landlord' ? 'Manage Request' : 'View Details'}
                  </Button>
                </div>
              </div>
            </div>
          </SafeMotion.div>
        )}
      </AnimatePresence>
    </div>
  </UIComponentErrorBoundary>
);

const ContractorJobItem = ({ job, isActive, onClick }) => (
  <UIComponentErrorBoundary componentName="Contractor Job Item">
    <div 
      className={`border border-border dark:border-border-dark rounded-xl transition-all duration-200 ${isActive ? 'bg-primary/5 dark:bg-primary/10 shadow-lg border-primary/30' : 'bg-background dark:bg-background-darkSubtle'}`}
    >
      <div 
        className="flex justify-between items-start p-4 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-700/50" 
        onClick={onClick} 
        aria-expanded={isActive}
        role="button"
        tabIndex={0}
        onKeyPress={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); }}
      >
        <div className="flex-1 pr-4">
          <div className="text-md font-semibold text-content dark:text-content-dark mb-0.5">{job.title}</div>
          <div className="text-xs text-content-secondary dark:text-content-darkSecondary">{job.location} • {job.timeAgo}</div>
        </div>
        <div className="flex items-center">
          <StatusPill status={job.status} className="mt-0.5 mr-3"/>
          <SafeMotion.div 
            animate={{ rotate: isActive ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-neutral-400 dark:text-neutral-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </SafeMotion.div>
        </div>
      </div>
      
      <AnimatePresence>
        {isActive && (
          <SafeMotion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0, transition: { duration: 0.2 } }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-3 border-t border-border dark:border-border-dark">
              <div className="text-sm text-content dark:text-content-dark">
                <p className="mb-3">
                  Client: {job.client}<br/>
                  {job.title.includes('faucet') 
                    ? 'Fix leaking faucet in bathroom that is dripping continuously. Client reports it may need new washers or cartridge.' 
                    : 'Regular HVAC maintenance and filter replacement. Client reports decreased efficiency and airflow.'}
                </p>
                <div className="flex justify-between items-center">
                  <div className="text-xs text-content-subtle dark:text-content-darkSubtle">
                    Job ID: JOB-{2024000 + job.id}
                  </div>
                  <Button size="xs" variant="outline">
                    View Job Details
                  </Button>
                </div>
              </div>
            </div>
          </SafeMotion.div>
        )}
      </AnimatePresence>
    </div>
  </UIComponentErrorBoundary>
);

// Improved Icons with more consistent styling
const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
  </svg>
);

const WrenchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75a4.5 4.5 0 01-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 11-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 016.336-4.486l-3.276 3.276a3.004 3.004 0 002.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852z" />
  </svg>
);

const BuildingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
  </svg>
);

const CreditCardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
  </svg>
);

const CogIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

// Additional icons
const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

const BriefcaseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
  </svg>
);

const ClipboardCheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75" />
  </svg>
);

const CurrencyDollarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default DashboardPreview; 