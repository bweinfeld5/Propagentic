import React from 'react';

/**
 * SafeMotion - A wrapper for framer-motion components that provides fallbacks
 * in case of compatibility issues with React 19
 */

// --- Initialize Fallbacks First ---

// Default fallback components using React.forwardRef
const createFallbackComponent = (Tag) => React.forwardRef((props, ref) => <Tag ref={ref} {...props} />);

// Initial placeholder for motion components
let motion = {
  div: createFallbackComponent('div'),
  span: createFallbackComponent('span'),
  button: createFallbackComponent('button'),
  a: createFallbackComponent('a'),
  p: createFallbackComponent('p'),
  h1: createFallbackComponent('h1'),
  h2: createFallbackComponent('h2'),
  h3: createFallbackComponent('h3'),
  li: createFallbackComponent('li'),
  ul: createFallbackComponent('ul'),
  img: createFallbackComponent('img'),
  svg: createFallbackComponent('svg'),
  path: createFallbackComponent('path'),
  header: createFallbackComponent('header'), // Added header based on usage
  // Add other common elements as needed
};

// Initial fallback for AnimatePresence
let AnimatePresence = ({ children }) => <>{children}</>;

// --- Attempt to Load Real Framer Motion ---

try {
  // Dynamically require framer-motion
  const framerMotion = require('framer-motion');
  
  // If successful, overwrite placeholders with real components
  if (framerMotion.motion) {
    motion = framerMotion.motion;
    console.log('SafeMotion: Using real framer-motion components.');
  }

  if (framerMotion.AnimatePresence) {
    AnimatePresence = framerMotion.AnimatePresence;
    console.log('SafeMotion: Using real AnimatePresence.');
  }
  
} catch (err) {
  console.error('SafeMotion: Failed to load framer-motion, using fallback components:', err);
}

// --- Exports ---

// Export the motion object itself (which is either real or fallback) aliased as SafeMotion
export const SafeMotion = motion; 

// Export AnimatePresence (which is either real or fallback)
export { AnimatePresence };

// Keep helper for compatibility checks if needed
export const isFramerMotionCompatible = () => {
  try {
    React.createElement(motion.div, { initial: { opacity: 0 } });
    return true;
  } catch (error) {
    return false;
  }
}; 