import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

// Array of aspect ratios to artificially create a varied masonry layout
const aspectClasses = [
  'aspect-[3/4]',
  'aspect-[4/3]',
  'aspect-[4/5]',
  'aspect-square',
  'aspect-[2/3]',
  'aspect-[3/2]',
  'aspect-square',
  'aspect-[3/4]',
  'aspect-[16/9]',
  'aspect-[4/3]',
  'aspect-[4/5]',
  'aspect-[3/4]',
  'aspect-[2/3]',
  'aspect-[3/2]',
];

export default function Gallery() {
  const { t } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  // Generate array for images 001.JPG to 014.JPG
  const images = Array.from({ length: 14 }, (_, i) => `/gallery/${String(i + 1).padStart(3, '0')}.JPG`);

  // Prevent background scrolling when lightbox is open
  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedImage]);

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

        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 sm:gap-6">
          {images.map((src, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: (i % 5) * 0.1 }}
              viewport={{ once: true }}
              className={`break-inside-avoid mb-4 sm:mb-6 relative group rounded-xl overflow-hidden bg-neutral-800 cursor-pointer sm:hover:shadow-[0_0_30px_rgba(0,0,0,0.5)] sm:hover:z-10 transition-all duration-300 ${aspectClasses[i]}`}
              onClick={() => setSelectedImage(src)}
            >
              <img
                src={src}
                alt={`Wedding moment ${i + 1}`}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 ease-in-out sm:group-hover:scale-105"
              />
              {/* Subtle hover overlay to focus the image on desktop */}
              <div className="absolute inset-0 bg-black/20 opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Overlay */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 sm:p-8"
            onClick={() => setSelectedImage(null)}
          >
            {/* Close Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
              className="absolute top-4 right-4 sm:top-8 sm:right-8 p-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-all z-50"
              aria-label="Close image"
            >
              <X className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>

            {/* Image Container - Using motion on the image directly to prevent flex overflow issues */}
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              src={selectedImage}
              alt="Enlarged wedding moment"
              className="max-w-[95vw] max-h-[80vh] sm:max-w-[85vw] sm:max-h-[85vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
