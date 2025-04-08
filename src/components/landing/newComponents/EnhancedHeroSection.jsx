import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import EnhancedRoleSelector from './EnhancedRoleSelector';
import StickyHeader from './StickyHeader';

const EnhancedHeroSection = () => {
  const [selectedRole, setSelectedRole] = useState('Landlord');
  const roles = ['Landlord', 'Tenant', 'Contractor'];
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.2,
        duration: 0.5
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
  };
  
  // For scroll indicator animation
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <div className="relative">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-propagentic-slate-dark to-propagentic-neutral-dark overflow-hidden">
        {/* Decorative particles */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-propagentic-teal"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 20 + 5}px`,
                height: `${Math.random() * 20 + 5}px`,
              }}
              animate={{
                y: [0, Math.random() * 50 - 25],
                x: [0, Math.random() * 50 - 25],
                scale: [1, Math.random() + 0.5, 1],
              }}
              transition={{
                duration: Math.random() * 5 + 5,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Sticky header */}
      <StickyHeader />
      
      {/* Hero content */}
      <div className="relative pt-32 pb-24 md:pt-40 md:pb-32">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1 
              className="text-4xl md:text-6xl font-bold text-propagentic-neutral-lightest mb-6"
              variants={itemVariants}
            >
              Property Management <span className="text-propagentic-teal">Reimagined</span> with AI
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-propagentic-neutral-light mb-12 max-w-3xl mx-auto"
              variants={itemVariants}
            >
              Connect landlords, tenants, and contractors with our intelligent 
              property management platform that handles everything from 
              maintenance requests to payments.
            </motion.p>
            
            <motion.div
              variants={itemVariants}
              className="mb-16"
            >
              <EnhancedRoleSelector
                roles={roles}
                selectedRole={selectedRole}
                setSelectedRole={setSelectedRole}
              />
            </motion.div>
            
            <motion.div 
              className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center"
              variants={itemVariants}
            >
              <Link 
                to={`/auth?tab=signup&role=${selectedRole.toLowerCase()}`} 
                className="bg-propagentic-teal text-propagentic-neutral-lightest px-8 py-4 rounded-lg font-medium hover:bg-propagentic-teal-dark transform hover:-translate-y-0.5 transition duration-150 text-center"
              >
                Get Started Free
              </Link>
              <Link 
                to="/demo" 
                className="border-2 border-propagentic-neutral-lightest text-propagentic-neutral-lightest px-8 py-4 rounded-lg font-medium hover:bg-propagentic-neutral-lightest hover:bg-opacity-20 transform hover:-translate-y-0.5 transition duration-150 text-center"
              >
                Watch Demo
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-propagentic-neutral-lightest flex flex-col items-center"
        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
        transition={{ duration: 0.3 }}
      >
        <span className="text-sm mb-2">Scroll to explore</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default EnhancedHeroSection; 