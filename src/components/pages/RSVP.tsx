import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../ui/tooltip"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover"

import FloralTitle from '../ui/FloralTitle';
import flower5 from '../../assets/flowers/5.svg';
import flower6 from '../../assets/flowers/6.svg';

// Defined Lists
const SAVORY_OPTIONS = [
  "Quiche / Tart",
  "Puff Pastry Twists (Flûtes)",
  "Mini Pizzas",
  "Cheese Platter / Cubes",
  "Charcuterie / Saucisson",
  "Vegetable Sticks & Dip",
  "Tapenade & Crackers",
  "Mini Sandwiches",
  "Tortilla / Spanish Omelet",
  "Cherry Tomatoes & Mozzarella",
  "Savory Cake (Cake Salé)",
  "Hummus & Pita",
  "Gougères (Cheese Puffs)",
  "Deviled Eggs (Oeufs Mimosa)",
  "Bruschetta"
];

const SWEET_OPTIONS = [
  "Chocolate Brownies",
  "Homemade Cookies",
  "Fruit Salad / Skewers",
  "Apple Tart",
  "Muffins / Cupcakes",
  "Lemon Tart",
  "Madeleines",
  "Macarons",
  "Swiss Roll",
  "Mini Donuts",
  "Cheesecake Bites",
  "Chocolate Mousse",
  "Tiramisu",
  "Banana Bread",
  "Meringues"
];

export default function RSVP() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    attending: 'yes',
    firstName: '',
    lastName: '',
    email: '',
    guests: '0',
    children: '0',
    dietaryType: 'none',
    dietary: '',
    // Dinner Field
    dinnerAttendance: '', // 'yes' or 'no' (only for VIPs)
    // Apero Fields
    aperoContribution: 'no',
    aperoType: '',
    aperoItem: '',
    aperoDetails: ''
  });
  
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [takenItems, setTakenItems] = useState<string[]>([]);
  const [isDinnerGuest, setIsDinnerGuest] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  // Auto-close Popover on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (isPopoverOpen) {
        setIsPopoverOpen(false);
      }
    };

    if (isPopoverOpen) {
      // Add passive listener for better performance
      window.addEventListener('scroll', handleScroll, { passive: true });
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isPopoverOpen]);

  // Check for Magic Link (?invite=dinner)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('invite') === 'dinner') {
      setIsDinnerGuest(true);
      // Default dinner attendance to 'yes' if they are invited? Or leave empty?
      // Let's leave it empty or default 'yes' as per user preference. 
      // User didn't specify default, but standard UI pattern is empty or default.
      // We'll initialize it as empty string above, user must select.
    }
  }, []);

  // Fetch taken items on mount
  useEffect(() => {
    const fetchTakenItems = async () => {
      try {
         const response = await fetch('https://script.google.com/macros/s/AKfycbxpq_jKgykf6Ss1U-5kSybzOq3Fz1-yuhADQyy-Fp2WJJNin7KYbD5qr4KKEyVhDuTM/exec');
         const data = await response.json();
         if (data && data.takenAperoItems) {
            setTakenItems(data.takenAperoItems);
         }
      } catch (error) {
         console.error("Failed to fetch taken items", error);
      }
    };
    fetchTakenItems();
  }, []);

  // Scroll to top when submitted
  useEffect(() => {
    if (submitted) {
      const rsvpElement = document.getElementById('rsvp');
      if (rsvpElement) {
        rsvpElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [submitted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Prepare final payload
    const finalData = { ...formData };
    
    // Clean up data based on logic
    if (finalData.attending === 'no') {
       finalData.guests = '0';
       finalData.children = '0';
       finalData.dietaryType = '';
       finalData.dietary = '';
       finalData.dinnerAttendance = '';
       finalData.aperoContribution = 'no';
       finalData.aperoType = '';
       finalData.aperoItem = '';
       finalData.aperoDetails = '';
    } else {
       // If not dinner guest, ensure dinnerAttendance is empty/handled
       if (!isDinnerGuest) {
          finalData.dinnerAttendance = '';
          // We no longer clear dietary here, as it is now available for everyone.
       }

       if (finalData.aperoContribution === 'no') {
          finalData.aperoType = '';
          finalData.aperoItem = '';
          finalData.aperoDetails = '';
       } else {
          // If they selected a preset item (not custom), ensure aperoDetails has a value for safety
          if (finalData.aperoItem !== 'custom' && finalData.aperoItem !== '') {
             finalData.aperoDetails = finalData.aperoItem; 
          }
       }
    }

    try {
      await fetch('https://script.google.com/macros/s/AKfycbxpq_jKgykf6Ss1U-5kSybzOq3Fz1-yuhADQyy-Fp2WJJNin7KYbD5qr4KKEyVhDuTM/exec', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // Maps to Google Sheet Columns
          attending: finalData.attending,
          firstName: finalData.firstName,
          lastName: finalData.lastName,
          email: finalData.email,
          guests: finalData.guests,
          children: finalData.children,
          dietaryType: finalData.dietaryType,
          dietary: finalData.dietary,
          dinnerAttendance: finalData.dinnerAttendance, // New Field
          aperoType: finalData.aperoType,
          aperoItem: finalData.aperoItem,
          aperoDetails: finalData.aperoDetails
        }),
      });

      setSubmitted(true);
      
      // Reset form after 5 seconds
      setTimeout(() => {
        setFormData({ 
          attending: 'yes',
          firstName: '', 
          lastName: '', 
          email: '', 
          guests: '0', 
          children: '0', 
          dietaryType: 'none', 
          dietary: '',
          dinnerAttendance: '',
          aperoContribution: 'no',
          aperoType: '',
          aperoItem: '',
          aperoDetails: ''
        });
        setSubmitted(false);
      }, 5000); 
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <section id="rsvp" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
            <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl mb-2">{t('rsvp.title')}</h2>
            <p className="text-green-800">{t('rsvp.success')}</p>
          </div>
        </div>
      </section>
    );
  }



  return (
    <section id="rsvp" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <div className="mb-4">
             <FloralTitle leftIcon={flower5} rightIcon={flower6}>
                 {t('rsvp.title')}
             </FloralTitle>
          </div>
          <div className="text-neutral-600 max-w-xl mx-auto">
            {t('rsvp.intro')}
            <span className="inline-flex align-middle ml-2">
              {/* Mobile: Popover (Click behavior) */}
              <span className="md:hidden">
                <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                  <PopoverTrigger asChild>
                    <button type="button" className="text-neutral-400 hover:text-neutral-600 transition-colors focus:outline-none outline-none cursor-pointer">
                      <Info className="h-5 w-5" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent 
                    align="center"
                    side="top"
                    sideOffset={5}
                    className="max-w-[280px] text-center bg-white text-neutral-900 p-3 shadow-xl border border-neutral-200"
                  >
                    <p className="text-sm">{t('rsvp.updateInfo')}</p>
                  </PopoverContent>
                </Popover>
              </span>

              {/* Desktop: Tooltip (Hover behavior) */}
              <span className="hidden md:inline-block">
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <button type="button" className="text-neutral-400 hover:text-neutral-600 transition-colors focus:outline-none outline-none cursor-default">
                      <Info className="h-5 w-5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent 
                    side="top" 
                    className="z-[100] max-w-[280px] text-center bg-white text-neutral-900 p-3 shadow-xl border border-neutral-200"
                  >
                    <p>{t('rsvp.updateInfo')}</p>
                  </TooltipContent>
                </Tooltip>
              </span>
            </span>
          </div>
          
          <div className="mt-6 bg-amber-50 border border-amber-200 p-4 rounded-xl inline-block text-left relative">
             <div className="flex gap-3">
                 <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                 <p className="text-sm text-amber-900">
                   {t('rsvp.foodNote.intro')}
                   <strong>{t('rsvp.foodNote.bold')}</strong>
                 </p>
             </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 bg-white rounded-2xl border border-neutral-200 p-6 md:p-10 shadow-sm">
          
          {/* Attendance Radio Buttons */}
          <div className="space-y-4">
            <Label className="text-lg font-medium block">{t('rsvp.attending')}</Label>
            <RadioGroup 
              value={formData.attending} 
              onValueChange={(value: string) => setFormData({ ...formData, attending: value })}
              className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-8"
            >
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="yes" id="r1" />
                <Label htmlFor="r1" className="cursor-pointer">{t('rsvp.attending.yes')}</Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="no" id="r2" />
                <Label htmlFor="r2" className="cursor-pointer">{t('rsvp.attending.no')}</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="firstName">{t('rsvp.firstName')}</Label>
              <Input
                id="firstName"
                type="text"
                required
                placeholder="John"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full"
                disabled={isSubmitting}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lastName">{t('rsvp.lastName')}</Label>
              <Input
                id="lastName"
                type="text"
                required
                placeholder="Doe"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">{t('rsvp.email')}</Label>
            <Input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full"
              disabled={isSubmitting}
            />
          </div>

          {/* Conditional Fields - Only show if Attending is NOT "no" */}
          {formData.attending !== 'no' && (
            <div className="space-y-8 pt-6 border-t border-neutral-100 animate-in fade-in slide-in-from-top-4 duration-500">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="guests">{t('rsvp.guests')} {t('rsvp.includingYou')}</Label>
                  <Select value={formData.guests} onValueChange={(value: string) => setFormData({ ...formData, guests: value })}>
                    <SelectTrigger className="w-full" disabled={isSubmitting}>
                      <SelectValue placeholder="Select number" />
                    </SelectTrigger>
                    <SelectContent>
                      {[0, 1, 2, 3, 4, 5].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="children">{t('rsvp.children')}</Label>
                  <Input
                    id="children"
                    type="number"
                    min="0"
                    value={formData.children}
                    onChange={(e) => setFormData({ ...formData, children: e.target.value })}
                    className="w-full"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

               {/* MAGIC LINK DINNER OPTION */}
               {isDinnerGuest && (
                 <div className="space-y-4 bg-rose-50 p-6 rounded-xl border border-rose-100 animate-in fade-in slide-in-from-top-2">
                    <Label className="text-lg font-medium block text-rose-900">{t('rsvp.dinnerQuestion')}</Label>
                    <RadioGroup 
                      value={formData.dinnerAttendance} 
                      onValueChange={(value: string) => setFormData({ ...formData, dinnerAttendance: value })}
                      className="space-y-3"
                    >
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="Yes" id="dinner-yes" className="border-rose-300" />
                        <Label htmlFor="dinner-yes" className="cursor-pointer font-medium text-rose-800">{t('rsvp.dinnerYes')}</Label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="No" id="dinner-no" className="border-rose-300" />
                        <Label htmlFor="dinner-no" className="cursor-pointer font-medium text-rose-800">{t('rsvp.dinnerNo')}</Label>
                      </div>
                    </RadioGroup>
                 </div>
               )}



              {/* APERO SECTION */}
              <div className="bg-neutral-50 p-6 rounded-xl border border-neutral-100 space-y-6">
                  <div className="space-y-3">
                    <Label className="text-lg font-medium block text-neutral-900">{t('rsvp.aperoQuestion')}</Label>
                    <RadioGroup 
                      value={formData.aperoContribution} 
                      onValueChange={(value: string) => setFormData({ ...formData, aperoContribution: value })}
                      className="space-y-3"
                    >
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="yes" id="apero-yes" />
                        <Label htmlFor="apero-yes" className="cursor-pointer">{t('rsvp.aperoYes')}</Label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="no" id="apero-no" />
                        <Label htmlFor="apero-no" className="cursor-pointer">{t('rsvp.aperoNo')}</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {formData.aperoContribution === 'yes' && (
                     <div className="space-y-6 pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                        
                        <Alert className="bg-amber-100 border-amber-300">
                          <AlertTriangle className="h-4 w-4 text-amber-600" />
                          <AlertTitle className="text-amber-800 font-semibold ml-2">{t('rsvp.aperoWarningTitle')}</AlertTitle>
                          <AlertDescription className="text-amber-700 ml-2 mt-1">
                            {t('rsvp.aperoWarning.intro')}
                            <strong>{t('rsvp.aperoWarning.bold')}</strong>
                            {t('rsvp.aperoWarning.outro')}
                          </AlertDescription>
                        </Alert>

                        <div className="space-y-3">
                            <Label className="font-medium">{t('rsvp.aperoTypeLabel')}</Label>
                            <RadioGroup 
                              value={formData.aperoType} 
                              onValueChange={(value: string) => setFormData({ ...formData, aperoType: value })}
                              className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-6"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Savory" id="type-savory" />
                                <Label htmlFor="type-savory">{t('rsvp.typeSavory')}</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Sweet" id="type-sweet" />
                                <Label htmlFor="type-sweet">{t('rsvp.typeSweet')}</Label>
                              </div>
                            </RadioGroup>
                        </div>
                        
                        {formData.aperoType && (
                           <div className="space-y-4 animate-in fade-in duration-300">
                              <div className="space-y-2">
                                 <Label>{t('rsvp.aperoItemLabel')}</Label>
                                 <Select 
                                   value={formData.aperoItem} 
                                   onValueChange={(value: string) => {
                                      // If switching away from custom, clear details
                                      const updates: any = { aperoItem: value };
                                      if (value !== 'custom') {
                                        updates.aperoDetails = value; // Default details to item name
                                      } else {
                                        updates.aperoDetails = '';
                                      }
                                      setFormData({ ...formData, ...updates });
                                   }}
                                 >
                                    <SelectTrigger className="w-full bg-white">
                                      <SelectValue placeholder="Select an option" />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-[300px]">
                                       {formData.aperoType === 'Savory' ? (
                                          SAVORY_OPTIONS.map((opt) => (
                                            <SelectItem key={opt} value={opt} disabled={takenItems.includes(opt)}>
                                              {opt} {takenItems.includes(opt) ? t('rsvp.taken') : ''}
                                            </SelectItem>
                                          ))
                                       ) : (
                                          SWEET_OPTIONS.map((opt) => (
                                            <SelectItem key={opt} value={opt} disabled={takenItems.includes(opt)}>
                                              {opt} {takenItems.includes(opt) ? t('rsvp.taken') : ''}
                                            </SelectItem>
                                          ))
                                       )}
                                       <SelectItem value="custom" className="font-bold border-t border-neutral-100 mt-1 pt-1">
                                          {t('rsvp.aperoChoiceCustom')}
                                       </SelectItem>
                                    </SelectContent>
                                 </Select>
                              </div>

                              {formData.aperoItem === 'custom' && (
                                 <div className="space-y-2 animate-in fade-in duration-300">
                                    <Label htmlFor="aperoDetails">{t('rsvp.aperoCustomLabel')}</Label>
                                    <Input
                                      id="aperoDetails"
                                      value={formData.aperoDetails}
                                      onChange={(e) => setFormData({ ...formData, aperoDetails: e.target.value })}
                                      className="w-full bg-white"
                                      placeholder="Ex: Homemade Focaccia"
                                      required
                                    />
                                 </div>
                              )}
                           </div>
                        )}
                     </div>
                  )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="dietaryType">{t('rsvp.dietaryType')}</Label>
                <Select value={formData.dietaryType} onValueChange={(value: string) => setFormData({ ...formData, dietaryType: value })}>
                  <SelectTrigger className="w-full" disabled={isSubmitting}>
                    <SelectValue placeholder="Select requirement" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">{t('rsvp.dietaryType.none')}</SelectItem>
                    <SelectItem value="vegetarian">{t('rsvp.dietaryType.vegetarian')}</SelectItem>
                    <SelectItem value="vegan">{t('rsvp.dietaryType.vegan')}</SelectItem>
                    <SelectItem value="glutenFree">{t('rsvp.dietaryType.glutenFree')}</SelectItem>
                    <SelectItem value="nutAllergy">{t('rsvp.dietaryType.nutAllergy')}</SelectItem>
                    <SelectItem value="other">{t('rsvp.dietaryType.other')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dietary">{t('rsvp.dietary')} (Notes)</Label>
                <Textarea
                  id="dietary"
                  value={formData.dietary}
                  onChange={(e) => setFormData({ ...formData, dietary: e.target.value })}
                  className="w-full min-h-[100px]"
                  placeholder="Additional details..."
                  disabled={isSubmitting}
                />
              </div>
            </div>
          )}

          <Button type="submit" className="w-full bg-neutral-900 hover:bg-neutral-800 h-12 text-lg" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : t('rsvp.submit')}
          </Button>
        </form>
      </div>
    </section>
  );
}
