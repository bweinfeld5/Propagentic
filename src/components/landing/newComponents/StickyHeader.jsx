import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';

const StickyHeader = () => {
  const [scrolled, setScrolled] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  useEffect(() => {
    if (scrolled) {
      controls.start({
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(8px)',
        boxShadow: 'var(--tw-shadow-card)',
        y: 0,
        transition: { duration: 0.3 }
      });
    } else {
      controls.start({
        backgroundColor: 'rgba(255, 255, 255, 0)',
        backdropFilter: 'blur(0px)',
        boxShadow: 'none',
        y: 0,
        transition: { duration: 0.3 }
      });
    }
  }, [scrolled, controls]);

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50"
      initial={{ backgroundColor: 'rgba(255, 255, 255, 0)', backdropFilter: 'blur(0px)', boxShadow: 'none' }}
      animate={controls}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <img src="/logo.svg" alt="Propagentic Logo" className="h-8 w-auto" />
            <span className={`font-bold text-xl transition-colors duration-300 ${
              scrolled ? 'text-propagentic-teal' : 'text-propagentic-neutral-lightest'
            }`}>
              Propagentic
            </span>
          </Link>
          
          <div className="flex items-center space-x-8">
            <nav className="hidden md:flex items-center space-x-6">
              {['Features', 'Pricing', 'About'].map((item) => (
                <Link 
                  key={item}
                  to={`/${item.toLowerCase()}`} 
                  className={`font-medium hover:text-propagentic-teal transition-colors duration-150 ${
                    scrolled ? 'text-propagentic-slate-dark' : 'text-propagentic-neutral-lightest'
                  }`}
                >
                  {item}
                </Link>
              ))}
            </nav>
            
            <div className="flex items-center space-x-4">
              <Link 
                to="/auth" 
                className={`font-medium hover:text-propagentic-teal transition-colors duration-150 ${
                  scrolled ? 'text-propagentic-teal' : 'text-propagentic-neutral-lightest'
                }`}
              >
                Log in
              </Link>
              <Link 
                to="/auth?tab=signup" 
                className="bg-propagentic-teal text-propagentic-neutral-lightest px-4 py-2 rounded-lg hover:bg-propagentic-teal-dark transform hover:-translate-y-0.5 transition duration-150"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default StickyHeader; 