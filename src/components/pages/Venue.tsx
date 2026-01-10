import { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Button } from '../ui/button';
import { MapPin, Church, Home } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import ceremonyImage from '../../assets/2c1a399487b0eaf24b4eb22a66fb37e1c381bf12.png';
import receptionImage from '../../assets/cbe880ec8c3cdfbbf3a2b6dbf42c2851ff18806c.png';

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

  const maps = {
    ceremony: {
      title: 'Basilique Notre-Dame de Fribourg',
      address: 'Basilique Notre-Dame de Fribourg, Rue de Morat 12, 1700 Fribourg, Switzerland'
    },
    reception: {
      title: language === 'en' ? 'Guglerahof Farm' : 'Ferme Guglerahof',
      address: 'Guglerahof, Guglera 6, 1735 Giffers, Switzerland'
    }
  };

  return (
    <section id="venue" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
            <FloralTitle leftIcon={flower1} rightIcon={flower2}>
              {t('venue.title')}
            </FloralTitle>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Ceremony */}
          <div className="group bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
            <div className="h-72 relative overflow-hidden">
              <img
                src={ceremonyImage}
                alt="Basilique Notre-Dame de Fribourg"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <Church className="w-5 h-5 text-neutral-700" />
                <h3 className="text-2xl">{t('venue.ceremony')}</h3>
              </div>
              <h4 className="mb-2">Basilique Notre-Dame de Fribourg</h4>
              <p className="text-neutral-600 mb-1">Rue de Morat 12</p>
              <p className="text-neutral-600 mb-3">1700 Fribourg, Switzerland</p>
              <p className="mb-3">{t('venue.ceremonyTime')}</p>
              <p className="text-sm text-neutral-600 mb-4">{t('venue.ceremonyNote')}</p>
              <Button
                className="w-full bg-neutral-900 hover:bg-neutral-800"
                onClick={() => setActiveMap('ceremony')}
              >
                <MapPin className="w-4 h-4 mr-2" />
                {t('venue.directions')}
              </Button>
            </div>
          </div>

          {/* Reception */}
          <div className="group bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
            <div className="h-72 relative overflow-hidden">
              <img
                src={receptionImage}
                alt="Guglerahof Farm"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <Home className="w-5 h-5 text-neutral-700" />
                <h3 className="text-2xl">{t('venue.reception')}</h3>
              </div>
              <h4 className="mb-2">
                {language === 'en' ? 'Guglerahof Farm' : 'Ferme Guglerahof'}
              </h4>
              <p className="text-neutral-600 mb-1">Guglera 6</p>
              <p className="text-neutral-600 mb-3">1735 Giffers, Switzerland</p>
              <p className="mb-3">{t('venue.receptionTime')}</p>
              <p className="text-sm text-neutral-600 mb-4">
                {isDinnerGuest ? t('venue.receptionNote.dinner') : t('venue.receptionNote.standard')}
              </p>
              <Button
                className="w-full bg-neutral-900 hover:bg-neutral-800"
                onClick={() => setActiveMap('reception')}
              >
                <MapPin className="w-4 h-4 mr-2" />
                {t('venue.directions')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={!!activeMap} onOpenChange={(open: boolean) => !open && setActiveMap(null)}>
        <DialogContent className="md:max-w-6xl lg:max-w-7xl w-[95vw] h-[80vh] flex flex-col p-0 overflow-hidden bg-white">
          <DialogHeader className="p-4 bg-white z-10 border-b">
            <DialogTitle>{activeMap && maps[activeMap].title}</DialogTitle>
          </DialogHeader>
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
