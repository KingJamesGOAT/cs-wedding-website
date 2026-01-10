import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
  activeSection: string;
  onNavigate: (section: string) => void;
}

export default function Header({ activeSection, onNavigate }: HeaderProps) {
  const { language, toggleLanguage, t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Scroll locking effect
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { key: 'home', label: t('nav.home') },
    { key: 'venue', label: t('nav.venue') },
    { key: 'details', label: t('nav.details') },
    { key: 'rsvp', label: t('nav.rsvp') },
    { key: 'registry', label: t('nav.registry') },
    { key: 'gallery', label: t('nav.gallery') },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled || isMenuOpen ? 'glass-header py-2' : 'bg-transparent py-6 md:py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 relative z-50">
          {/* Logo/Names */}
          <button
            onClick={() => {
              onNavigate('home');
              setIsMenuOpen(false);
            }}
            className={`text-2xl font-serif tracking-widest hover:opacity-70 transition-opacity ${isScrolled || isMenuOpen ? 'text-gray-900' : 'text-white'}`}
          >
            Cynthia & Steve
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => onNavigate(item.key)}
                className={`relative text-sm uppercase tracking-widest transition-colors hover:text-opacity-80 ${
                  activeSection === item.key 
                    ? (isScrolled ? 'text-gray-900 font-semibold' : 'text-white font-semibold')
                    : (isScrolled ? 'text-gray-600' : 'text-white/80')
                }`}
              >
                {item.label}
                {activeSection === item.key && (
                  <motion.span 
                    layoutId="underline"
                    className={`absolute -bottom-1 left-0 right-0 h-0.5 ${isScrolled ? 'bg-gray-900' : 'bg-white'}`} 
                  />
                )}
              </button>
            ))}
          </nav>

          {/* Language Toggle & Mobile Menu */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleLanguage}
              className={`px-3 py-1 text-xs uppercase tracking-wider border rounded hover:bg-white/10 transition-colors ${
                isScrolled || isMenuOpen ? 'border-gray-300 text-gray-900' : 'border-white/50 text-white'
              }`}
            >
              {language === 'en' ? 'FR' : 'EN'}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`md:hidden p-2 rounded transition-colors ${
                 isScrolled || isMenuOpen ? 'text-gray-900 hover:bg-gray-100' : 'text-white hover:bg-white/10'
              }`}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.nav
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-white/60 backdrop-blur-xl md:hidden flex flex-col items-center justify-center pt-16"
            >
              <div className="flex flex-col items-center gap-8 p-8 w-full max-w-sm">
                {navItems.map((item, index) => (
                  <motion.button
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    key={item.key}
                    onClick={() => {
                      setIsMenuOpen(false);
                      onNavigate(item.key);
                    }}
                    className={`text-2xl uppercase tracking-[0.2em] transition-all ${
                      activeSection === item.key
                        ? 'text-gray-900 font-semibold scale-110'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {item.label}
                  </motion.button>
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
