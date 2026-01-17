
import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Button } from './ui/button';
import { User, Gift, Grape, Info, AlertTriangle } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';

export default function UserSummaryButton() {
  const { t } = useLanguage();
  const [userData, setUserData] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Load data from LocalStorage on open
  useEffect(() => {
    if (isOpen) {
      const stored = localStorage.getItem('wedding_user_data');
      if (stored) {
        setUserData(JSON.parse(stored));
      }
    }
  }, [isOpen]);

  // Listen for custom event to reload data (if we trigger it on submission)
  useEffect(() => {
    const handleStorageUpdate = () => {
        const stored = localStorage.getItem('wedding_user_data');
        if (stored) setUserData(JSON.parse(stored));
    };

    window.addEventListener('storage', handleStorageUpdate);
    window.addEventListener('wedding-data-updated', handleStorageUpdate); 
    
    return () => {
        window.removeEventListener('storage', handleStorageUpdate);
        window.removeEventListener('wedding-data-updated', handleStorageUpdate);
    };
  }, []);


  const hasRsvp = userData && userData.rsvp;
  const hasGifts = userData && userData.gifts && userData.gifts.length > 0;
  const hasApero = userData && userData.rsvp && userData.rsvp.aperoContribution === 'yes';

  return (
    <div className="fixed top-24 right-0 z-50">
       <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
             <button className="
                bg-white/80 backdrop-blur-md border-l border-t border-b border-neutral-200 
                shadow-lg hover:shadow-xl transition-all 
                p-2 md:p-3 rounded-l-xl
                flex flex-col items-center gap-1
                group
                hover:pr-4 hover:bg-white
             ">
                <User className="w-5 h-5 md:w-6 md:h-6 text-neutral-700 group-hover:text-black" />
                <span className="text-[10px] font-medium text-neutral-500 hidden md:block group-hover:text-neutral-900">Dashboard</span>
             </button>
          </SheetTrigger>
          <SheetContent className="w-[90vw] sm:max-w-md bg-white/95 backdrop-blur-xl border-l border-neutral-200">
             <SheetHeader className="mb-6">
                <SheetTitle className="text-2xl font-light font-serif">{t('summary.title')}</SheetTitle>
                <p className="text-sm text-neutral-500">{t('summary.subtitle')}</p>
             </SheetHeader>

             <ScrollArea className="h-[80vh] pr-4">
                <div className="space-y-8">
                   
                   {/* RSVP SECTION */}
                   <div className="space-y-4">
                      <div className="flex items-center gap-2">
                         <div className="p-2 bg-neutral-100 rounded-lg">
                           <User className="w-4 h-4 text-neutral-600" />
                         </div>
                         <h3 className="font-medium text-lg">{t('summary.rsvp.title')}</h3>
                      </div>

                      {hasRsvp ? (
                        <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-100 space-y-3">
                           <div className="flex justify-between items-start">
                              <div>
                                 <p className="font-medium text-neutral-900">{userData.rsvp.firstName} {userData.rsvp.lastName}</p>
                                 <p className="text-xs text-neutral-500">{userData.rsvp.email}</p>
                              </div>
                              <span className={`text-xs px-2 py-1 rounded-full font-medium ${userData.rsvp.attending === 'yes' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                 {userData.rsvp.attending === 'yes' ? t('summary.rsvp.attending') : t('summary.rsvp.notAttending')}
                              </span>
                           </div>

                           {userData.rsvp.attending === 'yes' && (
                             <>
                               <Separator className="bg-neutral-200" />
                               <div className="grid grid-cols-2 gap-2 text-sm">
                                  <div>
                                     <span className="text-neutral-500 block text-xs">{t('summary.rsvp.guestCount')}</span>
                                     <span>{userData.rsvp.guests}</span>
                                  </div>
                                  <div>
                                     <span className="text-neutral-500 block text-xs">{t('summary.rsvp.dinner')}</span>
                                     <span>{userData.rsvp.dinnerAttendance === 'Yes' ? 'Yes' : 'No'}</span>
                                  </div>
                               </div>
                               {userData.rsvp.dietary && (
                                  <div className="text-sm bg-yellow-50 p-2 rounded border border-yellow-100">
                                     <span className="text-neutral-500 block text-xs mb-1">{t('summary.rsvp.dietary')}</span>
                                     <p className="text-neutral-800 italic">{userData.rsvp.dietary}</p>
                                  </div>
                               )}
                             </>
                           )}
                           
                           <div className="pt-2 text-[10px] text-neutral-400 flex items-center gap-1">
                              <Info className="w-3 h-3" />
                              To update, simply submit the RSVP form again.
                           </div>
                        </div>
                      ) : (
                        <div className="text-sm text-neutral-500 italic p-4 border border-dashed rounded-xl text-center">
                           {t('summary.rsvp.notFound')}
                        </div>
                      )}
                   </div>

                   {/* APERO SECTION */}
                   {hasApero && userData.rsvp.attending === 'yes' && (
                      <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                         <div className="flex items-center gap-2">
                            <div className="p-2 bg-amber-100 rounded-lg">
                              <Grape className="w-4 h-4 text-amber-600" />
                            </div>
                            <h3 className="font-medium text-lg">{t('summary.rsvp.apero')}</h3>
                         </div>
                         
                         <div className="bg-amber-50/50 rounded-xl p-4 border border-amber-100 space-y-3">
                            {userData.rsvp.selectedItems && userData.rsvp.selectedItems.length > 0 ? (
                               <div className="space-y-2">
                                  {userData.rsvp.selectedItems.map((item: any, idx: number) => (
                                     <div key={idx} className="flex justify-between items-center bg-white p-2 rounded border border-amber-100 shadow-sm">
                                        <span className="text-sm font-medium text-neutral-800">
                                           {item.label === 'Custom' ? item.customDetails : item.label}
                                        </span>
                                        <span className="text-xs bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                                           {item.quantity * 50} bites
                                        </span>
                                     </div>
                                  ))}
                               </div>
                            ) : (
                               <p className="text-sm">Bringing apero contributions.</p>
                            )}

                            <div className="flex gap-2 items-start text-xs text-amber-800 bg-amber-100/50 p-2 rounded">
                               <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                               <p>{t('summary.rsvp.aperoWarning')}</p>
                            </div>
                         </div>
                      </div>
                   )}

                   {/* GIFTS SECTION */}
                   <div className="space-y-4">
                      <div className="flex items-center gap-2">
                         <div className="p-2 bg-rose-100 rounded-lg">
                           <Gift className="w-4 h-4 text-rose-600" />
                         </div>
                         <h3 className="font-medium text-lg">{t('summary.gifts.title')}</h3>
                      </div>

                      {hasGifts ? (
                         <div className="space-y-3">
                            {userData.gifts.map((gift: any, idx: number) => (
                               <div key={idx} className="bg-white rounded-xl p-4 border border-neutral-200 shadow-sm flex flex-col gap-2">
                                  <div className="flex justify-between items-start">
                                     <h4 className="font-medium text-neutral-900">{gift.item}</h4>
                                     <span className="font-mono font-medium text-neutral-900">CHF {gift.amount}</span>
                                  </div>
                                  <Separator />
                                  <div className="flex justify-between items-center text-xs">
                                     <span className="text-neutral-500">{t('summary.gifts.refCode')}</span>
                                     <span className="font-mono bg-neutral-100 px-2 py-1 rounded text-neutral-700 select-all">
                                        {gift.refCode}
                                     </span>
                                  </div>
                               </div>
                            ))}
                         </div>
                      ) : (
                         <div className="text-sm text-neutral-500 italic p-4 border border-dashed rounded-xl text-center">
                            {t('summary.gifts.none')}
                         </div>
                      )}
                   </div>

                </div>
             </ScrollArea>
           
          </SheetContent>
       </Sheet>
    </div>
  );
}
