import { useState, useEffect } from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import Header from './components/Header';

import Home from './components/pages/Home';
import RSVP from './components/pages/RSVP';
import Registry from './components/pages/Registry';
import Venue from './components/pages/Venue';
import Details from './components/pages/Details';
import Gallery from './components/pages/Gallery';
import MetaTags from './components/MetaTags';
import { Toaster } from './components/ui/sonner';
import { TooltipProvider } from './components/ui/tooltip';


export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [homeKey, setHomeKey] = useState(0);

  const handleNavigate = (section: string) => {
    setActiveSection(section);
    
    if (section === 'home') {
      setHomeKey(prev => prev + 1);
    }

    const element = document.getElementById(section);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'venue', 'details', 'rsvp', 'registry', 'gallery'];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <LanguageProvider>
      <TooltipProvider>
       <MetaTags />
      <div className="min-h-screen bg-white">
        <Header activeSection={activeSection} onNavigate={handleNavigate} />
        
        <main>
          <Home key={homeKey} />
          <Venue />
          <Details />
          <RSVP />
          <Registry />
          <Gallery />
        </main>


        <Toaster />
      </div>
      </TooltipProvider>
    </LanguageProvider>
  );
}
