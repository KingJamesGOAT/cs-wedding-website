import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { CheckCircle2, AlertTriangle, Info, Plus, Trash2, X } from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"

import FloralTitle from '../ui/FloralTitle';
import flower5 from '../../assets/flowers/5.svg';
import flower6 from '../../assets/flowers/6.svg';

// Defined Lists with Limits
const SAVORY_OPTIONS = [
  { label: "Croissants jambon", limit: 2 },
  { label: "Mini sandwichs jambon fromage", limit: 2 },
  { label: "Wraps roulés saumon / Philadelphia", limit: 1 },
  { label: "Dips légumes + sauces", limit: 2 },
  { label: "Mini sandwichs faux gras", limit: 1 },
  { label: "Blinis substitut saumon", limit: 1 },
  { label: "Petits cakes légumes", limit: 2 },
  { label: "Mini chaussons épinards", limit: 1 },
  { label: "Blinis faux-saumon", limit: 1 },
  { label: "Petits cakes lardons fromage", limit: 2 },
  { label: "Blinis saumon", limit: 1 },
  { label: "Brochettes Tomates + Mozarella", limit: 1 },
  { label: "Brochettes melon–jambon cru", limit: 1 },
];

const SWEET_OPTIONS = [
  { label: "Brochettes de fruits", limit: 1 },
  { label: "Brownies", limit: 1 },
  { label: "Mini muffins", limit: 1 },
  { label: "Tartelettes citron", limit: 1 },
  { label: "Grosse pastèque coupées triangle", limit: 1 },
  { label: "Choux garnis", limit: 1 },
  { label: "Biscuits fait maison", limit: 1 },
  { label: "Mini cookies", limit: 1 },
  { label: "Sablés", limit: 1 },
  { label: "Mini Cupcake", limit: 1 },
  { label: "Verrines fruits", limit: 1 },
];

interface SelectedItem {
  id: string;
  label: string;
  type: 'Savory' | 'Sweet' | 'Custom';
  quantity: number; // 1 = 50 bites, 2 = 100 bites (if allowed)
  customDetails?: string;
}

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
    dinnerAttendance: '',
    aperoContribution: 'no',
    // We will keep these for backend compatibility but populate them on submit
    aperoType: '',
    aperoItem: '',
    aperoDetails: ''
  });
  
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [takenItems, setTakenItems] = useState<string[]>([]);
  const [isDinnerGuest, setIsDinnerGuest] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  
  // Dialog State
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [addDialogType, setAddDialogType] = useState<'Savory' | 'Sweet'>('Savory');
  const [tempItem, setTempItem] = useState('');
  const [tempQuantity, setTempQuantity] = useState('1'); // '1' or '2'
  const [tempCustomDetails, setTempCustomDetails] = useState('');

  // Auto-close Popover on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (isPopoverOpen) setIsPopoverOpen(false);
    };
    if (isPopoverOpen) window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isPopoverOpen]);

  // Check for Magic Link
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('invite') === 'dinner') setIsDinnerGuest(true);
  }, []);

  // Fetch taken items
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
      if (rsvpElement) rsvpElement?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [submitted]);

  // Helper to count taken spots for an item (from server + local selection)
  const getTakenCount = (label: string) => {
    // 1. Count from server (naive exact match + some heuristic for "x2")
    // NOTE: This logic depends on how we format the string sent to the server.
    // We will stick to the format "Item (x2)" or just "Item".
    
    let serverCount = 0;
    takenItems.forEach(itemStr => {
      if (itemStr.includes(label)) {
        if (itemStr.includes('(x2)') || itemStr.includes('quantity: 100')) {
          serverCount += 2;
        } else {
          serverCount += 1;
        }
      }
    });

    // 2. Count from local current selection
    const localCount = selectedItems
      .filter(item => item.label === label)
      .reduce((acc, item) => acc + item.quantity, 0);

    return serverCount + localCount;
  };

  const handleAddItem = () => {
    if (tempItem === 'custom') {
      const newItem: SelectedItem = {
        id: Date.now().toString(),
        label: 'Custom',
        type: 'Custom',
        quantity: parseInt(tempQuantity), // Allow quantity for custom too
        customDetails: tempCustomDetails
      };
      setSelectedItems([...selectedItems, newItem]);
    } else {
      const newItem: SelectedItem = {
        id: Date.now().toString(),
        label: tempItem,
        type: addDialogType,
        quantity: parseInt(tempQuantity)
      };
      setSelectedItems([...selectedItems, newItem]);
    }
    closeAddDialog();
  };

  const closeAddDialog = () => {
    setIsAddDialogOpen(false);
    setTempItem('');
    setTempQuantity('1');
    setTempCustomDetails('');
  };

  const handleRemoveItem = (id: string) => {
    setSelectedItems(selectedItems.filter(item => item.id !== id));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const finalData = { ...formData };
    
    if (finalData.attending === 'no') {
      // Clear all
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
       if (!isDinnerGuest) finalData.dinnerAttendance = '';

       if (finalData.aperoContribution === 'no') {
          finalData.aperoType = '';
          finalData.aperoItem = '';
          finalData.aperoDetails = '';
       } else {
          // Format the multiple items into the legacy fields
          const savoryCount = selectedItems.filter(i => i.type === 'Savory').length;
          const sweetCount = selectedItems.filter(i => i.type === 'Sweet').length;
          const hasCustom = selectedItems.some(i => i.customDetails);

          // Determine generalized Type
          let typeStr = '';
          if (savoryCount > 0 && sweetCount > 0) typeStr = 'Mixed';
          else if (savoryCount > 0) typeStr = 'Savory';
          else if (sweetCount > 0) typeStr = 'Sweet';
          else if (hasCustom) typeStr = 'Custom';
          finalData.aperoType = typeStr;

          // Build Item String (All Items)
          const itemStrings = selectedItems.map(item => {
            if (item.label === 'Custom') {
              // For custom items: "Name (x2) (Custom)"
              return item.quantity > 1 
                ? `${item.customDetails} (x${item.quantity}) (Custom)` 
                : `${item.customDetails} (Custom)`;
            }
            if (item.quantity > 1) {
              return `${item.label} (x${item.quantity})`;
            }
            return item.label;
          });
          finalData.aperoItem = itemStrings.join(', ');
          
          // Build Details String (ONLY Custom Items)
          const customStrings = selectedItems
            .filter(item => item.label === 'Custom')
            .map(item => item.quantity > 1 
              ? `${item.customDetails} (x${item.quantity})` 
              : item.customDetails
            );
          
          finalData.aperoDetails = customStrings.length > 0 ? customStrings.join(', ') : '';
       }
    }

    try {
      await fetch('https://script.google.com/macros/s/AKfycbxpq_jKgykf6Ss1U-5kSybzOq3Fz1-yuhADQyy-Fp2WJJNin7KYbD5qr4KKEyVhDuTM/exec', {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attending: finalData.attending,
          firstName: finalData.firstName,
          lastName: finalData.lastName,
          email: finalData.email,
          guests: finalData.guests,
          children: finalData.children,
          dietaryType: finalData.dietaryType,
          dietary: finalData.dietary,
          dinnerAttendance: finalData.dinnerAttendance,
          aperoType: finalData.aperoType,
          aperoItem: finalData.aperoItem,
          aperoDetails: finalData.aperoDetails
        }),
      });

      setSubmitted(true);

      // Save to LocalStorage for User Summary
      try {
         const existingDataStr = localStorage.getItem('wedding_user_data');
         const existingData = existingDataStr ? JSON.parse(existingDataStr) : {};
         
         const updatedData = {
            ...existingData,
            rsvp: {
               firstName: finalData.firstName,
               lastName: finalData.lastName,
               email: finalData.email,
               attending: finalData.attending,
               guests: finalData.guests,
               dinnerAttendance: finalData.dinnerAttendance,
               dietary: finalData.dietary,
               aperoContribution: finalData.aperoContribution,
               selectedItems: selectedItems // Save the rich object structure
            }
         };
         
         localStorage.setItem('wedding_user_data', JSON.stringify(updatedData));
         
         // Dispatch event to update UI immediately
         window.dispatchEvent(new Event('wedding-data-updated'));
         window.dispatchEvent(new Event('storage')); // Fallback
      } catch (err) {
         console.error("Failed to save local user data", err);
      }

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
        setSelectedItems([]);
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

  const openAddDialog = (type: 'Savory' | 'Sweet') => {
    setAddDialogType(type);
    setTempItem('');
    setTempQuantity('1');
    setIsAddDialogOpen(true);
  };

  // Determine available options for the dialog
  const currentOptions = addDialogType === 'Savory' ? SAVORY_OPTIONS : SWEET_OPTIONS;

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
              <span className="md:hidden">
                <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                  <PopoverTrigger asChild>
                    <button type="button" className="text-neutral-400 hover:text-neutral-600 transition-colors focus:outline-none outline-none cursor-pointer">
                      <Info className="h-5 w-5" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent align="center" side="top" sideOffset={5} className="max-w-[280px] text-center bg-white text-neutral-900 p-3 shadow-xl border border-neutral-200">
                    <p className="text-sm">{t('rsvp.updateInfo')}</p>
                  </PopoverContent>
                </Popover>
              </span>
              <span className="hidden md:inline-block">
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <button type="button" className="text-neutral-400 hover:text-neutral-600 transition-colors focus:outline-none outline-none cursor-default">
                      <Info className="h-5 w-5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="z-[100] max-w-[280px] text-center bg-white text-neutral-900 p-3 shadow-xl border border-neutral-200">
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
              <Input id="firstName" type="text" required placeholder="John" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} className="w-full" disabled={isSubmitting} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">{t('rsvp.lastName')}</Label>
              <Input id="lastName" type="text" required placeholder="Doe" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} className="w-full" disabled={isSubmitting} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">{t('rsvp.email')}</Label>
            <Input id="email" type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full" disabled={isSubmitting} />
          </div>

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
                        <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="children">{t('rsvp.children')}</Label>
                  <Input id="children" type="number" min="0" value={formData.children} onChange={(e) => setFormData({ ...formData, children: e.target.value })} className="w-full" disabled={isSubmitting} />
                </div>
              </div>

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

                        {/* List of Selected Items */}
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <Label className="text-base font-medium">{t('rsvp.yourSelection')}</Label>
                          </div>
                          
                          {selectedItems.length === 0 ? (
                            <div className="text-sm text-neutral-500 italic p-3 border border-dashed border-neutral-300 rounded-lg text-center bg-white/50">
                              {t('rsvp.noItems')}
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {selectedItems.map((item) => (
                                <div key={item.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-neutral-200 shadow-sm animate-in fade-in slide-in-from-left-2">
                                  <div>
                                    <div className="font-medium text-sm text-neutral-900">
                                      {item.label === 'Custom' ? item.customDetails : item.label}
                                    </div>
                                    <div className="text-xs text-neutral-500 mt-0.5">
                                      {item.label === 'Custom' ? 'Custom' : item.type} • {item.quantity * 50} {t('rsvp.bites')}
                                    </div>
                                  </div>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRemoveItem(item.id)}
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Add Buttons */}
                        <div className="flex gap-3 pt-2">
                           <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                              <div className="flex flex-col sm:flex-row gap-3 w-full">
                                <Button type="button" onClick={() => openAddDialog('Savory')} className="flex-1 bg-white border border-neutral-300 text-neutral-900 hover:bg-neutral-50">
                                  <Plus className="h-4 w-4 mr-2" />
                                  {t('rsvp.addSavory')}
                                </Button>
                                <Button type="button" onClick={() => openAddDialog('Sweet')} className="flex-1 bg-white border border-neutral-300 text-neutral-900 hover:bg-neutral-50">
                                  <Plus className="h-4 w-4 mr-2" />
                                  {t('rsvp.addSweet')}
                                </Button>
                              </div>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>{addDialogType === 'Savory' ? t('rsvp.addSavory') : t('rsvp.addSweet')}</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 pt-4">
                                  <div className="space-y-2">
                                    <Label>{t('rsvp.aperoItemLabel')}</Label>
                                    <Select 
                                      value={tempItem} 
                                      onValueChange={(val) => {
                                        setTempItem(val);
                                        setTempQuantity('1'); // Reset quantity on item change
                                      }}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select an option" />
                                      </SelectTrigger>
                                      <SelectContent className="max-h-[300px]">
                                         {currentOptions.map((opt) => {
                                            const takenCount = getTakenCount(opt.label);
                                            const remaining = opt.limit - takenCount;
                                            const isFullyTaken = remaining <= 0;
                                            return (
                                              <SelectItem key={opt.label} value={opt.label} disabled={isFullyTaken}>
                                                {opt.label} {isFullyTaken ? t('rsvp.taken') : (remaining === 1 && opt.limit > 1 ? '(50 bites left)' : '')}
                                              </SelectItem>
                                            );
                                         })}
                                         <SelectItem value="custom" className="font-bold border-t border-neutral-100 mt-1 pt-1">
                                            {t('rsvp.aperoChoiceCustom')}
                                         </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  
                                  {tempItem === 'custom' ? (
                                     <div className="space-y-2">
                                        <Label>{t('rsvp.aperoCustomLabel')}</Label>
                                        <Input
                                          value={tempCustomDetails}
                                          onChange={(e) => setTempCustomDetails(e.target.value)}
                                          placeholder={t('rsvp.customItemPlaceholder')}
                                        />
                                     </div>
                                  ) : null}

                                  {/* Quantity Selection for BOTH Custom and Standard */}
                                  {tempItem && (
                                     <div className="space-y-2">
                                        <Label>{t('rsvp.quantity')}</Label>
                                        <div className="flex items-center gap-4">
                                           <div className={`
                                              flex-1 p-3 border rounded-lg cursor-pointer transition-all
                                              ${tempQuantity === '1' ? 'border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900' : 'border-neutral-200 hover:border-neutral-300'}
                                           `} onClick={() => setTempQuantity('1')}>
                                              <div className="font-medium">50 {t('rsvp.bites')}</div>
                                              <div className="text-xs text-neutral-500">Standard Portion</div>
                                           </div>
                                           
                                           {/* Show 100 bites option if:
                                               1. Custom Item (Always allow?) => Let's allow for now.
                                               2. Standard Item => Only if limit allows and enough remaining
                                           */}
                                           {(() => {
                                              if (tempItem === 'custom') {
                                                return (
                                                  <div className={`
                                                      flex-1 p-3 border rounded-lg cursor-pointer transition-all
                                                      ${tempQuantity === '2' ? 'border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900' : 'border-neutral-200 hover:border-neutral-300'}
                                                  `} onClick={() => setTempQuantity('2')}>
                                                      <div className="font-medium">100 {t('rsvp.bites')}</div>
                                                      <div className="text-xs text-neutral-500">Double Portion</div>
                                                  </div>
                                                );
                                              }

                                              const opt = currentOptions.find(o => o.label === tempItem);
                                              if (!opt || opt.limit < 2) return null;
                                              const takenCount = getTakenCount(opt.label); 
                                              const remaining = opt.limit - takenCount;
                                              if (remaining < 2) return null;

                                              return (
                                                <div className={`
                                                    flex-1 p-3 border rounded-lg cursor-pointer transition-all
                                                    ${tempQuantity === '2' ? 'border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900' : 'border-neutral-200 hover:border-neutral-300'}
                                                `} onClick={() => setTempQuantity('2')}>
                                                    <div className="font-medium">100 {t('rsvp.bites')}</div>
                                                    <div className="text-xs text-neutral-500">Double Portion</div>
                                                </div>
                                              );
                                           })()}
                                        </div>
                                     </div>
                                  )}

                                  <div className="pt-2">
                                    <Button 
                                      className="w-full bg-neutral-900 hover:bg-neutral-800"
                                      disabled={!tempItem || (tempItem === 'custom' && !tempCustomDetails)}
                                      onClick={handleAddItem}
                                    >
                                      Add to Selection
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                           </Dialog>
                        </div>
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
                <Textarea id="dietary" value={formData.dietary} onChange={(e) => setFormData({ ...formData, dietary: e.target.value })} className="w-full min-h-[100px]" placeholder="Additional details..." disabled={isSubmitting} />
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

