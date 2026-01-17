import { useRef } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function Welcome() {
  const { t } = useLanguage();
  const ref = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section ref={ref} className="py-24 md:py-32 bg-stone-50 overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div 
          style={{ opacity, y }}
          className="space-y-12"
        >
          {/* Welcome Message */}
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-serif text-stone-800 mb-8">
              {t('welcome.title')}
            </h2>
            <p className="md:hidden text-lg text-stone-600 leading-relaxed italic">
              {t('home.welcome_mobile')}
            </p>
            <p className="hidden md:block text-xl text-stone-600 leading-relaxed font-light">
              {t('home.welcome')}
            </p>
          </div>

          {/* Divider */}
          <div className="w-24 h-px bg-stone-300 mx-auto" />

          {/* Quote */}
          <div>
            <p className="md:hidden text-xl text-stone-800 font-serif italic mb-4 leading-relaxed">
              "{t('home.quote_mobile')}"
            </p>
            <p className="hidden md:block text-2xl md:text-3xl text-stone-800 font-serif italic mb-6 leading-relaxed">
              "{t('home.quote')}"
            </p>
            <p className="text-base text-stone-500 uppercase tracking-widest font-medium">
              ~ {t('home.quoteAuthor')}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
