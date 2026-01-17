import { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Progress } from '../ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '../ui/dialog';
import { 
  Smartphone, Building2, Copy, Check, Loader2, CreditCard, ExternalLink,
  Plane, ShoppingBag, ChefHat, Zap, Utensils, Bed, Coffee, Wine, 
  Bath, Box, Sofa, Armchair, Lamp 
} from 'lucide-react';
import { toast } from 'sonner';

import FloralTitle from '../ui/FloralTitle';
import flower7 from '../../assets/flowers/7.svg';
import flower8 from '../../assets/flowers/8.svg';
import revolutQr from '../../assets/revolut-qr.jpg';

// Categories
type Category = 'kitchen' | 'living' | 'bedroom' | 'bathroom';

interface GiftItem {
  id: string;
  category: Category;
  title: { en: string; fr: string };
  price: number;
  collected: number;
  suggestedAmounts?: number[];
  icon: any;
}

const CATEGORIES: { id: Category; label: { en: string; fr: string }; icon: any }[] = [
  { id: 'kitchen', label: { en: 'Kitchen', fr: 'Cuisine' }, icon: ChefHat },
  { id: 'living', label: { en: 'Living Room', fr: 'Salon' }, icon: Sofa },
  { id: 'bedroom', label: { en: 'Bedroom', fr: 'Chambre' }, icon: Bed },
  { id: 'bathroom', label: { en: 'Bathroom', fr: 'Salle de bain' }, icon: Bath },
];

const INITIAL_GIFTS: GiftItem[] = [
  // CUISINE
  { id: 'c1', category: 'kitchen', title: { en: 'Matte Dark Grey Dinnerware Set', fr: 'Ensemble de vaisselle mat gris foncé' }, price: 50, collected: 0, icon: Utensils },
  { id: 'c2', category: 'kitchen', title: { en: 'Pots and Pans Set', fr: 'Ensemble de casseroles et poêles' }, price: 80, collected: 0, icon: ChefHat },
  { id: 'c3', category: 'kitchen', title: { en: 'Wok', fr: 'Wok' }, price: 30, collected: 0, icon: ChefHat },
  { id: 'c4', category: 'kitchen', title: { en: 'Sauté Pan with Lid', fr: 'Sauteuse avec couvercle' }, price: 40, collected: 0, icon: ChefHat },
  { id: 'c5', category: 'kitchen', title: { en: 'Set of 6 Water Glasses', fr: 'Ensemble de 6 verres à eau' }, price: 10, collected: 0, icon: Coffee },
  { id: 'c6', category: 'kitchen', title: { en: 'Set of 6 Wine Glasses', fr: 'Ensemble de 6 verres à vin' }, price: 13, collected: 0, icon: Wine },
  { id: 'c7', category: 'kitchen', title: { en: 'Water Pitcher', fr: 'Pichet à eau' }, price: 7, collected: 0, icon: Coffee },
  { id: 'c8', category: 'kitchen', title: { en: '30-Piece Cutlery Set', fr: 'Ensemble de 30 couverts' }, price: 40, collected: 0, icon: Utensils },
  { id: 'c9', category: 'kitchen', title: { en: 'Set of 6 Cups & Saucers', fr: 'Ensemble 6 tasses + soucoupes' }, price: 24, collected: 0, icon: Coffee },
  { id: 'c10', category: 'kitchen', title: { en: 'Set of 8 Bowls', fr: 'Ensemble de 8 bols' }, price: 20, collected: 0, icon: Utensils },
  { id: 'c11', category: 'kitchen', title: { en: '2 Cutting Boards', fr: '2 Planches à découper' }, price: 34, collected: 0, icon: Utensils },
  { id: 'c12', category: 'kitchen', title: { en: '3 Carving Knives', fr: '3 Couteaux à découper' }, price: 50, collected: 0, icon: Utensils },
  { id: 'c13', category: 'kitchen', title: { en: 'Colander', fr: 'Passoire' }, price: 17, collected: 0, icon: Utensils },
  { id: 'c14', category: 'kitchen', title: { en: 'Glass Salad Bowl', fr: 'Saladier en verre' }, price: 6, collected: 0, icon: Utensils },
  { id: 'c15', category: 'kitchen', title: { en: 'Salad Servers', fr: 'Couverts à salade' }, price: 17, collected: 0, icon: Utensils },
  { id: 'c16', category: 'kitchen', title: { en: 'Ladles, Spatulas & Spoons Set', fr: 'Ensemble louches-spatules-et-cuilleres' }, price: 19, collected: 0, icon: Utensils },
  { id: 'c17', category: 'kitchen', title: { en: 'Teapot', fr: 'Théière' }, price: 25, collected: 0, icon: Coffee },
  { id: 'c18', category: 'kitchen', title: { en: 'Toaster', fr: 'Grille-pain' }, price: 28, collected: 0, icon: Zap },
  { id: 'c19', category: 'kitchen', title: { en: 'Bread Knife', fr: 'Couteau à pain' }, price: 30, collected: 0, icon: Utensils },
  { id: 'c20', category: 'kitchen', title: { en: 'Raclette Grill', fr: 'Appareil à raclette' }, price: 65, collected: 0, icon: Zap },
  { id: 'c21', category: 'kitchen', title: { en: 'Glass Kettle', fr: 'Bouilloire en verre' }, price: 30, collected: 0, icon: Zap },
  { id: 'c22', category: 'kitchen', title: { en: 'Kitchen Knives & Cutting Board', fr: 'Couteaux de cuisine et planche à découper' }, price: 100, collected: 0, icon: Utensils },
  { id: 'c23', category: 'kitchen', title: { en: 'Simple Microwave', fr: 'Micro-onde simple' }, price: 70, collected: 0, icon: Zap },
  { id: 'c24', category: 'kitchen', title: { en: 'Microwave Air Fryer', fr: 'Micro – onde – Air fryer' }, price: 190, collected: 0, icon: Zap },

  // SALON
  { id: 's1', category: 'living', title: { en: 'Convertible 3-Seater Sofa', fr: 'Canapé 3 places convertible' }, price: 500, collected: 0, icon: Sofa },
  { id: 's2', category: 'living', title: { en: '6 Chairs', fr: '6 chaises' }, price: 300, collected: 0, icon: Armchair },
  { id: 's3', category: 'living', title: { en: 'Dining Table', fr: 'Table' }, price: 250, collected: 0, icon: Building2 },
  { id: 's4', category: 'living', title: { en: 'Side Table', fr: 'Table bas coût' }, price: 40, collected: 0, icon: Building2 },
  { id: 's5', category: 'living', title: { en: 'Coffee Table', fr: 'table basse' }, price: 50, collected: 0, icon: Building2 },

  // CHAMBRE
  { id: 'ch1', category: 'bedroom', title: { en: 'Bed 160x200', fr: 'Lit 160 x 200' }, price: 320, collected: 0, icon: Bed },
  { id: 'ch2', category: 'bedroom', title: { en: 'Pocket Spring Mattress 80x200', fr: 'Matelas à ressorts ensachés 80 x 200' }, price: 380, collected: 0, icon: Bed },
  { id: 'ch3', category: 'bedroom', title: { en: 'Bedding Set', fr: 'Parure de lit Housse de couette et 2 taies, blanc' }, price: 80, collected: 0, icon: Bed },
  { id: 'ch4', category: 'bedroom', title: { en: 'All-Season Duvet 240x220 cm', fr: 'Couette toutes saisons, 240x220 cm' }, price: 160, collected: 0, icon: Bed },
  { id: 'ch5', category: 'bedroom', title: { en: 'Nightstands', fr: 'Chevets' }, price: 80, collected: 0, icon: Box },
  { id: 'ch6', category: 'bedroom', title: { en: 'Bedside Lamps', fr: 'Lampes de chevet' }, price: 20, collected: 0, icon: Lamp },

  // SALLE DE BAIN
  { id: 'sb1', category: 'bathroom', title: { en: 'Bath Towels 100x150', fr: 'linge de bain 100 * 150' }, price: 100, collected: 0, icon: Bath },
  { id: 'sb3', category: 'bathroom', title: { en: 'Laundry Basket', fr: 'panier à linge' }, price: 50, collected: 0, icon: Box },
];

export default function Registry() {
  const { t, language } = useLanguage();
  
  // State for Gift Data
  const [gifts, setGifts] = useState(INITIAL_GIFTS);

  // State for Pledge Flow
  const [selectedGift, setSelectedGift] = useState<any>(null);
  const [pledgeStep, setPledgeStep] = useState<'form' | 'success'>('form');
  const [amountType, setAmountType] = useState<'suggested' | 'custom'>('suggested');
  
  // State for Browsing Modal
  const [isBrowseOpen, setIsBrowseOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    amount: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [referenceCode, setReferenceCode] = useState('');

  // Fetch current totals from Google Sheet
  useEffect(() => {
    const fetchTotals = async () => {
      try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbyfVDsivhWotNQbGJN65SzF2xwFlzulSjD2WaVYb2Hx8hKG118J-JzoO5tMCjye1JVb/exec');
        const data = await response.json();
        
        if (data && data.items) {
          setGifts(prevGifts => prevGifts.map(gift => {
             // Match by English title for consistency with backend, or ID if possible. 
             // Using English title as key for now based on previous implementation
             const collected = data.items[gift.title.en] || data.items[gift.title.fr] || 0;
             return { ...gift, collected };
          }));
        }
      } catch (error) {
        console.error("Failed to fetch registry totals", error);
      }
    };
    
    // Fetch immediately
    fetchTotals();
    
    // Optional: Fetch on open browse
    if (isBrowseOpen) {
      fetchTotals();
    }
  }, [isBrowseOpen]);

  const handleOpenPledge = (gift: any) => {
    setSelectedGift(gift);
    setPledgeStep('form');
    setFormData({ name: '', email: '', address: '', amount: '', message: '' });
    setAmountType('suggested');
  };

  const generateRefCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = 'WED-';
    for (let i = 0; i < 3; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGift) return;

    setIsSubmitting(true);
    const code = generateRefCode();
    setReferenceCode(code);

    try {
      await fetch('https://script.google.com/macros/s/AKfycbyfVDsivhWotNQbGJN65SzF2xwFlzulSjD2WaVYb2Hx8hKG118J-JzoO5tMCjye1JVb/exec', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'registry',
          name: formData.name,
          email: formData.email,
          item: selectedGift.title.en, // Always send English title to backend for consistency
          amount: formData.amount,
          address: formData.address,
          message: formData.message,
          refCode: code
        }),
      });

      // Optimistic UI Update: Immediately update local state
      const pledgedAmount = parseFloat(formData.amount);
      if (!isNaN(pledgedAmount)) {
          setGifts(prevGifts => prevGifts.map(gift => {
              if (gift.id === selectedGift.id) {
                  return { ...gift, collected: gift.collected + pledgedAmount };
              }
              return gift;
          }));

          // Save to LocalStorage for User Summary
          try {
             const existingDataStr = localStorage.getItem('wedding_user_data');
             const existingData = existingDataStr ? JSON.parse(existingDataStr) : {};
             
             const newGift = {
                item: selectedGift.title.en, // Use English title for consistency
                amount: pledgedAmount,
                refCode: code,
                date: new Date().toISOString()
             };

             const updatedData = {
                ...existingData,
                gifts: [...(existingData.gifts || []), newGift]
             };
             
             localStorage.setItem('wedding_user_data', JSON.stringify(updatedData));
             
             // Dispatch event to update UI immediately
             window.dispatchEvent(new Event('wedding-data-updated'));
             window.dispatchEvent(new Event('storage'));
          } catch (err) {
             console.error("Failed to save local gift data", err);
          }
      }

      setPledgeStep('success');
    } catch (error) {
      console.error('Error submitting pledge:', error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success(t('registry.copied'));
  };

  // Group gifts by category
  const giftsByCategory = useMemo(() => {
    const grouped: Record<string, GiftItem[]> = {};
    gifts.forEach(gift => {
      if (!grouped[gift.category]) {
        grouped[gift.category] = [];
      }
      grouped[gift.category].push(gift);
    });
    return grouped;
  }, [gifts]);

  return (
    <section id="registry" className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 bg-[url('https://images.unsplash.com/photo-1520013577341-a20c35ef294f?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center min-h-[600px] md:min-h-[800px] flex items-center">
      <div className="max-w-7xl mx-auto w-full flex flex-col items-center">
        <div className="text-center mb-10 md:mb-16 bg-white/80 backdrop-blur-md p-6 md:p-8 rounded-3xl shadow-sm max-w-3xl">
          <div className="mb-4">
             <FloralTitle leftIcon={flower7} rightIcon={flower8}>
                 {t('registry.title')}
             </FloralTitle>
          </div>
          <p className="text-neutral-600">{t('registry.intro')}</p>
        </div>

        {/* MAIN LAYOUT: Clickable Containers */}
        <div className="grid grid-cols-2 gap-4 md:gap-16 w-full max-w-[90vw] md:max-w-[85vw]">
          
          {/* OPTION 1: BROWSE GIFTS */}
          <Dialog open={isBrowseOpen} onOpenChange={setIsBrowseOpen}>
            <DialogTrigger asChild>
              <div className="group bg-white/70 backdrop-blur-xl border border-white/50 p-4 md:p-12 rounded-2xl md:rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer flex flex-col items-center justify-center text-center items-center h-[160px] md:h-[320px] transform hover:-translate-y-2 w-full">
                <div className="w-12 h-12 md:w-32 md:h-32 bg-rose-100/50 rounded-full flex items-center justify-center mb-3 md:mb-8 group-hover:scale-110 transition-transform duration-500 group-hover:bg-rose-100">
                  <ShoppingBag className="w-6 h-6 md:w-16 md:h-16 text-rose-500" />
                </div>
                <h3 className="text-sm md:text-3xl font-light mb-2 text-neutral-900 leading-tight">{t('registry.browseBtn')}</h3>
                <p className="text-neutral-600 text-[10px] md:text-lg max-w-xs">{t('registry.browseBtn') === 'Browse Gift Wishlist' ? 'Explore our curated list of items for our new home.' : 'Découvrez notre liste de cadeaux pour notre future maison.'}</p>
              </div>
            </DialogTrigger>
            
            <DialogContent className="max-w-[95vw] sm:max-w-[85vw] w-full max-h-[70vh] flex flex-col p-0 bg-neutral-50/95 backdrop-blur-3xl border-neutral-200 overflow-hidden rounded-xl">
              <div className="p-4 md:p-6 pb-2 border-b border-neutral-200/50 bg-white/50">
                <DialogTitle className="text-2xl md:text-3xl font-light text-center font-serif">{t('registry.browseBtn')}</DialogTitle>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 md:p-6 scrollbar-thin">
                 
                 {/* Categories Loop */}
                 <div className="space-y-12">
                   {CATEGORIES.map(category => (
                     giftsByCategory[category.id] && giftsByCategory[category.id].length > 0 && (
                       <div key={category.id}>
                         <div className="flex items-center gap-3 mb-6">
                           <div className="p-2 bg-rose-100 rounded-lg">
                              <category.icon className="w-5 h-5 text-rose-500" />
                           </div>
                           <h3 className="text-xl md:text-2xl font-medium text-neutral-800">
                             {category.label[language]}
                           </h3>
                           <div className="h-px bg-neutral-200 flex-1 ml-4" />
                         </div>

                         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
                           {giftsByCategory[category.id].map((gift) => {
                             const isFullyFunded = gift.collected >= gift.price;
                             const percent = Math.min((gift.collected / gift.price) * 100, 100);
                             const Icon = gift.icon;

                             return (
                               <div key={gift.id} className="bg-white rounded-xl p-3 md:p-6 flex flex-col border border-neutral-100 hover:border-neutral-300 hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
                                  {isFullyFunded && (
                                    <div className="absolute top-2 right-2 md:top-3 md:right-3 bg-green-100 text-green-700 text-[10px] sm:text-xs font-bold px-1.5 py-0.5 md:px-2 md:py-1 rounded-full flex items-center gap-1 shadow-sm z-10">
                                      <Check className="w-2.5 h-2.5 md:w-3 md:h-3" /> <span className="hidden sm:inline">{t('registry.fullyFunded')}</span>
                                      <span className="sm:hidden">Complet</span>
                                    </div>
                                  )}
                                  
                                  <div className="w-10 h-10 md:w-16 md:h-16 bg-neutral-50 rounded-xl md:rounded-2xl flex items-center justify-center mb-2 md:mb-4 group-hover:scale-110 transition-transform duration-300 self-start">
                                     <Icon className={`w-5 h-5 md:w-8 md:h-8 ${isFullyFunded ? 'text-green-500' : 'text-neutral-600'}`} />
                                  </div>
                                  
                                  <div className="flex-1 min-h-[50px] md:min-h-[60px]">
                                    <h4 className="font-medium text-xs md:text-lg mb-0.5 leading-snug line-clamp-2 md:line-clamp-none">{gift.title[language]}</h4>
                                    <div className="text-sm md:text-xl font-light text-neutral-900 mt-1">
                                      CHF {gift.price}
                                    </div>
                                  </div>

                                  <div className="mt-3 md:mt-6 pt-3 border-t border-neutral-100">
                                     {/* Progress Bar */}
                                     {gift.collected > 0 && !isFullyFunded && (
                                       <div className="mb-2 md:mb-3">
                                         <div className="flex justify-between text-[10px] md:text-xs font-medium text-neutral-500 mb-1">
                                            <span>{Math.round(percent)}%</span>
                                            <span>CHF {gift.collected}</span>
                                         </div>
                                         <Progress value={percent} className="h-1 md:h-1.5 bg-neutral-100" />
                                       </div>
                                     )}

                                     <Button
                                       size="sm"
                                       disabled={isFullyFunded}
                                       className={`w-full h-8 text-xs md:h-9 md:text-sm ${isFullyFunded 
                                         ? 'bg-neutral-100 text-neutral-400 hover:bg-neutral-100 cursor-default' 
                                         : 'bg-neutral-900 text-white hover:bg-neutral-800'}`}
                                       onClick={() => !isFullyFunded && handleOpenPledge(gift)}
                                     >
                                       {isFullyFunded ? (language === 'en' ? 'Completed' : 'Complet') : t('registry.pledgeBtn')}
                                     </Button>
                                  </div>
                               </div>
                             );
                           })}
                         </div>
                       </div>
                     )
                   ))}
                 </div>

              </div>
            </DialogContent>
          </Dialog>

          {/* OPTION 2: CASH FUND */}
          <div 
             onClick={() => handleOpenPledge({ title: { en: 'Honeymoon Fund', fr: 'Voyage de noces' }, description: t('registry.cashDesc'), suggestedAmounts: [20, 50, 100] })}
             className="group bg-white/70 backdrop-blur-xl border border-white/50 p-4 md:p-12 rounded-2xl md:rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer flex flex-col items-center justify-center text-center items-center h-[160px] md:h-[320px] transform hover:-translate-y-2 w-full"
          >
            <div className="w-10 h-10 md:w-28 md:h-28 bg-[#FA8072]/10 rounded-full flex items-center justify-center mb-2 md:mb-6 group-hover:scale-110 transition-transform duration-500 group-hover:bg-[#FA8072]/20">
               <Plane className="w-5 h-5 md:w-14 md:h-14 text-[#FA8072]" />
            </div>
            <h3 className="text-sm md:text-3xl font-light mb-2 text-neutral-900 leading-tight">{t('registry.cashBtn')}</h3>
            <p className="text-neutral-600 text-[10px] md:text-lg max-w-xs">{t('registry.cashDesc')}</p>
          </div>

        </div>

        {/* PLEDGE DIALOG (Handles both flows) */}
        <Dialog open={!!selectedGift} onOpenChange={(open: boolean) => !open && setSelectedGift(null)}>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            
            {/* STATE 1: FORM */}
            {pledgeStep === 'form' && selectedGift && (
              <>
                <DialogHeader>
                  <DialogTitle>{t('registry.pledgeTitle')}</DialogTitle>
                  <DialogDescription>
                   {t('registry.pledgeSubtitle')} <span className="font-medium text-neutral-900">{selectedGift.title[language] || selectedGift.title}</span>
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                  {/* Amount Selection */}
                  <div className="space-y-3">
                    <Label>{t('registry.amountLabel')}</Label>
                    <div className="flex flex-wrap gap-2">
                       {/* If gift has partial contributions allowed logic (not implemented fully on simple list but generic amounts helpful) */}
                       {/* For specific items, maybe defaults aren't needed unless it's cash fund. */}
                       {/* We can offer the full price as a shortcut if it's not too high? Or just standard chips */}
                       
                       {/* Payment Options Logic */}
                       {(() => {
                          const remaining = (selectedGift.price || 1000) - (selectedGift.collected || 0);
                          let options: number[] = [];

                          if (!selectedGift.price) {
                              // Honeymoon / Cash Fund (No fixed price)
                              // Use suggested amounts if provided, or defaults. Do NOT add 'remaining' as it defaults to 1000.
                              options = selectedGift.suggestedAmounts || [50, 100, 200];
                          } else if (selectedGift.price < 50) {
                             // Under 50: Only full price (or remaining) allowed
                             options = [remaining];
                          } else {
                             // Above 50: Standard options + remaining, but strictly capped at remaining
                             const standards = [50, 100, 200];
                             options = [...standards, remaining]
                               .filter(val => val <= remaining && val > 0)
                               .filter((val, index, self) => self.indexOf(val) === index) // Unique
                               .sort((a, b) => a - b);
                          }

                          return options.map((amt: number) => (
                            <Button
                              key={amt}
                              type="button"
                              variant={formData.amount === amt.toString() && amountType === 'suggested' ? 'default' : 'outline'}
                              onClick={() => {
                                setFormData({ ...formData, amount: amt.toString() });
                                setAmountType('suggested');
                              }}
                            >
                              CHF {amt}
                            </Button>
                          ));
                       })()}
                      
                      <Button
                        type="button"
                        variant={amountType === 'custom' ? 'default' : 'outline'}
                        className={(!selectedGift.price || ((selectedGift.price - (selectedGift.collected || 0)) >= 50)) ? '' : 'hidden'}
                        onClick={() => {
                          setFormData({ ...formData, amount: '' });
                          setAmountType('custom');
                        }}
                      >
                       {t('registry.customAmount')}
                      </Button>
                    </div>
                    {amountType === 'custom' && (!selectedGift.price || ((selectedGift.price - (selectedGift.collected || 0)) >= 50)) && (
                      <Input
                        type="number"
                        placeholder="Enter amount"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        required
                        min="1"
                        className="mt-2"
                      />
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">{t('registry.nameLabel')}</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                       <Label htmlFor="email">{t('registry.emailLabel')}</Label>
                       <Input
                         id="email"
                         type="email"
                         value={formData.email}
                         onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                         required
                         placeholder="john@example.com"
                       />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">{t('registry.addressLabel')}</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      required
                      placeholder={t('registry.addressPlaceholder')}
                      className="min-h-[80px]"
                    />
                    <p className="text-xs text-neutral-500 italic">{t('registry.addressExplan')}</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">{t('registry.messageLabel')}</Label>
                    <Textarea 
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                       placeholder="Best wishes..."
                    />
                  </div>

                  <Button type="submit" className="w-full bg-neutral-900 hover:bg-neutral-800" disabled={isSubmitting || !formData.amount || Number(formData.amount) <= 0}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t('registry.sending')}
                      </>
                    ) : (
                      t('registry.confirmBtn')
                    )}
                  </Button>
                </form>
              </>
            )}

            {/* STATE 2: SUCCESS & PAYMENT */}
            {pledgeStep === 'success' && (
              <>
                 <DialogHeader>
                    <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                      <Check className="h-6 w-6 text-green-600" />
                    </div>
                    <DialogTitle className="text-center">
                      {t('registry.thankYou').replace('{name}', formData.name.split(' ')[0])}
                    </DialogTitle>
                    <DialogDescription className="text-center pt-2">
                      {t('registry.paymentInstructions')}
                    </DialogDescription>
                 </DialogHeader>

                 <div className="space-y-6 pt-6">
                    {/* Reference Code */}
                    <div className="bg-neutral-50 p-4 rounded-lg text-center border-2 border-neutral-200 border-dashed">
                       <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">{t('registry.refCode')}</p>
                       <div className="flex items-center justify-center gap-2">
                          <span className="text-3xl font-mono font-bold tracking-tight text-neutral-900">{referenceCode}</span>
                          <button onClick={() => copyToClipboard(referenceCode)} className="p-2 hover:bg-neutral-200 rounded-full ml-2">
                             <Copy className="h-4 w-4 text-neutral-500" />
                          </button>
                       </div>
                    </div>

                    <div className="space-y-4">
                       
                       {/* Twint Option */}
                       <div className="flex items-start gap-4 p-4 border rounded-lg bg-white">
                          <div className="flex-shrink-0 p-2 bg-green-50 rounded">
                             <Smartphone className="h-6 w-6 text-green-600" />
                          </div>
                          <div className="flex-1">
                             <h4 className="font-medium mb-1">Twint</h4>
                             <div className="flex flex-col justify-center mt-1">
                                <span className="text-xs text-neutral-500">{t('registry.sendTo')}</span>
                                <div className="flex items-center gap-2">
                                   <span className="font-mono text-sm">+41 78 635 03 07</span>
                                   <button onClick={() => copyToClipboard('+41786350307')} className="p-1 hover:bg-neutral-100 rounded">
                                      <Copy className="h-3 w-3 text-neutral-400" />
                                   </button>
                                </div>
                             </div>
                          </div>
                       </div>

                       {/* Revolut Option */}
                       <div className="flex items-start gap-4 p-4 border rounded-lg bg-white">
                          <div className="flex-shrink-0 p-2 bg-blue-50 rounded">
                             <CreditCard className="h-6 w-6 text-blue-600" />
                          </div>
                          <div className="flex-1">
                             <h4 className="font-medium mb-1">Revolut</h4>
                             <div className="flex flex-col mt-1 gap-2">
                                <span className="text-xs text-neutral-500">{t('registry.revolutInstruction')}</span>
                                
                                <a 
                                  href="https://revolut.me/steveben" 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 font-medium"
                                >
                                   revolut.me/steveben
                                   <ExternalLink className="h-3 w-3" />
                                </a>

                                <div className="flex items-center gap-3">
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <div className="relative group cursor-pointer w-24 h-24">
                                        <div className="w-full h-full bg-neutral-100 rounded-lg overflow-hidden border border-neutral-200 transition-all group-hover:border-blue-300 shadow-sm">
                                            <img src={revolutQr} alt="Revolut QR" className="w-full h-full object-cover" />
                                        </div>
                                        <div className="absolute inset-0 bg-black/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <span className="bg-white/90 text-[10px] px-2 py-1 rounded-full shadow-sm text-neutral-900 font-medium">{t('registry.zoomLabel')}</span>
                                        </div>
                                      </div>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-md bg-white p-6 border-0 shadow-2xl flex flex-col items-center">
                                        <DialogHeader>
                                            <DialogTitle>{t('registry.scanQrTitle')}</DialogTitle>
                                        </DialogHeader>
                                        <div className="w-full max-w-[300px] aspect-square bg-white rounded-xl overflow-hidden shadow-sm border border-neutral-100 mt-2">
                                            <img src={revolutQr} alt="Revolut QR" className="w-full h-full object-contain" />
                                        </div>
                                        <p className="text-center text-sm text-neutral-500 mt-4">
                                            {t('registry.scanQrDialog')}
                                        </p>
                                    </DialogContent>
                                  </Dialog>
                                  
                                  <span className="text-xs text-neutral-400 italic max-w-[150px]">
                                     {t('registry.zoomQr')}
                                  </span>
                                </div>
                             </div>
                          </div>
                       </div>

                       {/* Bank Transfer Option */}
                       <div className="flex items-start gap-4 p-4 border rounded-lg bg-white">
                          <div className="flex-shrink-0 p-2 bg-neutral-100 rounded">
                             <Building2 className="h-6 w-6 text-neutral-600" />
                          </div>
                          <div className="flex-1">
                             <h4 className="font-medium mb-1">Bank Transfer</h4>
                             <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                   <span className="text-xs text-neutral-500">IBAN</span>
                                   <div className="flex items-center gap-2">
                                      <span className="font-mono text-xs">CH54 0024 3243 5109 5140 Q</span>
                                      <button onClick={() => copyToClipboard('CH540024324351095140Q')} className="p-1 hover:bg-neutral-100 rounded">
                                         <Copy className="h-3 w-3 text-neutral-400" />
                                      </button>
                                   </div>
                                </div>
                                <div className="flex items-center justify-between">
                                   <span className="text-xs text-neutral-500">BIC</span>
                                   <span className="text-xs font-mono">UBSWCHZH80A</span>
                                </div>
                                <div className="flex flex-col mt-2 pt-2 border-t border-dashed">
                                   <span className="text-xs text-neutral-500 mb-1">Account Holder</span>
                                   <span className="text-xs text-neutral-800 leading-tight">
                                     Monsieur Steve Benjamin
                                   </span>
                                </div>
                             </div>
                          </div>
                       </div>

                    </div>
                    
                    <Button onClick={() => setSelectedGift(null)} className="w-full" variant="outline">
                       Close
                    </Button>
                 </div>
              </>
            )}

          </DialogContent>
        </Dialog>

      </div>
    </section>
  );
}
