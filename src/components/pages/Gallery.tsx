import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

// Array of aspect ratios mapped perfectly to the specific images requested
const aspectClasses = [
  'aspect-[4/3] sm:aspect-[3/4]',    // 001
  'aspect-[4/3]',                    // 002
  'aspect-square sm:aspect-[4/5]',   // 003
  'aspect-[3/2]',                    // 004: Rectangle
  'aspect-square',                   // 005: Square
  'aspect-[3/2] sm:aspect-[2/3]',    // 006
  'aspect-[3/2] sm:aspect-square',   // 007
  'aspect-[16/9]',                   // 008: Full Rectangle
  'aspect-[16/9]',                   // 009
  'aspect-[4/3] sm:aspect-[3/4]',    // 010
  'aspect-[3/2]',                    // 011: Rectangle
  'aspect-[16/9]',                   // 012: Full Rectangle
  'aspect-square sm:aspect-[2/3]',   // 013
  'aspect-[3/2]',                    // 014
];

export default function Gallery() {
  const { t } = useLanguage();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  
  // Generate array for images 001.JPG to 014.JPG
  const images = Array.from({ length: 14 }, (_, i) => `/gallery/${String(i + 1).padStart(3, '0')}.JPG`);

  const handleNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % images.length);
    }
  };

  const handlePrev = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + images.length) % images.length);
    }
  };

  // Keyboard navigation and background scroll lock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape') setSelectedIndex(null);
    };

    if (selectedIndex !== null) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedIndex]);

  return (
    <section id="gallery" className="py-20 px-4 sm:px-6 lg:px-8 bg-neutral-900 text-white overflow-hidden relative">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-serif mb-4 text-white">
            {t('gallery.title')}
          </h2>
          <p className="text-neutral-400 max-w-2xl mx-auto text-lg mb-8 uppercase tracking-widest">
            {t('gallery.subtitle')}
          </p>
        </motion.div>

        {/* Changed to columns-2 for mobile to display 2 images per row */}
        <div className="columns-2 lg:columns-3 xl:columns-4 gap-4 sm:gap-6">
          {images.map((src, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: (i % 5) * 0.1 }}
              viewport={{ once: true }}
              className={`break-inside-avoid mb-4 sm:mb-6 relative group cursor-pointer sm:hover:z-40 ${aspectClasses[i]}`}
              onClick={() => setSelectedIndex(i)}
            >
              {/* Inner container scales up to overlap other images without shifting the grid layout */}
              <div className="w-full h-full relative transition-all duration-300 sm:group-hover:scale-110 sm:group-hover:shadow-[0_10px_40px_rgba(0,0,0,0.8)] rounded-xl overflow-hidden bg-neutral-800 transform-gpu will-change-transform">
                <img
                  src={src}
                  alt={`Wedding moment ${i + 1}`}
                  loading={i < 6 ? "eager" : "lazy"}
                  fetchPriority={i < 6 ? "high" : "auto"}
                  decoding="async"
                  className="w-full h-full object-cover transform-gpu will-change-transform"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Carousel Overlay */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 sm:p-8"
            onClick={() => setSelectedIndex(null)}
          >
            {/* Close Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIndex(null);
              }}
              className="absolute top-4 right-4 sm:top-8 sm:right-8 p-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-all z-50"
              aria-label="Close image"
            >
              <X className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>

            {/* Prev Button (Desktop) */}
            <button
              onClick={(e) => { e.stopPropagation(); handlePrev(); }}
              className="hidden sm:flex absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 p-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-all z-50"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>

            {/* Next Button (Desktop) */}
            <button
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
              className="hidden sm:flex absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 p-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-all z-50"
            >
              <ChevronRight className="w-8 h-8" />
            </button>

            {/* Image Container with Swipe Support */}
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              src={images[selectedIndex]}
              alt="Enlarged wedding moment"
              className="max-w-[95vw] max-h-[80vh] sm:max-w-[85vw] sm:max-h-[85vh] object-contain rounded-lg shadow-2xl cursor-grab active:cursor-grabbing"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(e, { offset }) => {
                const swipe = offset.x;
                if (swipe < -50) handleNext();
                else if (swipe > 50) handlePrev();
              }}
              onClick={(e) => e.stopPropagation()}
            />

            {/* Progress Dots */}
            <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 flex items-center space-x-2 z-50" onClick={(e) => e.stopPropagation()}>
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedIndex(idx)}
                  className={`transition-all duration-300 rounded-full ${selectedIndex === idx ? 'w-3 h-3 bg-white' : 'w-2 h-2 bg-white/40 hover:bg-white/80'}`}
                  aria-label={`Go to image ${idx + 1}`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
