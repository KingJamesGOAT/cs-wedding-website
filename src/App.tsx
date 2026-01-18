import { useState, useEffect, Suspense, lazy } from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import Header from './components/Header';
import Home from './components/pages/Home'; // Home is critical, keep eager
import MetaTags from './components/MetaTags';
import { Toaster } from './components/ui/sonner';
import { TooltipProvider } from './components/ui/tooltip';
import LoadingSpinner from './components/ui/LoadingSpinner';



import UserSummaryButton from './components/UserSummaryButton';

// ... (existing imports)

// Lazy load heavy components
const Welcome = lazy(() => import('./components/pages/Welcome'));
const Venue = lazy(() => import('./components/pages/Venue'));
const Details = lazy(() => import('./components/pages/Details'));
const RSVP = lazy(() => import('./components/pages/RSVP'));
const Registry = lazy(() => import('./components/pages/Registry'));
const Gallery = lazy(() => import('./components/pages/Gallery'));

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [homeKey, setHomeKey] = useState(0);
  const [isHeroTitleVisible, setIsHeroTitleVisible] = useState(false);

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

  // Performance: Use IntersectionObserver with MutationObserver to handle lazy loaded sections
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-45% 0px -45% 0px', // Active when element is in the middle of viewport
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const sections = ['home', 'welcome', 'venue', 'details', 'rsvp', 'registry', 'gallery'];

    // Function to observe elements
    const observeSections = () => {
      sections.forEach(id => {
        const element = document.getElementById(id);
        if (element) observer.observe(element);
      });
    };

    // Initial observation
    observeSections();

    // Use MutationObserver to watch for lazy-loaded DOM changes
    const mutationObserver = new MutationObserver(() => {
        observeSections();
    });

    const mainElement = document.querySelector('main');
    if (mainElement) {
        mutationObserver.observe(mainElement, { childList: true, subtree: true });
    }

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return (
    <LanguageProvider>
      <TooltipProvider>
       <MetaTags />
      <div className="min-h-screen bg-white">
        <Header activeSection={activeSection} onNavigate={handleNavigate} isHeroTitleVisible={isHeroTitleVisible} />
        
        {/* Floating User Summary Button */}
        <UserSummaryButton activeSection={activeSection} />

        <main>
          <Home key={homeKey} onHeroTitleVisibilityChange={setIsHeroTitleVisible} />
          
          {/* ... (existing suspense components) */}
          <Suspense fallback={<LoadingSpinner />}>
            <Welcome />
          </Suspense>

          <Suspense fallback={<LoadingSpinner />}>
            <Venue />
          </Suspense>
          
          <Suspense fallback={<LoadingSpinner />}>
            <Details />
          </Suspense>
          
          <Suspense fallback={<LoadingSpinner />}>
            <RSVP />
          </Suspense>
          
          <Suspense fallback={<LoadingSpinner />}>
            <Registry />
          </Suspense>
          
          <Suspense fallback={<LoadingSpinner />}>
            <Gallery />
          </Suspense>
        </main>

        <Toaster />
      </div>
      </TooltipProvider>
    </LanguageProvider>
  );
}
