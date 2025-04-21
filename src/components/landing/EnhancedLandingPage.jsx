import React from 'react';
import EnhancedHeroSection from './newComponents/EnhancedHeroSection';
import EnhancedInteractiveDemo from './newComponents/EnhancedInteractiveDemo';
import StatsSection from './newComponents/StatsSection';
import EnhancedComparisonTable from './newComponents/EnhancedComparisonTable';
import EnhancedAIExplainer from './newComponents/EnhancedAIExplainer';
import EnhancedTestimonials from './newComponents/EnhancedTestimonials';
import FaqSection from './newComponents/FaqSection';
import NewsletterSection from './newComponents/NewsletterSection';
import FloatingActionButton from './newComponents/FloatingActionButton';
import FooterSection from './FooterSection';
import DashboardPreview from './newComponents/DashboardPreview';

const EnhancedLandingPage = () => {
  return (
    <div className="min-h-screen bg-propagentic-neutral-lightest dark:bg-propagentic-slate-dark">
      {/* Hero section with sticky header */}
      <EnhancedHeroSection />

      {/* Dashboard Preview Section */}
      <section className="py-16 md:py-24 bg-white dark:bg-propagentic-slate">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-propagentic-slate-dark dark:text-propagentic-neutral-lightest mb-4">
              Powerful Dashboard Management
            </h2>
            <p className="text-xl text-propagentic-slate dark:text-propagentic-neutral-light max-w-3xl mx-auto">
              Manage your properties, monitor maintenance requests, and track key metrics all in one place.
            </p>
          </div>
          <DashboardPreview />
        </div>
      </section>

      {/* Interactive Demo Section - Uncommented */}
      <section className="py-16 md:py-24 bg-propagentic-neutral-light dark:bg-propagentic-neutral-dark">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-propagentic-slate-dark dark:text-propagentic-neutral-lightest mb-4">
              See It In Action
            </h2>
            <p className="text-xl text-propagentic-slate dark:text-propagentic-neutral-light max-w-3xl mx-auto">
              Our interactive demo shows you how Propagentic streamlines maintenance workflows from request to completion.
            </p>
          </div>
          <EnhancedInteractiveDemo />
        </div>
      </section>
      
      {/* Stats section */}
      <StatsSection />
      
      {/* Comparison Table section - Uncommented */}
      <EnhancedComparisonTable />
      
      {/* Enhanced AI Explainer */}
      <EnhancedAIExplainer />
      
      {/* Testimonials */}
      <EnhancedTestimonials />
      
      {/* FAQ section */}
      <FaqSection />
      
      {/* Newsletter signup */}
      <NewsletterSection />
      
      {/* Footer */}
      <FooterSection />
      
      {/* Floating CTA button */}
      <FloatingActionButton />
    </div>
  );
};

export default EnhancedLandingPage; 