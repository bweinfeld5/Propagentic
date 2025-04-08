import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const steps = [
  {
    title: "Submit Maintenance Request",
    description: "Tenants submit maintenance requests with detailed descriptions, photos, and urgency level through the mobile app or web interface.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-propagentic-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    )
  },
  {
    title: "AI Analysis & Classification",
    description: "Our AI engine analyzes the request, classifies the issue type, determines priority, and recommends the best contractor type for the job.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-propagentic-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    )
  },
  {
    title: "Contractor Matching",
    description: "The system automatically matches the request with the best available contractor based on expertise, proximity, and past performance.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-propagentic-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    )
  },
  {
    title: "Work Execution & Tracking",
    description: "Contractors receive and accept jobs, communicate with tenants, document the work with photos, and mark jobs as complete when finished.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-propagentic-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    )
  },
  {
    title: "Review & Payment",
    description: "Landlords review the completed work, tenants provide feedback, and payments are automatically processed through the platform.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-propagentic-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  }
];

const EnhancedAIExplainer = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const playIntervalRef = React.useRef(null);
  
  const handleStepClick = (index) => {
    if (playIntervalRef.current) {
      clearInterval(playIntervalRef.current);
      playIntervalRef.current = null;
    }
    setActiveStep(index);
    setIsPlaying(false);
  };
  
  const handlePlayDemo = () => {
    if (isPlaying) return;
    setIsPlaying(true);
    setActiveStep(0);
    
    let currentStep = 0;
    playIntervalRef.current = setInterval(() => {
      currentStep++;
      if (currentStep >= steps.length) {
        clearInterval(playIntervalRef.current);
        playIntervalRef.current = null;
        setIsPlaying(false);
        return;
      }
      setActiveStep(currentStep);
    }, 3000);
  };
  
  useEffect(() => {
    return () => {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
      }
    };
  }, []);
  
  return (
    <section className="py-16 md:py-24 bg-propagentic-neutral-lightest dark:bg-propagentic-slate-dark">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-propagentic-slate-dark dark:text-propagentic-neutral-lightest mb-4">
            How AI Powers Our Platform
          </h2>
          <p className="text-xl text-propagentic-slate dark:text-propagentic-neutral-light max-w-3xl mx-auto">
            Our intelligent system streamlines the entire maintenance workflow from request to completion.
          </p>
          <motion.button
            onClick={handlePlayDemo}
            disabled={isPlaying}
            className="mt-6 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-propagentic-neutral-lightest bg-propagentic-teal hover:bg-propagentic-teal-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-propagentic-teal disabled:opacity-70"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isPlaying ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-propagentic-neutral-lightest" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Playing Demo...
              </span>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                Play Demo
              </>
            )}
          </motion.button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Steps list */}
          <div className="space-y-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                onClick={() => handleStepClick(index)}
                className={`flex cursor-pointer rounded-lg p-4 transition-all duration-300 ${
                  activeStep === index 
                    ? 'bg-propagentic-teal bg-opacity-10 border-l-4 border-propagentic-teal' 
                    : 'hover:bg-propagentic-neutral-light dark:hover:bg-propagentic-neutral-dark border-l-4 border-transparent'
                }`}
                whileHover={{ x: activeStep === index ? 0 : 5 }}
              >
                <div className="mr-4 flex-shrink-0">
                  {step.icon}
                </div>
                <div>
                  <h3 className={`text-lg font-semibold mb-1 transition-colors duration-200 ${
                    activeStep === index 
                      ? 'text-propagentic-teal' 
                      : 'text-propagentic-slate-dark dark:text-propagentic-neutral-lightest'
                  }`}>
                    {index + 1}. {step.title}
                  </h3>
                  <p className="text-propagentic-slate dark:text-propagentic-neutral-light">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Visual representation */}
          <div className="relative rounded-xl bg-propagentic-neutral-light dark:bg-propagentic-neutral-dark overflow-hidden shadow-card min-h-[400px] flex items-center justify-center">
            <div className="p-8 text-center">
              <div className="mb-6">
                {steps[activeStep].icon}
              </div>
              <h3 className="text-2xl font-bold text-propagentic-slate-dark dark:text-propagentic-neutral-lightest mb-4">
                {steps[activeStep].title}
              </h3>
              <p className="text-propagentic-slate dark:text-propagentic-neutral-light">
                {steps[activeStep].description}
              </p>
              
              {/* Progress indicators */}
              <div className="mt-8 flex justify-center space-x-2">
                {steps.map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleStepClick(index)}
                    className={`w-3 h-3 rounded-full focus:outline-none transition-colors duration-200 ${
                      index === activeStep ? 'bg-propagentic-teal' : 'bg-propagentic-neutral dark:bg-propagentic-neutral-medium'
                    }`}
                    whileHover={{ scale: 1.5 }}
                    animate={index === activeStep ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.5, repeat: isPlaying ? Infinity : 0 }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EnhancedAIExplainer; 