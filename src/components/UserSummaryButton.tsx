import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { User, Gift, Grape, AlertTriangle } from 'lucide-react';
import { Separator } from './ui/separator';

interface UserSummaryButtonProps {
  activeSection?: string;
}

export default function UserSummaryButton({ activeSection }: UserSummaryButtonProps) {
  const { t } = useLanguage();
  const [userData, setUserData] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);

  const [isExpanded, setIsExpanded] = useState(false);

  // Load data from LocalStorage on open AND verify with backend
  useEffect(() => {
    if (isOpen) {
      const stored = localStorage.getItem('wedding_user_data');
      if (stored) {
        const parsed = JSON.parse(stored);
        setUserData(parsed);
        if (parsed.rsvp && parsed.rsvp.email) verifyUserStatus(parsed.rsvp.email);
      }
    } else {
        setIsExpanded(false); // Reset on close
    }
  }, [isOpen]);
  // ... (useEffect for storage loaded above)

  // Verify User Status Function
  const verifyUserStatus = async (email: string) => {
      try {
          const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyfVDsivhWotNQbGJN65SzF2xwFlzulSjD2WaVYb2Hx8hKG118J-JzoO5tMCjye1JVb/exec';
          
          // Use POST to verify
          const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify({ type: 'verify', email: email })
          });
          
          if (response.ok) {
              const data = await response.json();
              if (data.status === 'success' && data.exists === false) {
                  console.log('User not found in backend. Clearing local dashboard.');
                  localStorage.removeItem('wedding_user_data');
                  setUserData(null);
                  setIsOpen(false);
                  window.dispatchEvent(new Event('wedding-data-updated'));
              }
          }
      } catch (e) {
          console.warn("Could not verify user status:", e);
      }
  };

  // Listen for custom event
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

  // Hide on Home and Gallery sections
  if (activeSection === 'home' || activeSection === 'gallery') {
    return null;
  }

  const hasRsvp = userData && userData.rsvp;
  const hasGifts = userData && userData.gifts && userData.gifts.length > 0;
  const hasApero = userData && userData.rsvp && (userData.rsvp.aperoContribution === 'yes' || (userData.rsvp.selectedItems && userData.rsvp.selectedItems.length > 0));

  return (
    <div className="fixed top-32 right-0 z-40 animate-in slide-in-from-right-10 duration-700">
       <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
             {/* ... Trigger Button (unchanged) ... */}
             <button className="
                bg-gradient-to-br from-rose-50 via-white to-rose-100/50
                backdrop-blur-md border border-rose-200/60 border-r-0
                shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(255,228,230,0.5)] transition-all 
                py-3 pl-3 pr-2 rounded-l-2xl
                flex flex-col items-center gap-1
                group
                hover:pr-4
             ">
                <div className="bg-white/80 p-1.5 rounded-full group-hover:bg-rose-50 transition-colors shadow-sm ring-1 ring-rose-100">
                   <User className="w-4 h-4 text-rose-400 group-hover:text-rose-500" />
                </div>
                <span className="text-[10px] uppercase tracking-wider font-medium text-rose-900/60 hidden md:block group-hover:text-rose-900 writing-mode-vertical-rl">
                   {t('dashboard.button')}
                </span>
             </button>
          </SheetTrigger>
          <SheetContent 
             side="right" 
             className={`
               w-[90vw] sm:max-w-md 
               bg-white/95 backdrop-blur-xl border border-neutral-200 
               shadow-2xl 
               rounded-2xl 
               rounded-2xl 
               
               h-auto max-h-[55vh]

               /* Transition properties */
               transition-[all] duration-500 ease-in-out

               /* Positioning & Sizing Logic */
               ${isExpanded 
                  ? 'sm:w-[90vw] sm:max-w-4xl sm:h-[85vh] sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:right-auto' 
                  : 'w-[90vw] sm:max-w-md sm:h-auto sm:max-h-[55vh] top-1/2 -translate-y-1/2 right-2 sm:right-6'
               }
               
               p-0 overflow-hidden
               data-[state=open]:!slide-in-from-right-0 data-[state=closed]:!slide-out-to-right-0
               data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0
             `}
          >
             <div className="flex flex-col h-full max-h-full">
               <SheetHeader className="p-6 pb-2 shrink-0 bg-white/50 border-b border-neutral-100 flex flex-row items-center justify-between space-y-0">
                  <div>
                    <SheetTitle className="text-2xl font-light font-serif text-neutral-900 text-left">{t('summary.title')}</SheetTitle>
                    <p className="text-sm text-neutral-500 text-left">{t('summary.subtitle')}</p>
                  </div>
                  
                  {/* EXPAND BUTTON: Hidden on Mobile, Visible on Desktop (sm+) */}
                  <button 
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="p-2 hover:bg-neutral-100 rounded-full transition-colors hidden sm:block" 
                    title={isExpanded ? "Minimize" : "Maximize"}
                  >
                    {isExpanded ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-minimize-2 text-neutral-400"><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="14" y1="10" x2="21" y2="3"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-maximize-2 text-neutral-400"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
                    )}
                  </button>
               </SheetHeader>

                <div className={`
                   flex-1 overflow-y-auto px-6
                   transition-all duration-500
                   ${isExpanded ? '[&_h3]:text-xl [&_p]:text-base [&_.text-sm]:text-base [&_.text-xs]:text-sm' : ''}
                `}>
                  <div className="space-y-8 py-6">
                     
                     {/* RSVP SECTION */}
                     <div className="space-y-3">
                        <div className="flex items-center gap-2">
                           <div className="p-1.5 bg-neutral-100 rounded-lg">
                             <User className="w-4 h-4 text-neutral-600" />
                           </div>
                           <h3 className="font-medium text-base uppercase tracking-wide text-neutral-500">{t('summary.rsvp.title')}</h3>
                        </div>

                        {hasRsvp ? (
                          <div className="bg-white rounded-xl p-4 border border-neutral-200/60 shadow-sm space-y-3 relative overflow-hidden group hover:border-neutral-300 transition-colors">
                             <div className="absolute top-0 left-0 w-1 h-full bg-neutral-200 group-hover:bg-neutral-900 transition-colors" />
                             <div className="flex justify-between items-start pl-2">
                                <div>
                                   <p className="font-medium text-lg text-neutral-900">{userData.rsvp.firstName} {userData.rsvp.lastName}</p>
                                   <p className="text-xs text-neutral-400 font-mono">{userData.rsvp.email}</p>
                                </div>
                                <span className={`text-[10px] uppercase tracking-widest px-2 py-1 rounded-full font-bold ${userData.rsvp.attending === 'yes' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                   {userData.rsvp.attending === 'yes' ? t('summary.rsvp.attending') : t('summary.rsvp.notAttending')}
                                </span>
                             </div>

                             {userData.rsvp.attending === 'yes' && (
                               <>
                                 <Separator className="bg-neutral-100" />
                                 <div className="grid grid-cols-2 gap-4 pl-2">
                                    <div className="bg-neutral-50 p-2 rounded-lg">
                                       <span className="text-neutral-400 block text-[10px] uppercase tracking-wider mb-0.5">{t('summary.rsvp.guestCount')}</span>
                                       <span className="font-medium text-neutral-900">
                                            {userData.rsvp.guests} 
                                            {userData.rsvp.children && parseInt(userData.rsvp.children) > 0 && (
                                                <span className="text-xs text-neutral-500 ml-1 font-normal">
                                                    ({parseInt(userData.rsvp.guests) - parseInt(userData.rsvp.children)} {t('summary.rsvp.adults')}, {userData.rsvp.children} {t('summary.rsvp.children')})
                                                </span>
                                            )}
                                        </span>
                                    </div>
                                    {/* Only show dinner if explicitly set (Yes/No) */}
                                    {userData.rsvp.dinnerAttendance && (
                                       <div className="bg-neutral-50 p-2 rounded-lg">
                                          <span className="text-neutral-400 block text-[10px] uppercase tracking-wider mb-0.5">{t('summary.rsvp.dinner')}</span>
                                          <span className="font-medium text-neutral-900">{userData.rsvp.dinnerAttendance === 'Yes' ? 'Yes' : 'No'}</span>
                                       </div>
                                    )}
                                 </div>
                                 {(userData.rsvp.dietaryType && userData.rsvp.dietaryType !== 'none') || userData.rsvp.dietary ? (
                                    <div className="text-sm bg-yellow-50/50 p-3 rounded-lg border border-yellow-100/50 ml-2">
                                       <span className="text-yellow-600/80 block text-[10px] uppercase tracking-wider mb-1 font-bold">{t('summary.rsvp.dietary')}</span>
                                       
                                       {userData.rsvp.dietaryType && userData.rsvp.dietaryType !== 'none' && (
                                          <p className="text-neutral-900 font-medium mb-1">
                                             {t(`rsvp.dietaryType.${userData.rsvp.dietaryType}`)}
                                          </p>
                                       )}
                                       {userData.rsvp.dietary && (
                                          <p className="text-neutral-800 text-sm italic">"{userData.rsvp.dietary}"</p>
                                       )}
                                    </div>
                                 ) : null}
                                 
                                 <div className="mt-3 pt-3 border-t border-neutral-100/50">
                                   <p className="text-[10px] text-neutral-400 italic text-center">
                                     {t('summary.rsvp.updateHint')}
                                   </p>
                                 </div>
                               </>
                             )}
                          </div>
                        ) : (
                          <div className="text-sm text-neutral-400 p-6 border border-dashed border-neutral-200 rounded-xl text-center bg-neutral-50/50">
                             {t('summary.rsvp.notFound')}
                          </div>
                        )}
                     </div>

                     {/* APERO SECTION */}
                     {hasApero && userData.rsvp.attending === 'yes' && (
                        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
                           <div className="flex items-center gap-2">
                              <div className="p-1.5 bg-amber-100 rounded-lg">
                                <Grape className="w-4 h-4 text-amber-600" />
                              </div>
                              <h3 className="font-medium text-base uppercase tracking-wide text-amber-600/80">{t('summary.rsvp.apero')}</h3>
                           </div>
                           
                           <div className="bg-amber-50/30 rounded-xl p-4 border border-amber-100 space-y-3">
                              {userData.rsvp.selectedItems && userData.rsvp.selectedItems.length > 0 ? (
                                 <div className="space-y-1">
                                    {userData.rsvp.selectedItems.map((item: any, idx: number) => (
                                       <div key={idx} className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-amber-100 shadow-sm group hover:border-amber-300 transition-colors">
                                          <span className="text-sm font-medium text-neutral-800 line-clamp-1">
                                             {item.label === 'Custom' ? item.customDetails : item.label}
                                          </span>
                                          <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-1 rounded-md shrink-0">
                                             {item.quantity * 50} bites
                                          </span>
                                       </div>
                                    ))}
                                 </div>
                              ) : (
                                 <p className="text-sm text-neutral-500 italic">Bringing apero contributions.</p>
                              )}

                              <div className="flex gap-2 items-start text-xs text-amber-800 bg-amber-100/40 p-3 rounded-lg border border-amber-100/50">
                                 <AlertTriangle className="w-4 h-4 shrink-0" />
                                 <p className="leading-snug">{t('summary.rsvp.aperoWarning')}</p>
                              </div>
                           </div>
                        </div>
                     )}

                     {/* GIFTS SECTION */}
                     <div className="space-y-3">
                        <div className="flex items-center gap-2">
                           <div className="p-1.5 bg-rose-100 rounded-lg">
                             <Gift className="w-4 h-4 text-rose-600" />
                           </div>
                           <h3 className="font-medium text-base uppercase tracking-wide text-rose-500/80">{t('summary.gifts.title')}</h3>
                        </div>

                        {hasGifts ? (
                           <div className="space-y-3">
                              {userData.gifts.map((gift: any, idx: number) => (
                                 <div key={idx} className="bg-white rounded-xl p-4 border border-neutral-200 shadow-sm flex flex-col gap-2 group hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start">
                                       <h4 className="font-medium text-neutral-900 text-sm">{gift.item}</h4>
                                       <span className="font-mono font-bold text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded text-xs">CHF {gift.amount}</span>
                                    </div>
                                    <Separator className="bg-neutral-100" />
                                    <div className="flex justify-between items-center text-xs">
                                       <span className="text-neutral-400 uppercase tracking-wider text-[10px]">{t('summary.gifts.refCode')}</span>
                                       <span className="font-mono bg-neutral-50 border border-neutral-200 px-2 py-1 rounded text-neutral-600 select-all cursor-copy hover:bg-neutral-100 transition-colors">
                                          {gift.refCode}
                                       </span>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        ) : (
                           <div className="text-sm text-neutral-400 p-6 border border-dashed border-neutral-200 rounded-xl text-center bg-neutral-50/50">
                              {t('summary.gifts.none')}
                           </div>
                        )}
                     </div>

                  </div>
               </div>
               
               <div className="p-4 border-t border-neutral-100 bg-neutral-50/50 text-center text-[10px] text-neutral-400 shrink-0">
                  Dashboard auto-updates when you submit new forms.
               </div>
             </div>
           
          </SheetContent>
       </Sheet>
    </div>
  );
}
