import React from 'react';
import { motion } from 'framer-motion';

interface FloralTitleProps {
  children: React.ReactNode;
  leftIcon: string;
  rightIcon: string;
  className?: string; // Allow passing margin/text styles
}

const FloralTitle: React.FC<FloralTitleProps> = ({ children, leftIcon, rightIcon, className = '' }) => {
  // Alfalfa Purple Filter
  const purpleFilter = 'brightness(0) saturate(100%) invert(16%) sepia(38%) saturate(3023%) hue-rotate(253deg) brightness(92%) contrast(96%)';

  return (
    <div className={`flex items-center justify-center gap-3 sm:gap-6 ${className}`}>
      {/* Left Flower */}
      <motion.img 
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        src={leftIcon} 
        alt="" 
        className="w-10 h-10 sm:w-16 sm:h-16 object-contain"
        style={{ filter: purpleFilter }}
      />
      
      {/* Title */}
      <div className="text-4xl sm:text-5xl font-serif text-neutral-900 text-center">
        {children}
      </div>

      {/* Right Flower */}
      <motion.img 
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        src={rightIcon} 
        alt="" 
        className="w-10 h-10 sm:w-16 sm:h-16 object-contain"
        style={{ 
            filter: purpleFilter,
            transform: 'scaleX(-1)' // Mirror for symmetry
        }}
      />
    </div>
  );
};

export default FloralTitle;
