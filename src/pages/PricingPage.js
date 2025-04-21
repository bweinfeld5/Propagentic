import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';

const PricingPage = () => {
  const location = useLocation();
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [audienceTab, setAudienceTab] = useState('landlords');
  const [calculatorValues, setCalculatorValues] = useState({
    units: 25,
    requests: 10,
  });
  const [showContactForm, setShowContactForm] = useState(false);
  const [showDemoForm, setShowDemoForm] = useState(false);
  
  // Check for state parameters from redirects
  useEffect(() => {
    if (location.state?.openContactForm) {
      setShowContactForm(true);
    }
    if (location.state?.openDemoForm) {
      setShowDemoForm(true);
    }
  }, [location.state]);
  
  // Calculate annual discount (save 20%)
  const getAnnualPrice = (monthlyPrice) => {
    return (monthlyPrice * 12 * 0.8).toFixed(0);
  };

  // Calculate estimated savings
  const calculateSavings = () => {
    const { units, requests } = calculatorValues;
    const timePerRequest = 1.5; // hours
    const hourlyRate = 35; // dollars
    
    const monthlyRequests = requests * units / 12;
    const timeSaved = monthlyRequests * timePerRequest;
    const moneySaved = timeSaved * hourlyRate;
    
    return {
      timeSaved: timeSaved.toFixed(1),
      moneySaved: moneySaved.toFixed(0)
    };
  };

  const savings = calculateSavings();

  // Contact Form Component
  const ContactForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-propagentic-slate rounded-xl shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-propagentic-slate-dark dark:text-white">Contact Sales</h3>
          <button 
            onClick={() => setShowContactForm(false)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-propagentic-slate dark:text-propagentic-neutral-light mb-1">
              Name
            </label>
            <input 
              type="text" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-propagentic-teal focus:border-propagentic-teal dark:bg-propagentic-slate-dark dark:border-gray-600"
              placeholder="Your name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-propagentic-slate dark:text-propagentic-neutral-light mb-1">
              Email
            </label>
            <input 
              type="email" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-propagentic-teal focus:border-propagentic-teal dark:bg-propagentic-slate-dark dark:border-gray-600"
              placeholder="your@email.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-propagentic-slate dark:text-propagentic-neutral-light mb-1">
              Company
            </label>
            <input 
              type="text" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-propagentic-teal focus:border-propagentic-teal dark:bg-propagentic-slate-dark dark:border-gray-600"
              placeholder="Your company name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-propagentic-slate dark:text-propagentic-neutral-light mb-1">
              Number of properties
            </label>
            <input 
              type="number" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-propagentic-teal focus:border-propagentic-teal dark:bg-propagentic-slate-dark dark:border-gray-600"
              placeholder="100+"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-propagentic-slate dark:text-propagentic-neutral-light mb-1">
              Message
            </label>
            <textarea 
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-propagentic-teal focus:border-propagentic-teal dark:bg-propagentic-slate-dark dark:border-gray-600"
              rows="3"
              placeholder="Tell us about your needs"
            ></textarea>
          </div>
          
          <button 
            type="submit"
            className="w-full py-3 px-4 rounded-lg bg-propagentic-teal text-white hover:bg-propagentic-teal-dark text-center font-medium transition-colors"
          >
            Submit Request
          </button>
        </form>
      </div>
    </div>
  );
  
  // Demo Form Component
  const DemoForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-propagentic-slate rounded-xl shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-propagentic-slate-dark dark:text-white">Schedule a Demo</h3>
          <button 
            onClick={() => setShowDemoForm(false)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-propagentic-slate dark:text-propagentic-neutral-light mb-1">
              Name
            </label>
            <input 
              type="text" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-propagentic-teal focus:border-propagentic-teal dark:bg-propagentic-slate-dark dark:border-gray-600"
              placeholder="Your name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-propagentic-slate dark:text-propagentic-neutral-light mb-1">
              Email
            </label>
            <input 
              type="email" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-propagentic-teal focus:border-propagentic-teal dark:bg-propagentic-slate-dark dark:border-gray-600"
              placeholder="your@email.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-propagentic-slate dark:text-propagentic-neutral-light mb-1">
              Phone
            </label>
            <input 
              type="tel" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-propagentic-teal focus:border-propagentic-teal dark:bg-propagentic-slate-dark dark:border-gray-600"
              placeholder="(123) 456-7890"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-propagentic-slate dark:text-propagentic-neutral-light mb-1">
              Preferred date
            </label>
            <input 
              type="date" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-propagentic-teal focus:border-propagentic-teal dark:bg-propagentic-slate-dark dark:border-gray-600"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-propagentic-slate dark:text-propagentic-neutral-light mb-1">
              Preferred time
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-propagentic-teal focus:border-propagentic-teal dark:bg-propagentic-slate-dark dark:border-gray-600">
              <option>Morning (9AM - 12PM)</option>
              <option>Afternoon (12PM - 5PM)</option>
              <option>Evening (5PM - 8PM)</option>
            </select>
          </div>
          
          <button 
            type="submit"
            className="w-full py-3 px-4 rounded-lg bg-propagentic-teal text-white hover:bg-propagentic-teal-dark text-center font-medium transition-colors"
          >
            Schedule Demo
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="bg-white dark:bg-propagentic-neutral-dark min-h-screen">
      {/* Show modal forms if triggered */}
      {showContactForm && <ContactForm />}
      {showDemoForm && <DemoForm />}
      
      {/* Header Section */}
      <div className="py-16 md:py-24 bg-propagentic-neutral-light dark:bg-propagentic-slate-dark">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-propagentic-slate-dark dark:text-white mb-4">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-propagentic-slate dark:text-propagentic-neutral-light max-w-3xl mx-auto">
              Automate maintenance, save time, and connect with qualified professionals.
            </p>
          </div>
        </div>
      </div>

      {/* Pricing section */}
      <div className="container mx-auto px-6 py-12 -mt-8">
        {/* Audience selection tabs */}
        <div className="max-w-lg mx-auto mb-12 bg-white dark:bg-propagentic-slate rounded-full shadow-md p-1.5">
          <div className="flex">
            <button
              onClick={() => setAudienceTab('landlords')}
              className={`w-1/2 py-3 text-sm md:text-base font-medium rounded-full transition-all duration-200 ${
                audienceTab === 'landlords'
                  ? 'bg-propagentic-teal text-white shadow-md'
                  : 'text-propagentic-slate-dark dark:text-white hover:bg-propagentic-neutral-light dark:hover:bg-propagentic-slate-dark'
              }`}
            >
              For Landlords & Property Managers
            </button>
            <button
              onClick={() => setAudienceTab('contractors')}
              className={`w-1/2 py-3 text-sm md:text-base font-medium rounded-full transition-all duration-200 ${
                audienceTab === 'contractors'
                  ? 'bg-propagentic-teal text-white shadow-md'
                  : 'text-propagentic-slate-dark dark:text-white hover:bg-propagentic-neutral-light dark:hover:bg-propagentic-slate-dark'
              }`}
            >
              For Contractors
            </button>
          </div>
        </div>

        {/* Billing cycle toggle */}
        <div className="max-w-lg mx-auto mb-12">
          <div className="flex items-center justify-center">
            <span
              className={`mr-3 text-sm md:text-base font-medium ${
                billingCycle === 'monthly'
                  ? 'text-propagentic-slate-dark dark:text-white'
                  : 'text-gray-400'
              }`}
            >
              Monthly
            </span>
            <button
              onClick={() =>
                setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')
              }
              className="relative inline-flex h-6 w-12 items-center rounded-full bg-propagentic-neutral-light dark:bg-propagentic-slate transition-colors focus:outline-none"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-propagentic-teal transition-transform ${
                  billingCycle === 'annual' ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
            <span
              className={`ml-3 text-sm md:text-base font-medium ${
                billingCycle === 'annual'
                  ? 'text-propagentic-slate-dark dark:text-white'
                  : 'text-gray-400'
              }`}
            >
              Annual <span className="text-propagentic-teal font-semibold">(Save 20%)</span>
            </span>
          </div>
        </div>

        {/* Landlord/PM pricing plans */}
        {audienceTab === 'landlords' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Starter plan */}
            <div className="bg-white dark:bg-propagentic-slate rounded-xl shadow-lg overflow-hidden transition-all hover:shadow-xl">
              <div className="p-6 md:p-8">
                <h3 className="text-lg font-bold text-propagentic-slate-dark dark:text-white mb-2">Starter</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">Ideal for landlords with &lt; 10 units</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-propagentic-slate-dark dark:text-white">${billingCycle === 'monthly' ? '39' : getAnnualPrice(39)}</span>
                  <span className="text-gray-500 dark:text-gray-400">/{billingCycle === 'monthly' ? 'month' : 'year'}</span>
                </div>
                <Link
                  to="/signup"
                  className="block w-full py-3 px-4 rounded-lg bg-white text-propagentic-teal border border-propagentic-teal hover:bg-propagentic-neutral-light text-center font-medium transition-colors"
                >
                  Get Started
                </Link>
              </div>
              <div className="bg-propagentic-neutral-light dark:bg-propagentic-slate-dark p-6 md:p-8">
                <h4 className="font-semibold text-propagentic-slate-dark dark:text-white mb-4">Features</h4>
                <ul className="space-y-3">
                  {[
                    'Up to 10 Units Managed',
                    'AI Request Intake & Classification',
                    'Basic Ticket Tracking Dashboard',
                    'Standard Contractor Matching',
                    'Up to 25 Automated Dispatches/mo',
                    '1 User Login',
                    'Email Support'
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckIcon className="h-5 w-5 text-propagentic-teal flex-shrink-0 mr-2" />
                      <span className="text-sm text-propagentic-slate-dark dark:text-propagentic-neutral-light">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Pro plan */}
            <div className="bg-white dark:bg-propagentic-slate rounded-xl shadow-lg overflow-hidden transition-all hover:shadow-xl relative md:scale-105 md:z-10 border-2 border-propagentic-teal">
              <div className="absolute top-0 right-0 bg-propagentic-teal text-white text-xs font-bold px-3 py-1">
                MOST POPULAR
              </div>
              <div className="p-6 md:p-8">
                <h3 className="text-lg font-bold text-propagentic-slate-dark dark:text-white mb-2">Pro</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">Perfect for growing portfolios (10-100 units)</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-propagentic-slate-dark dark:text-white">${billingCycle === 'monthly' ? '99' : getAnnualPrice(99)}</span>
                  <span className="text-gray-500 dark:text-gray-400">/{billingCycle === 'monthly' ? 'month' : 'year'}</span>
                </div>
                <Link
                  to="/signup"
                  className="block w-full py-3 px-4 rounded-lg bg-propagentic-teal text-white hover:bg-propagentic-teal-dark text-center font-medium transition-colors"
                >
                  Start Pro Trial
                </Link>
              </div>
              <div className="bg-propagentic-neutral-light dark:bg-propagentic-slate-dark p-6 md:p-8">
                <h4 className="font-semibold text-propagentic-slate-dark dark:text-white mb-4">Features</h4>
                <ul className="space-y-3">
                  {[
                    'Up to 100 Units Managed',
                    'All Starter Features +',
                    'Unlimited AI Requests & Dispatches',
                    'Advanced Contractor Filtering & Ratings',
                    'Enhanced Dashboard & Reporting',
                    'Up to 5 User Logins',
                    'Priority Support (Email & Chat)'
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckIcon className="h-5 w-5 text-propagentic-teal flex-shrink-0 mr-2" />
                      <span className="text-sm text-propagentic-slate-dark dark:text-propagentic-neutral-light">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Business plan */}
            <div className="bg-white dark:bg-propagentic-slate rounded-xl shadow-lg overflow-hidden transition-all hover:shadow-xl">
              <div className="p-6 md:p-8">
                <h3 className="text-lg font-bold text-propagentic-slate-dark dark:text-white mb-2">Business</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">For large portfolios & management companies (100+ units)</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-propagentic-slate-dark dark:text-white">Custom</span>
                </div>
                <Link
                  to="/contact-sales"
                  className="block w-full py-3 px-4 rounded-lg bg-white text-propagentic-teal border border-propagentic-teal hover:bg-propagentic-neutral-light text-center font-medium transition-colors"
                >
                  Contact Sales
                </Link>
              </div>
              <div className="bg-propagentic-neutral-light dark:bg-propagentic-slate-dark p-6 md:p-8">
                <h4 className="font-semibold text-propagentic-slate-dark dark:text-white mb-4">Features</h4>
                <ul className="space-y-3">
                  {[
                    '100+ Units Managed',
                    'All Pro Features +',
                    'Advanced Analytics & Custom Reports',
                    'API Access / Integrations',
                    'Dedicated Account Manager',
                    'Unlimited Users',
                    'Premium Support'
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckIcon className="h-5 w-5 text-propagentic-teal flex-shrink-0 mr-2" />
                      <span className="text-sm text-propagentic-slate-dark dark:text-propagentic-neutral-light">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Contractor pricing plans */}
        {audienceTab === 'contractors' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Basic Profile plan */}
            <div className="bg-white dark:bg-propagentic-slate rounded-xl shadow-lg overflow-hidden transition-all hover:shadow-xl">
              <div className="p-6 md:p-8">
                <h3 className="text-lg font-bold text-propagentic-slate-dark dark:text-white mb-2">Basic Profile</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">Get listed and receive job opportunities</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-propagentic-slate-dark dark:text-white">Free</span>
                </div>
                <Link
                  to="/signup/contractor"
                  className="block w-full py-3 px-4 rounded-lg bg-white text-propagentic-teal border border-propagentic-teal hover:bg-propagentic-neutral-light text-center font-medium transition-colors"
                >
                  Get Listed Free
                </Link>
              </div>
              <div className="bg-propagentic-neutral-light dark:bg-propagentic-slate-dark p-6 md:p-8">
                <h4 className="font-semibold text-propagentic-slate-dark dark:text-white mb-4">Features</h4>
                <ul className="space-y-3">
                  {[
                    'Listing in the Contractor Database',
                    'Name, Trade, Service Area',
                    'Receive Standard Job Alerts',
                    'Basic Profile Page',
                    'Email Notifications'
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckIcon className="h-5 w-5 text-propagentic-teal flex-shrink-0 mr-2" />
                      <span className="text-sm text-propagentic-slate-dark dark:text-propagentic-neutral-light">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Premium Contractor plan */}
            <div className="bg-white dark:bg-propagentic-slate rounded-xl shadow-lg overflow-hidden transition-all hover:shadow-xl border-2 border-propagentic-teal">
              <div className="p-6 md:p-8">
                <h3 className="text-lg font-bold text-propagentic-slate-dark dark:text-white mb-2">Premium Contractor</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">Priority access to qualified jobs & better tools</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-propagentic-slate-dark dark:text-white">${billingCycle === 'monthly' ? '29' : getAnnualPrice(29)}</span>
                  <span className="text-gray-500 dark:text-gray-400">/{billingCycle === 'monthly' ? 'month' : 'year'}</span>
                </div>
                <Link
                  to="/signup/contractor-premium"
                  className="block w-full py-3 px-4 rounded-lg bg-propagentic-teal text-white hover:bg-propagentic-teal-dark text-center font-medium transition-colors"
                >
                  Go Premium
                </Link>
              </div>
              <div className="bg-propagentic-neutral-light dark:bg-propagentic-slate-dark p-6 md:p-8">
                <h4 className="font-semibold text-propagentic-slate-dark dark:text-white mb-4">Features</h4>
                <ul className="space-y-3">
                  {[
                    'All Basic Features +',
                    'Priority Job Alerts',
                    'Enhanced Profile (Reviews, Certifications, Photos)',
                    'Direct In-Platform Communication',
                    'Job Acceptance/Tracking Features',
                    'Featured Listing Option',
                    'Priority Support'
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckIcon className="h-5 w-5 text-propagentic-teal flex-shrink-0 mr-2" />
                      <span className="text-sm text-propagentic-slate-dark dark:text-propagentic-neutral-light">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Interactive Calculator Section */}
        <div className="max-w-4xl mx-auto mt-24 mb-16">
          <h2 className="text-3xl font-bold text-center text-propagentic-slate-dark dark:text-white mb-6">
            Calculate Your Potential Savings
          </h2>
          <p className="text-center text-propagentic-slate dark:text-propagentic-neutral-light mb-12 max-w-3xl mx-auto">
            See how much time and money you could save by automating your maintenance operations with PropAgentic.
          </p>

          <div className="bg-white dark:bg-propagentic-slate rounded-xl shadow-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-bold text-propagentic-slate-dark dark:text-white mb-6">Your Information</h3>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-propagentic-slate dark:text-propagentic-neutral-light mb-2">
                    Number of Units Managed
                  </label>
                  <div className="flex items-center">
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={calculatorValues.units}
                      onChange={(e) => setCalculatorValues({...calculatorValues, units: parseInt(e.target.value)})}
                      className="w-full h-2 bg-propagentic-neutral-light rounded-lg appearance-none cursor-pointer dark:bg-propagentic-slate-dark"
                    />
                    <span className="ml-4 min-w-[50px] text-lg font-semibold text-propagentic-slate-dark dark:text-white">
                      {calculatorValues.units}
                    </span>
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-propagentic-slate dark:text-propagentic-neutral-light mb-2">
                    Average Maintenance Requests Per Unit (Yearly)
                  </label>
                  <div className="flex items-center">
                    <input
                      type="range"
                      min="1"
                      max="20"
                      value={calculatorValues.requests}
                      onChange={(e) => setCalculatorValues({...calculatorValues, requests: parseInt(e.target.value)})}
                      className="w-full h-2 bg-propagentic-neutral-light rounded-lg appearance-none cursor-pointer dark:bg-propagentic-slate-dark"
                    />
                    <span className="ml-4 min-w-[50px] text-lg font-semibold text-propagentic-slate-dark dark:text-white">
                      {calculatorValues.requests}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="bg-propagentic-neutral-light dark:bg-propagentic-slate-dark rounded-xl p-6 flex flex-col justify-center">
                <h3 className="font-bold text-propagentic-slate-dark dark:text-white mb-6">Your Potential Savings</h3>
                
                <div className="mb-4">
                  <p className="text-sm text-propagentic-slate dark:text-propagentic-neutral-light mb-2">
                    Monthly Time Saved:
                  </p>
                  <p className="text-3xl font-bold text-propagentic-teal">
                    {savings.timeSaved} hours
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-propagentic-slate dark:text-propagentic-neutral-light mb-2">
                    Monthly Cost Savings:
                  </p>
                  <p className="text-3xl font-bold text-propagentic-teal">
                    ${savings.moneySaved}
                  </p>
                </div>
                
                <div className="mt-6">
                  <Link
                    to="/signup"
                    className="block w-full py-3 px-4 rounded-lg bg-propagentic-teal text-white hover:bg-propagentic-teal-dark text-center font-medium transition-colors"
                  >
                    Start Saving Today
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Comparison Table */}
        <div className="max-w-6xl mx-auto mt-24 mb-16 overflow-hidden">
          <h2 className="text-3xl font-bold text-center text-propagentic-slate-dark dark:text-white mb-12">
            Compare Features
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-propagentic-neutral-light dark:bg-propagentic-slate-dark">
                  <th className="py-4 px-6 text-left text-sm font-medium text-propagentic-slate-dark dark:text-white">Feature</th>
                  <th className="py-4 px-6 text-center text-sm font-medium text-propagentic-slate-dark dark:text-white">Starter</th>
                  <th className="py-4 px-6 text-center text-sm font-medium text-propagentic-slate-dark dark:text-white bg-propagentic-teal bg-opacity-10">Pro</th>
                  <th className="py-4 px-6 text-center text-sm font-medium text-propagentic-slate-dark dark:text-white">Business</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-propagentic-neutral-light dark:divide-propagentic-slate-dark">
                <tr>
                  <td className="py-4 px-6 text-sm text-propagentic-slate-dark dark:text-white font-medium">Units Managed</td>
                  <td className="py-4 px-6 text-center text-sm text-propagentic-slate dark:text-propagentic-neutral-light">Up to 10</td>
                  <td className="py-4 px-6 text-center text-sm text-propagentic-slate dark:text-propagentic-neutral-light bg-propagentic-teal bg-opacity-5">Up to 100</td>
                  <td className="py-4 px-6 text-center text-sm text-propagentic-slate dark:text-propagentic-neutral-light">100+</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-sm text-propagentic-slate-dark dark:text-white font-medium">AI Request Processing</td>
                  <td className="py-4 px-6 text-center">
                    <CheckIcon className="h-5 w-5 text-propagentic-teal mx-auto" />
                  </td>
                  <td className="py-4 px-6 text-center bg-propagentic-teal bg-opacity-5">
                    <CheckIcon className="h-5 w-5 text-propagentic-teal mx-auto" />
                  </td>
                  <td className="py-4 px-6 text-center">
                    <CheckIcon className="h-5 w-5 text-propagentic-teal mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-sm text-propagentic-slate-dark dark:text-white font-medium">Automated Dispatches</td>
                  <td className="py-4 px-6 text-center text-sm text-propagentic-slate dark:text-propagentic-neutral-light">Up to 25/mo</td>
                  <td className="py-4 px-6 text-center text-sm text-propagentic-slate dark:text-propagentic-neutral-light bg-propagentic-teal bg-opacity-5">Unlimited</td>
                  <td className="py-4 px-6 text-center text-sm text-propagentic-slate dark:text-propagentic-neutral-light">Unlimited</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-sm text-propagentic-slate-dark dark:text-white font-medium">User Logins</td>
                  <td className="py-4 px-6 text-center text-sm text-propagentic-slate dark:text-propagentic-neutral-light">1</td>
                  <td className="py-4 px-6 text-center text-sm text-propagentic-slate dark:text-propagentic-neutral-light bg-propagentic-teal bg-opacity-5">Up to 5</td>
                  <td className="py-4 px-6 text-center text-sm text-propagentic-slate dark:text-propagentic-neutral-light">Unlimited</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-sm text-propagentic-slate-dark dark:text-white font-medium">Advanced Analytics</td>
                  <td className="py-4 px-6 text-center">
                    <XMarkIcon className="h-5 w-5 text-gray-400 mx-auto" />
                  </td>
                  <td className="py-4 px-6 text-center bg-propagentic-teal bg-opacity-5">
                    <CheckIcon className="h-5 w-5 text-propagentic-teal mx-auto" />
                  </td>
                  <td className="py-4 px-6 text-center">
                    <CheckIcon className="h-5 w-5 text-propagentic-teal mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-sm text-propagentic-slate-dark dark:text-white font-medium">API Access</td>
                  <td className="py-4 px-6 text-center">
                    <XMarkIcon className="h-5 w-5 text-gray-400 mx-auto" />
                  </td>
                  <td className="py-4 px-6 text-center bg-propagentic-teal bg-opacity-5">
                    <XMarkIcon className="h-5 w-5 text-gray-400 mx-auto" />
                  </td>
                  <td className="py-4 px-6 text-center">
                    <CheckIcon className="h-5 w-5 text-propagentic-teal mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-sm text-propagentic-slate-dark dark:text-white font-medium">Dedicated Account Manager</td>
                  <td className="py-4 px-6 text-center">
                    <XMarkIcon className="h-5 w-5 text-gray-400 mx-auto" />
                  </td>
                  <td className="py-4 px-6 text-center bg-propagentic-teal bg-opacity-5">
                    <XMarkIcon className="h-5 w-5 text-gray-400 mx-auto" />
                  </td>
                  <td className="py-4 px-6 text-center">
                    <CheckIcon className="h-5 w-5 text-propagentic-teal mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-sm text-propagentic-slate-dark dark:text-white font-medium">Support Level</td>
                  <td className="py-4 px-6 text-center text-sm text-propagentic-slate dark:text-propagentic-neutral-light">Email</td>
                  <td className="py-4 px-6 text-center text-sm text-propagentic-slate dark:text-propagentic-neutral-light bg-propagentic-teal bg-opacity-5">Priority (Email & Chat)</td>
                  <td className="py-4 px-6 text-center text-sm text-propagentic-slate dark:text-propagentic-neutral-light">Premium</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 bg-white dark:bg-propagentic-slate"></td>
                  <td className="py-4 px-6 text-center bg-white dark:bg-propagentic-slate">
                    <Link to="/signup" className="inline-block py-2 px-4 rounded-lg bg-white text-propagentic-teal border border-propagentic-teal hover:bg-propagentic-neutral-light text-center font-medium transition-colors">
                      Get Started
                    </Link>
                  </td>
                  <td className="py-4 px-6 text-center bg-propagentic-teal bg-opacity-5">
                    <Link to="/signup" className="inline-block py-2 px-4 rounded-lg bg-propagentic-teal text-white hover:bg-propagentic-teal-dark text-center font-medium transition-colors">
                      Start Pro Trial
                    </Link>
                  </td>
                  <td className="py-4 px-6 text-center bg-white dark:bg-propagentic-slate">
                    <Link to="/contact-sales" className="inline-block py-2 px-4 rounded-lg bg-white text-propagentic-teal border border-propagentic-teal hover:bg-propagentic-neutral-light text-center font-medium transition-colors">
                      Contact Sales
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Social Proof Section */}
        <div className="max-w-6xl mx-auto mt-24 mb-16">
          <h2 className="text-3xl font-bold text-center text-propagentic-slate-dark dark:text-white mb-12">
            Trusted by Property Managers & Contractors
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "PropAgentic has completely transformed our maintenance workflow. We're saving at least 15 hours per week on maintenance coordination.",
                author: "Sarah T.",
                role: "Property Manager, 85 Units",
                rating: 5
              },
              {
                quote: "As a contractor, the Premium plan has paid for itself many times over. I'm getting higher quality jobs and spending less time on paperwork.",
                author: "Michael R.",
                role: "HVAC Specialist",
                rating: 5
              },
              {
                quote: "The AI classification is surprisingly accurate. It's correctly categorizing maintenance requests and finding the right contractors without my input.",
                author: "James L.",
                role: "Real Estate Investor",
                rating: 4
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white dark:bg-propagentic-slate rounded-xl shadow-lg p-6 md:p-8">
                <div className="flex mb-4">
                  {Array(5).fill(0).map((_, i) => (
                    <svg key={i} className={`h-5 w-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-propagentic-slate dark:text-propagentic-neutral-light mb-6 italic">"{testimonial.quote}"</p>
                <div>
                  <p className="font-bold text-propagentic-slate-dark dark:text-white">{testimonial.author}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-propagentic-neutral-light dark:bg-propagentic-slate-dark py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-propagentic-slate-dark dark:text-white mb-12">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                question: 'How are units counted?',
                answer: 'Units are individual rental properties or apartments managed through the platform. Common areas don\'t count as separate units.'
              },
              {
                question: 'What counts as a dispatch?',
                answer: 'A dispatch is counted each time the system sends a maintenance request to a contractor, including follow-up communications.'
              },
              {
                question: 'Can I change plans later?',
                answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle.'
              },
              {
                question: 'What is the cancellation policy?',
                answer: 'You can cancel at any time. For monthly plans, you won\'t be charged for the following month. For annual plans, we offer prorated refunds.'
              },
              {
                question: 'Do you offer a free trial?',
                answer: 'Yes, we offer a 14-day free trial on our Pro plan so you can experience the full power of our platform before committing.'
              },
              {
                question: 'How does contractor matching work?',
                answer: 'Our AI analyzes maintenance requests and matches them with contractors based on expertise, availability, ratings, and location.'
              }
            ].map((faq, index) => (
              <div key={index}>
                <h3 className="font-bold text-propagentic-slate-dark dark:text-white mb-2">{faq.question}</h3>
                <p className="text-propagentic-slate dark:text-propagentic-neutral-light">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-propagentic-teal py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to transform your property management?
          </h2>
          <p className="text-xl text-white opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of property managers and contractors who are saving time and money with PropAgentic.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link
              to="/signup"
              className="bg-white text-propagentic-teal px-8 py-4 rounded-lg font-medium hover:bg-propagentic-neutral-light transform hover:-translate-y-0.5 transition duration-150 text-center"
            >
              Start Your Free Trial
            </Link>
            <Link
              to="/demo"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-medium hover:bg-white hover:bg-opacity-20 transform hover:-translate-y-0.5 transition duration-150 text-center"
            >
              Schedule a Demo
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage; 