import { useRef, useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import CountdownTimer from '../CountdownTimer';
import heroImageDesktop from '../../assets/hero-image-v3.jpg';
import heroImageMobile from '../../assets/hero-image-mobile-v2.jpg';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

const desktopImages = [heroImageDesktop];

interface HomeProps {
  onHeroTitleVisibilityChange?: (isVisible: boolean) => void;
}

export default function Home({ onHeroTitleVisibilityChange }: HomeProps) {
  const { language } = useLanguage();
  const ref = useRef(null);
  const titleRef = useRef(null);
  
  const [currentImageIndex, setCurrentImageIndex] = useState(() => Math.floor(Math.random() * desktopImages.length));

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (onHeroTitleVisibilityChange) {
          onHeroTitleVisibilityChange(entry.isIntersecting);
        }
      },
      {
        threshold: 0.1, // Trigger when at least 10% of the title is visible
      }
    );

    if (titleRef.current) {
      observer.observe(titleRef.current);
    }

    return () => {
      if (titleRef.current) {
        observer.unobserve(titleRef.current);
      }
    };
  }, [onHeroTitleVisibilityChange]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % desktopImages.length);
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={ref} id="home" className="min-h-screen relative flex flex-col justify-between overflow-hidden">
      {/* Hero Background Image */}
      <motion.div 
        style={{ y, opacity }}
        className="absolute inset-0 z-0"
      >
        <img
          src={heroImageMobile}
          alt="Cynthia & Steve"
          className="w-full h-full object-cover md:hidden"
        />
        <div className="hidden md:block w-full h-full relative">
          <AnimatePresence mode="popLayout">
            <motion.img
              key={currentImageIndex}
              src={desktopImages[currentImageIndex]}
              alt="Cynthia & Steve"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </AnimatePresence>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/60" />
      </motion.div>

      {/* Top Content: Names & Date */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 pt-24 md:pt-12 w-full">
        <div className="max-w-4xl mx-auto">
          <motion.h1 
            ref={titleRef}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-4xl sm:text-7xl lg:text-9xl text-white mb-6 font-serif tracking-in-expand hero-text-shadow"
          >
            Cynthia & Steve
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="inline-block border-y border-white/30 py-4 px-8 backdrop-blur-sm bg-white/5"
          >
            <p className="text-2xl sm:text-3xl text-white tracking-widest uppercase font-serif">
              {language === 'en' ? 'June 27, 2026' : '27 juin 2026'}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Middle Spacer (implicit with justify-between) */}

      {/* Bottom Content: Countdown Timer */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 pb-32 w-full">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.4 }}
          >
            <CountdownTimer />
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="text-white/70 text-sm tracking-widest uppercase"
        >
          Scroll
        </motion.div>
      </motion.div>
    </section>
  );
}
