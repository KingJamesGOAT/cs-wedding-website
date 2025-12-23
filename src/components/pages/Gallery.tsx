import { useLanguage } from '../../contexts/LanguageContext';
import { Camera } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Gallery() {
  const { t } = useLanguage();

  return (
    <section id="gallery" className="py-20 px-4 sm:px-6 lg:px-8 bg-neutral-900 text-white overflow-hidden">
      <div className="max-w-6xl mx-auto">
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
          <p className="text-neutral-400 max-w-2xl mx-auto text-lg mb-8">
            {t('gallery.subtitle')}
          </p>
          <div className="max-w-md mx-auto text-wrap">
            <h3 className="text-xl sm:text-2xl font-serif text-white/90 italic">
              {t('gallery.officialPhotos')}
            </h3>
          </div>
        </motion.div>

        <div className="grid grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-6">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className={`aspect-[4/5] bg-neutral-800/50 rounded-xl border border-neutral-700/50 flex flex-col items-center justify-center group hover:bg-neutral-800 transition-colors ${i === 9 ? 'hidden lg:flex' : 'flex'}`}
            >
              <div className="w-16 h-16 rounded-full bg-neutral-700/50 flex items-center justify-center mb-4 group-hover:bg-neutral-700 transition-colors">
                <Camera className="w-8 h-8 text-neutral-500 group-hover:text-neutral-400" />
              </div>
              <span className="text-neutral-500 font-medium text-sm tracking-wide uppercase group-hover:text-neutral-400 text-center px-2">
                {t('gallery.comingSoon')}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
