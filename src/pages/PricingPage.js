import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckIcon } from '@heroicons/react/solid';

const PricingPage = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [audienceTab, setAudienceTab] = useState('landlords');
  
  // Calculate annual discount (save 20%)
  const getAnnualPrice = (monthlyPrice) => {
    return (monthlyPrice * 12 * 0.8).toFixed(0);
  };

  return (
    <div className="bg-white dark:bg-propagentic-neutral-dark min-h-screen">
      {/* Header section */}
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