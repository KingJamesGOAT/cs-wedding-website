import { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Button } from '../ui/button';
import { MapPin, Church, Home, Copy, Check, Navigation, Car } from 'lucide-react';
import { Dialog, DialogContent } from '../ui/dialog';
import ceremonyImage from '../../assets/hero-desktop-large-2.png';
import receptionImage from '../../assets/hero-mobile-large.png';

import FloralTitle from '../ui/FloralTitle';
import flower1 from '../../assets/flowers/1.svg';
import flower2 from '../../assets/flowers/2.svg';

export default function Venue() {
  const { language, t } = useLanguage();
  const [activeMap, setActiveMap] = useState<'ceremony' | 'reception' | null>(null);
  const [isDinnerGuest, setIsDinnerGuest] = useState(false);

  // Check for Magic Link (?invite=dinner)
  useState(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('invite') === 'dinner') {
      setIsDinnerGuest(true);
    }
  });

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const maps = {
    ceremony: {
      title: 'Basilique Notre-Dame de Fribourg',
      address: 'Basilique Notre-Dame de Fribourg, Rue de Morat 12, 1700 Fribourg, Switzerland',
      coords: '46.8064,7.1620' // Approx coords
    },
    reception: {
      title: language === 'en' ? 'Guglerahof Farm' : 'Ferme Guglerahof',
      address: 'Guglerahof, Guglera 6, 1735 Giffers, Switzerland',
      coords: '46.7589,7.2144' // Approx coords
    }
  };

  const openRoute = () => {
     // Route from Ceremony to Reception
     const origin = encodeURIComponent(maps.ceremony.address);
     const destination = encodeURIComponent(maps.reception.address);
     window.open(`https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`, '_blank');
  };

  const openDirections = (destType: 'ceremony' | 'reception') => {
      const dest = encodeURIComponent(maps[destType].address);
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${dest}`, '_blank');
  };

  return (
    <section id="venue" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
            <FloralTitle leftIcon={flower1} rightIcon={flower2}>
              {t('venue.title')}
            </FloralTitle>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative">
          
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-[28%] left-1/2 -translate-x-1/2 w-16 h-[2px] bg-neutral-200 z-0"></div>
          
          {/* Ceremony */}
          <div className="group bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 z-10 flex flex-col h-full">
            <div className="h-64 sm:h-72 relative overflow-hidden shrink-0">
              <img
                src={ceremonyImage}
                alt="Basilique Notre-Dame de Fribourg"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent transition-opacity duration-300" />
              <div className="absolute bottom-4 left-4 text-white">
                 <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider inline-flex items-center gap-1.5 mb-2 border border-white/30">
                    <Church className="w-3 h-3" />
                    {t('venue.ceremony')}
                 </div>
                 <h3 className="text-xl sm:text-2xl font-serif">Basilique Notre-Dame</h3>
              </div>
            </div>
            
            <div className="p-6 md:p-8 flex flex-col flex-grow">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div className="space-y-1">
                  <p className="text-neutral-900 font-medium text-lg leading-snug">Rue de Morat 12</p>
                  <p className="text-neutral-500">1700 Fribourg, Switzerland</p>
                </div>
                <button
                  onClick={() => handleCopy("Rue de Morat 12, 1700 Fribourg, Switzerland", "ceremony")}
                  className="p-2.5 bg-neutral-50 hover:bg-neutral-100 rounded-xl transition-colors text-neutral-500 hover:text-neutral-900 focus:outline-none border border-neutral-100"
                  title="Copy Address"
                >
                  {copiedId === 'ceremony' ? (
                    <Check className="w-5 h-5 text-green-600" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </button>
              </div>

              <div className="mb-6 space-y-3 p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                  <div className="flex items-center gap-3 text-neutral-700">
                      <span className="font-medium text-neutral-900 shrink-0">14:00</span>
                      <span className="h-4 w-px bg-neutral-300"></span>
                      <span className="text-sm">{t('venue.ceremonyNote')}</span>
                  </div>
              </div>
              
              <div className="mt-auto space-y-3">
                  <Button
                    className="w-full bg-neutral-900 hover:bg-neutral-800 h-11"
                    onClick={() => setActiveMap('ceremony')}
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    {t('venue.directions')}
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="w-full h-11 border-neutral-200 hover:bg-neutral-50 text-neutral-600"
                    onClick={() => openDirections('ceremony')}
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    Open in Maps
                  </Button>
              </div>
            </div>
          </div>

          {/* Info Connector (Mobile/Desktop) */}
          <div className="lg:absolute lg:top-[28%] lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 z-20 w-full lg:w-auto flex justify-center py-4 lg:py-0">
             <div className="bg-white/80 backdrop-blur-md border border-neutral-200 shadow-sm rounded-full px-4 py-2 flex items-center gap-2 text-xs font-medium text-neutral-500 whitespace-nowrap">
                <span className="text-[10px] uppercase tracking-wider mr-1 font-semibold text-neutral-400">
                  {t('venue.commuteLabel')}
                </span>
                <Car className="w-4 h-4 text-neutral-400" />
                <span>~9 km</span>
                <span className="w-1 h-1 bg-neutral-300 rounded-full"></span>
                <span>~15 min</span>
             </div>
          </div>

          {/* Reception */}
          <div className="group bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 z-10 flex flex-col h-full">
            <div className="h-64 sm:h-72 relative overflow-hidden shrink-0">
              <img
                src={receptionImage}
                alt="Guglerahof Farm"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent transition-opacity duration-300" />
              <div className="absolute bottom-4 left-4 text-white">
                 <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider inline-flex items-center gap-1.5 mb-2 border border-white/30">
                    <Home className="w-3 h-3" />
                    {t('venue.reception')}
                 </div>
                 <h3 className="text-xl sm:text-2xl font-serif">
                   {language === 'en' ? 'Guglerahof Farm' : 'Ferme Guglerahof'}
                 </h3>
              </div>
            </div>
            
            <div className="p-6 md:p-8 flex flex-col flex-grow">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div className="space-y-1">
                  <p className="text-neutral-900 font-medium text-lg leading-snug">Guglera 6</p>
                  <p className="text-neutral-500">1735 Giffers, Switzerland</p>
                </div>
                <button
                  onClick={() => handleCopy("Guglera 6, 1735 Giffers, Switzerland", "reception")}
                  className="p-2.5 bg-neutral-50 hover:bg-neutral-100 rounded-xl transition-colors text-neutral-500 hover:text-neutral-900 focus:outline-none border border-neutral-100"
                  title="Copy Address"
                >
                  {copiedId === 'reception' ? (
                    <Check className="w-5 h-5 text-green-600" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </button>
              </div>
              
              <div className="mb-6 space-y-3 p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                  <div className="flex items-center gap-3 text-neutral-700">
                      <span className="font-medium text-neutral-900 shrink-0">16:00</span>
                      <span className="h-4 w-px bg-neutral-300"></span>
                      <span className="text-sm">{isDinnerGuest ? t('venue.receptionNote.dinner') : t('venue.receptionNote.standard')}</span>
                  </div>
              </div>

              <div className="mt-auto space-y-3">
                  <Button
                    className="w-full bg-neutral-900 hover:bg-neutral-800 h-11"
                    onClick={() => setActiveMap('reception')}
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    {t('venue.directions')}
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full h-11 border-neutral-200 hover:bg-neutral-50 text-neutral-600"
                    onClick={openRoute}
                  >
                    <Car className="w-4 h-4 mr-2" />
                    Route from Ceremony
                  </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={!!activeMap} onOpenChange={(open: boolean) => !open && setActiveMap(null)}>
        <DialogContent className="md:max-w-6xl lg:max-w-7xl w-[95vw] h-[80vh] flex flex-col p-0 overflow-hidden bg-white rounded-2xl border-0">
          <div className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur pl-4 pr-2 py-2 rounded-full shadow-lg border border-neutral-100 flex items-center justify-between gap-4">
             <h3 className="font-medium text-neutral-900 truncate max-w-[200px] sm:max-w-md">
                {activeMap && maps[activeMap].title}
             </h3>
             {/* Close button handled by Dialog default but we can add actions here if needed */}
          </div>

          <div className="flex-1 w-full h-full bg-neutral-100">
             {activeMap && (
               <iframe
                 width="100%"
                 height="100%"
                 style={{ border: 0 }}
                 loading="lazy"
                 allowFullScreen
                 referrerPolicy="no-referrer-when-downgrade"
                 src={`https://maps.google.com/maps?q=${encodeURIComponent(maps[activeMap].address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
               ></iframe>
             )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
