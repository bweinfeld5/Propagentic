import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../assets/images/logo.svg';
import LandlordDashboardDemo from './LandlordDashboardDemo';
import ContractorDashboardDemo from './ContractorDashboardDemo';
import TenantDashboardDemo from './TenantDashboardDemo';

const HeroSection = () => {
  const [selectedRole, setSelectedRole] = useState('Landlord');
  
  // Role-based content
  const roleContent = {
    Landlord: {
      headline: "Cut maintenance response times by 65%",
      description: "Connect with verified contractors instantly, track maintenance in real-time, and keep your properties running smoothly with AI-powered workflows.",
      image: "landlord-dashboard.png"
    },
    Contractor: {
      headline: "Get matched with more jobs — instantly",
      description: "Receive job requests that match your skills and availability. No more wasted time on phone calls or driving to unprofitable jobs.",
      image: "contractor-dashboard.png"
    },
    Tenant: {
      headline: "Submit & track issues in real time",
      description: "Report maintenance issues in seconds and watch as they get resolved. No more waiting for callbacks or unclear timelines.",
      image: "tenant-dashboard.png"
    }
  };

  // Save role preference to localStorage
  useEffect(() => {
    localStorage.setItem('preferredRole', selectedRole);
  }, [selectedRole]);
  
  // Load preferred role from localStorage on initial load
  useEffect(() => {
    const savedRole = localStorage.getItem('preferredRole');
    if (savedRole && ['Landlord', 'Contractor', 'Tenant'].includes(savedRole)) {
      setSelectedRole(savedRole);
    }
  }, []);

  return (
    <div className="relative overflow-hidden bg-white dark:bg-propagentic-neutral-dark">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img src={Logo} alt="Propagentic Logo" className="h-10" />
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/features" className="text-propagentic-neutral-dark dark:text-propagentic-neutral-light hover:text-propagentic-teal transition duration-150">Features</Link>
            <Link to="/pricing" className="text-propagentic-neutral-dark dark:text-propagentic-neutral-light hover:text-propagentic-teal transition duration-150">Pricing</Link>
            <Link to="/about" className="text-propagentic-neutral-dark dark:text-propagentic-neutral-light hover:text-propagentic-teal transition duration-150">About</Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login" className="text-propagentic-teal font-medium hover:text-propagentic-teal-dark transition duration-150">Log in</Link>
            <Link to="/signup" className="bg-propagentic-teal text-white px-4 py-2 rounded-lg hover:bg-propagentic-teal-dark transform hover:-translate-y-0.5 transition duration-150">Sign up</Link>
          </div>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="container mx-auto px-6 py-12 md:py-24">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 md:pr-12">
            {/* Role Selector Tabs */}
            <div className="mb-8 inline-flex rounded-md shadow-sm overflow-hidden">
              {['Landlord', 'Contractor', 'Tenant'].map((role) => (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={`px-4 py-2 text-sm font-medium ${
                    selectedRole === role
                      ? 'bg-propagentic-teal text-white'
                      : 'bg-propagentic-neutral text-propagentic-neutral-dark hover:bg-propagentic-neutral-light'
                  } focus:z-10 focus:outline-none transition-colors duration-200`}
                >
                  {role}
                </button>
              ))}
            </div>
            <div className="mb-2 text-sm text-propagentic-neutral-dark dark:text-propagentic-neutral-light">
              I am a:
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-propagentic-neutral-dark dark:text-white leading-tight">
              {roleContent[selectedRole].headline}
            </h1>
            <p className="mt-6 text-xl text-propagentic-neutral-dark dark:text-propagentic-neutral-light">
              {roleContent[selectedRole].description}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link 
                to={`/signup?role=${selectedRole.toLowerCase()}`} 
                className="bg-propagentic-teal text-white px-8 py-3 rounded-lg font-medium hover:bg-propagentic-teal-dark transform hover:-translate-y-0.5 transition duration-150 text-center"
              >
                Get Started Free
              </Link>
              <Link to="/how-it-works" className="border border-propagentic-teal text-propagentic-teal px-8 py-3 rounded-lg font-medium hover:bg-propagentic-teal hover:text-white transform hover:-translate-y-0.5 transition duration-150 text-center">
                See How It Works
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 mt-12 md:mt-0">
            <div className="relative">
              {/* Interactive Dashboard Demo based on selected role */}
              {selectedRole === 'Landlord' && <LandlordDashboardDemo />}
              {selectedRole === 'Contractor' && <ContractorDashboardDemo />}
              {selectedRole === 'Tenant' && <TenantDashboardDemo />}
            </div>
            
            {/* Testimonial Quote */}
            <div className="mt-6 bg-white dark:bg-propagentic-neutral p-6 rounded-lg shadow border border-propagentic-neutral">
              <p className="italic text-propagentic-neutral-dark dark:text-propagentic-neutral-light mb-4">
                "We solved more issues in 2 weeks with Propagentic than all of last quarter."
              </p>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-propagentic-neutral-light mr-3"></div>
                <div>
                  <p className="font-semibold text-propagentic-neutral-dark dark:text-white">Rachel T.</p>
                  <p className="text-sm text-propagentic-neutral-dark dark:text-propagentic-neutral-light">Regional Property Manager</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Security Badges */}
      <div className="container mx-auto px-6 py-8 flex flex-wrap justify-center gap-6">
        <div className="flex items-center space-x-2 text-sm text-propagentic-neutral-dark dark:text-propagentic-neutral-light">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-propagentic-teal" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>GDPR-Compliant</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-propagentic-neutral-dark dark:text-propagentic-neutral-light">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-propagentic-teal" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>SOC2-Ready</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-propagentic-neutral-dark dark:text-propagentic-neutral-light">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-propagentic-teal" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>Firebase Secured</span>
        </div>
      </div>
      
      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
          <path fill="#F9FAF9" fillOpacity="1" d="M0,96L80,106.7C160,117,320,139,480,154.7C640,171,800,181,960,165.3C1120,149,1280,107,1360,85.3L1440,64L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
        </svg>
      </div>
    </div>
  );
};

export default HeroSection; 