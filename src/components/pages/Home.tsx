import { useRef } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import CountdownTimer from '../CountdownTimer';
import heroImage from '../../assets/hero-image-v3.jpg';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function Home() {
  const { language, t } = useLanguage();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={ref} id="home" className="min-h-screen relative flex items-center justify-center overflow-hidden">
      {/* Hero Background Image */}
      <motion.div 
        style={{ y, opacity }}
        className="absolute inset-0 z-0"
      >
        <img
          src={heroImage}
          alt="Cynthia & Steve"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/60" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto">
          {/* Names & Date */}
          <div className="mb-12">
            <motion.h1 
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

          {/* Welcome Message */}
          <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ duration: 1, delay: 1 }}
             className="mb-16 max-w-2xl mx-auto"
          >
            <p className="text-lg sm:text-xl text-white/90 leading-relaxed font-light italic">
              {t('home.welcome')}
            </p>
          </motion.div>

          {/* Countdown Timer */}
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
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10"
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
