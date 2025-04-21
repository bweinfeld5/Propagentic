import React from 'react';

// Import core functionality with error handling
let AnimatePresence = ({ children }) => <>{children}</>;
let motion = {
  div: props => <div {...props} />,
  li: props => <li {...props} />
};

try {
  // Dynamic import to avoid build-time errors
  const framerMotion = require('framer-motion');
  AnimatePresence = framerMotion.AnimatePresence || (({ children }) => <>{children}</>);
  motion = framerMotion.motion || motion;
} catch (err) {
  console.error('Error loading framer-motion:', err);
}

// Safe motion components with fallbacks
const SafeDiv = motion.div || (props => <div {...props} />);
const SafeSpan = motion.span || (props => <span {...props} />);

export { AnimatePresence, SafeDiv, SafeSpan, motion };
