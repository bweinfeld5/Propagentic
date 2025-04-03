import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../assets/images/logo.svg';
import StorySection from './StorySection';
import TeamSection from './TeamSection';
import ValuesSection from './ValuesSection';
import FooterSection from '../landing/FooterSection';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-propagentic-neutral-light dark:bg-propagentic-neutral-dark">
      {/* Navigation */}
      <nav className="bg-white dark:bg-propagentic-neutral-dark shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link to="/">
                <img src={Logo} alt="Propagentic Logo" className="h-10" />
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/features" className="text-propagentic-neutral-dark dark:text-propagentic-neutral-light hover:text-propagentic-teal transition duration-150">Features</Link>
              <Link to="/pricing" className="text-propagentic-neutral-dark dark:text-propagentic-neutral-light hover:text-propagentic-teal transition duration-150">Pricing</Link>
              <Link to="/about" className="text-propagentic-teal font-medium dark:text-propagentic-teal-light">About</Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-propagentic-teal font-medium hover:text-propagentic-teal-dark transition duration-150">Log in</Link>
              <Link to="/signup" className="bg-propagentic-teal text-white px-4 py-2 rounded-lg hover:bg-propagentic-teal-dark transform hover:-translate-y-0.5 transition duration-150">Sign up</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Banner */}
      <div className="bg-propagentic-neutral-light dark:bg-propagentic-neutral-dark">
        <div className="container mx-auto px-6 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-propagentic-neutral-dark dark:text-white mb-6">
              Our Mission to Transform Property Management
            </h1>
            <p className="text-xl text-propagentic-neutral-dark dark:text-propagentic-neutral-light">
              We're building technology that connects landlords, tenants, and contractors
              to make property maintenance simple, transparent, and efficient.
            </p>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <StorySection />
      <ValuesSection />
      <TeamSection />
      
      {/* CTA Section */}
      <div className="bg-propagentic-teal">
        <div className="container mx-auto px-6 py-16 md:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to join us on our journey?
            </h2>
            <p className="text-lg text-white opacity-90 mb-8 max-w-2xl mx-auto">
              Experience the future of property management today. Start connecting your tenants and contractors with our AI-powered platform.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/signup" className="bg-white text-propagentic-teal-dark px-8 py-3 rounded-lg font-medium hover:bg-propagentic-neutral-light transform hover:-translate-y-0.5 transition duration-150 text-center">
                Get Started Free
              </Link>
              <Link to="/contact" className="border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-propagentic-teal-dark transform hover:-translate-y-0.5 transition duration-150 text-center">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <FooterSection />
    </div>
  );
};

export default AboutPage; 