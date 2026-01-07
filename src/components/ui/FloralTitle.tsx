import React from 'react';
import { motion } from 'framer-motion';

interface FloralTitleProps {
  children: React.ReactNode;
  leftIcon: string;
  rightIcon: string;
  className?: string; // Allow passing margin/text styles
  textClassName?: string; // Specific class for the text element
}

const FloralTitle: React.FC<FloralTitleProps> = ({ children, leftIcon, rightIcon, className = '', textClassName = 'text-4xl sm:text-5xl' }) => {
  // Alfalfa Purple Filter


  return (
    <div className={`flex items-center justify-center gap-1 sm:gap-6 ${className}`}>
      {/* Left Flower */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="w-10 h-10 sm:w-16 sm:h-16"
        style={{
          maskImage: `url(${leftIcon})`,
          WebkitMaskImage: `url(${leftIcon})`,
          maskSize: 'contain',
          WebkitMaskSize: 'contain',
          maskRepeat: 'no-repeat',
          WebkitMaskRepeat: 'no-repeat',
          maskPosition: 'center',
          WebkitMaskPosition: 'center',
          background: 'radial-gradient(closest-side, #FF9966, #FF8070, #FF6680, #FF4D90, #FF3399)',
        }}
      />
      
      {/* Title */}
      <div className={`${textClassName} font-serif text-neutral-900 text-center`}>
        {children}
      </div>

      {/* Right Flower */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="w-10 h-10 sm:w-16 sm:h-16"
        style={{
          maskImage: `url(${rightIcon})`,
          WebkitMaskImage: `url(${rightIcon})`,
          maskSize: 'contain',
          WebkitMaskSize: 'contain',
          maskRepeat: 'no-repeat',
          WebkitMaskRepeat: 'no-repeat',
          maskPosition: 'center',
          WebkitMaskPosition: 'center',
          background: 'radial-gradient(closest-side, #FF9966, #FF8070, #FF6680, #FF4D90, #FF3399)',
          transform: 'scaleX(-1)' // Mirror for symmetry
        }}
      />
    </div>
  );
};

export default FloralTitle;
