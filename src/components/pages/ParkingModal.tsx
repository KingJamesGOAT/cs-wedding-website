import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Clock, Car, Map as MapIcon, X, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

interface ParkingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ParkingModal({ isOpen, onClose }: ParkingModalProps) {
  const { t } = useLanguage();
  const [activeParking, setActiveParking] = useState<string | null>(null);

  /* Force Body Scroll Lock to prevent background scrolling */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setActiveParking(null); // Reset visibility on close
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const parkings = [
    {
      id: 'p1',
      title: t('parking.p1.title'),
      type: t('parking.p1.type'),
      dist: t('parking.p1.dist'),
      ideal: t('parking.p1.ideal'),
      note: t('parking.p1.note'),
      address: t('parking.p1.address'),
      coords: '46.8063,7.1620' // Approx for Place Notre-Dame
    },
    {
      id: 'p2',
      title: t('parking.p2.title'),
      type: t('parking.p2.type'),
      dist: t('parking.p2.dist'),
      ideal: t('parking.p2.ideal'),
      note: t('parking.p2.note'),
      address: t('parking.p2.address'),
      coords: '46.8045,7.1585' // Approx for Parking des Alpes
    },
    {
      id: 'p3',
      title: t('parking.p3.title'),
      type: t('parking.p3.type'),
      dist: t('parking.p3.dist'),
      ideal: t('parking.p3.ideal'),
      note: t('parking.p3.note'),
      address: t('parking.p3.address'),
      coords: '46.8032,7.1515' // Approx for Fribourg Centre
    },
    {
      id: 'p4',
      title: t('parking.p4.title'),
      type: t('parking.p4.type'),
      dist: t('parking.p4.dist'),
      ideal: t('parking.p4.ideal'),
      note: t('parking.p4.note'),
      address: t('parking.p4.address'),
      coords: '46.8032,7.1500' // Gare
    }
  ];

  const handleOpenMap = (address: string) => {
    window.open(`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(address)}&destination=Basilique+Notre-Dame+Fribourg&travelmode=walking`, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-[85vw] w-full max-h-[85vh] flex flex-col p-0 bg-neutral-50/95 backdrop-blur-3xl border-neutral-200 overflow-hidden rounded-xl">
        <DialogHeader className="px-6 py-4 bg-white border-b border-neutral-100 flex-shrink-0 flex flex-row items-center gap-4 space-y-0">
          {activeParking && (
            <button 
              onClick={() => setActiveParking(null)}
              className="md:hidden p-2 -ml-2 hover:bg-neutral-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-neutral-600" />
            </button>
          )}
          <DialogTitle className="text-xl md:text-2xl font-serif text-neutral-900 flex-1">
            {activeParking && window.innerWidth < 768 ? t('parking.viewMap') : t('parking.modalTitle')}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col md:flex-row relative">
          
          {/* List Section: Hidden on Mobile if Parking Active */}
          <div className={`
             flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-neutral-50
             ${activeParking ? 'hidden md:block' : 'block'}
          `}>
            {parkings.map((pkg) => (
              <motion.div
                key={pkg.id}
                layoutId={`card-${pkg.id}`}
                onClick={() => setActiveParking(pkg.id)}
                className={`
                  relative p-4 rounded-xl border-2 transition-all cursor-pointer bg-white group hover:border-neutral-300
                  ${activeParking === pkg.id 
                    ? 'border-neutral-900 shadow-md ring-1 ring-neutral-900/5' 
                    : 'border-transparent shadow-sm'}
                `}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-lg text-neutral-900">{pkg.title}</h3>
                  <div className={`
                    w-6 h-6 rounded-full flex items-center justify-center transition-colors
                    ${activeParking === pkg.id ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-400 group-hover:bg-neutral-200'}
                  `}>
                    <MapIcon className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="space-y-3 text-sm text-neutral-600">
                  <div className="flex gap-2.5 items-start">
                     {pkg.id === 'p4' ? <Car className="w-4 h-4 mt-0.5 shrink-0 text-neutral-400" /> : <Car className="w-4 h-4 mt-0.5 shrink-0 text-neutral-400" />} 
                     <span>{pkg.type}</span>
                  </div>
                  
                  <div className="flex gap-2.5 items-center">
                     <Clock className="w-4 h-4 shrink-0 text-neutral-400" />
                     <span className="font-medium text-neutral-900">{pkg.dist}</span>
                  </div>

                  <div className="pl-6 pt-1 text-xs text-neutral-500 space-y-1">
                     <p><span className="font-medium text-neutral-700">{t('parking.noteLabel')}:</span> {pkg.note}</p>
                  </div>
                </div>

                <div className="mt-4 flex gap-2 md:hidden">
                   <Button
                      size="sm"
                      className="w-full text-xs h-9 bg-neutral-900 text-white hover:bg-neutral-800"
                      onClick={(e) => {
                         e.stopPropagation();
                         setActiveParking(pkg.id);
                      }}
                   >
                      {t('parking.viewMap')}
                   </Button>
                </div>
                {/* Desktop Buttons */}
                <div className="mt-4 hidden md:flex gap-2">
                   <Button 
                     size="sm" 
                     variant="outline" 
                     className="w-full text-xs h-8"
                     onClick={(e) => {
                       e.stopPropagation();
                       handleOpenMap(pkg.address);
                     }}
                   >
                     {t('parking.openMap')}
                   </Button>
                   <Button
                      size="sm"
                      variant={activeParking === pkg.id ? "default" : "secondary"}
                      className="w-full text-xs h-8"
                      onClick={(e) => {
                         e.stopPropagation();
                         setActiveParking(pkg.id);
                      }}
                   >
                      {activeParking === pkg.id ? t('parking.closeMap') : t('parking.viewMap')}
                   </Button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Map Section: Full Cover on Mobile if Active */}
          <div className={`
            md:flex-1 bg-neutral-100 relative
            ${activeParking ? 'block flex-1 h-full' : 'hidden md:block'}
            md:block md:h-auto border-l border-neutral-200
            md:relative
          `}>
             <iframe
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={
                  activeParking 
                    ? `https://maps.google.com/maps?saddr=${encodeURIComponent(parkings.find(p => p.id === activeParking)?.address || '')}&daddr=Basilique+Notre-Dame+Fribourg&t=&z=15&ie=UTF8&iwloc=&output=embed`
                    : `https://maps.google.com/maps?q=${encodeURIComponent("Basilique Notre-Dame Fribourg")}&t=&z=15&ie=UTF8&iwloc=&output=embed`
                }
                className="w-full h-full grayscale opacity-90 hover:opacity-100 transition-opacity"
             />
             
             {!activeParking && (
               <div className="absolute inset-0 flex items-center justify-center bg-black/5 pointer-events-none">
                  <div className="bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow-sm text-sm font-medium text-neutral-500">
                    Select a parking to view map
                  </div>
               </div>
             )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
