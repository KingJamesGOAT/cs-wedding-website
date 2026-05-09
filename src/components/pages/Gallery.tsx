import { useLanguage } from '../../contexts/LanguageContext';
import { motion } from 'framer-motion';

export default function Gallery() {
  const { t } = useLanguage();
  
  // Generate array for images 001.JPG to 014.JPG
  const images = Array.from({ length: 14 }, (_, i) => `/gallery/${String(i + 1).padStart(3, '0')}.JPG`);

  return (
    <section id="gallery" className="py-20 px-4 sm:px-6 lg:px-8 bg-neutral-900 text-white overflow-hidden">
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
              className="break-inside-avoid mb-4 sm:mb-6 relative group rounded-xl overflow-hidden bg-neutral-800"
            >
              <img
                src={src}
                alt={`Wedding moment ${i + 1}`}
                loading="lazy"
                className="w-full h-auto object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
              />
              {/* Subtle hover overlay to focus the image */}
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
