import React from 'react';
import { Link } from 'react-router-dom';
import AboutFounder from '../components/about/AboutFounder';
import Logo from '../assets/images/logo.svg';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-propagentic-neutral-dark">
      {/* Navigation */}
      <nav className="bg-white dark:bg-propagentic-neutral-dark shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex">
              <Link to="/" className="flex-shrink-0 flex items-center">
                <img className="h-8 w-auto" src={Logo} alt="Propagentic" />
                <span className="ml-2 text-xl font-bold text-propagentic-teal">Propagentic</span>
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/features" className="text-propagentic-neutral-dark dark:text-propagentic-neutral-light hover:text-propagentic-teal transition duration-150">Features</Link>
              <Link to="/pricing" className="text-propagentic-neutral-dark dark:text-propagentic-neutral-light hover:text-propagentic-teal transition duration-150">Pricing</Link>
              <Link to="/about" className="text-propagentic-teal font-medium transition duration-150">About</Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-propagentic-teal font-medium hover:text-propagentic-teal-dark transition duration-150">Log in</Link>
              <Link to="/signup" className="bg-propagentic-teal text-white px-4 py-2 rounded-lg hover:bg-propagentic-teal-dark transform hover:-translate-y-0.5 transition duration-150">Sign up</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Header section */}
      <div className="py-16 md:py-24 bg-propagentic-neutral-light dark:bg-propagentic-slate-dark">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-propagentic-slate-dark dark:text-white mb-4">
              About Propagentic
            </h1>
            <p className="text-xl text-propagentic-slate dark:text-propagentic-neutral-light max-w-3xl mx-auto">
              We're on a mission to revolutionize property maintenance through AI-powered workflows.
            </p>
          </div>
        </div>
      </div>

      {/* Mission section */}
      <div className="py-16 bg-white dark:bg-propagentic-neutral-dark">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-propagentic-slate-dark dark:text-white mb-6">Our Mission</h2>
            <div className="text-lg text-propagentic-slate dark:text-propagentic-neutral-light space-y-4">
              <p>
                At Propagentic, we believe that property management shouldn't be complicated. Our AI-powered platform streamlines maintenance workflows, connecting landlords, tenants, and contractors in a seamless ecosystem.
              </p>
              <p>
                We're dedicated to reducing response times, eliminating communication barriers, and creating better experiences for everyone involved in the property maintenance process.
              </p>
              <p>
                By leveraging cutting-edge artificial intelligence, we're able to intelligently categorize and prioritize maintenance requests, match them with the right contractors, and provide transparent tracking from submission to completion.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* About Founder section */}
      <AboutFounder />

      {/* Company Values section */}
      <div className="py-16 bg-white dark:bg-propagentic-neutral-dark">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-propagentic-slate-dark dark:text-white mb-12">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-propagentic-neutral-light dark:bg-propagentic-slate rounded-xl p-6 shadow-md">
              <div className="text-propagentic-teal mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-propagentic-slate-dark dark:text-white mb-2">Innovation</h3>
              <p className="text-propagentic-slate dark:text-propagentic-neutral-light">
                We constantly push boundaries with AI and workflow automation to solve real problems in new ways.
              </p>
            </div>
            <div className="bg-propagentic-neutral-light dark:bg-propagentic-slate rounded-xl p-6 shadow-md">
              <div className="text-propagentic-teal mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-propagentic-slate-dark dark:text-white mb-2">Connectivity</h3>
              <p className="text-propagentic-slate dark:text-propagentic-neutral-light">
                We build bridges between stakeholders, fostering better communication and collaboration.
              </p>
            </div>
            <div className="bg-propagentic-neutral-light dark:bg-propagentic-slate rounded-xl p-6 shadow-md">
              <div className="text-propagentic-teal mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-propagentic-slate-dark dark:text-white mb-2">Reliability</h3>
              <p className="text-propagentic-slate dark:text-propagentic-neutral-light">
                We build systems people can depend on, with transparent processes and consistent results.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-propagentic-teal py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Join us on our mission
          </h2>
          <p className="text-xl text-white opacity-90 mb-8 max-w-2xl mx-auto">
            Experience the future of property maintenance management today.
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

export default AboutPage; 