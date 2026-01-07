import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Progress } from '../ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '../ui/dialog';
import { 
  Smartphone, Building2, Copy, Check, Loader2, 
  DollarSign, ShoppingBag, ChefHat, Zap, Utensils, Bed, Coffee, Wine, 
  Hammer, Bath, Box
} from 'lucide-react';
import { toast } from 'sonner';

import FloralTitle from '../ui/FloralTitle';
import flower7 from '../../assets/flowers/7.svg';
import flower8 from '../../assets/flowers/8.svg';

// Real data with realistic prices and 0 collected (fresh start)
const INITIAL_GIFTS = [
  { id: 'towels', title: 'Bath Towel Set', description: 'A set of standard bath towels for the bathroom.', price: 60, collected: 0, suggestedAmounts: [10, 20, 40, 60], icon: Bath },
  { id: 'knife', title: 'Kitchen Knife', description: 'A sharp chef\'s knife for daily cooking.', price: 70, collected: 0, suggestedAmounts: [10, 20, 40, 70], icon: ChefHat },
  { id: 'pan', title: 'Frying Pan', description: 'A durable non-stick pan for cooking.', price: 60, collected: 0, suggestedAmounts: [10, 20, 40, 60], icon: Utensils },
  { id: 'sheets', title: 'Bed Sheets', description: 'A standard set of sheets and pillowcases.', price: 80, collected: 0, suggestedAmounts: [10, 20, 50, 80], icon: Bed },
  { id: 'blender', title: 'Hand Blender', description: 'For making soups and smoothies.', price: 50, collected: 0, suggestedAmounts: [10, 20, 30, 50], icon: Zap },
  { id: 'glasses', title: 'Wine Glasses', description: 'A set of 6 glasses for wine or water.', price: 50, collected: 0, suggestedAmounts: [10, 20, 30, 50], icon: Wine },
  { id: 'toolkit', title: 'Basic Tool Kit', description: 'Screwdrivers, hammer, and tape measure.', price: 70, collected: 0, suggestedAmounts: [10, 20, 40, 70], icon: Hammer },
  { id: 'plates', title: 'Dinner Plates', description: 'A simple set of plates and bowls.', price: 90, collected: 0, suggestedAmounts: [10, 20, 50, 90], icon: Utensils },
  { id: 'containers', title: 'Food Containers', description: 'Glass containers for storing leftovers.', price: 50, collected: 0, suggestedAmounts: [10, 20, 30, 50], icon: Box },
  { id: 'cuttingboard', title: 'Cutting Board', description: 'A solid wooden board for chopping food.', price: 50, collected: 0, suggestedAmounts: [10, 20, 30, 50], icon: Utensils },
  { id: 'grinder', title: 'Coffee Grinder', description: 'Small machine to grind coffee beans.', price: 50, collected: 0, suggestedAmounts: [10, 20, 30, 50], icon: Coffee },
  { id: 'iron', title: 'Iron', description: 'Standard steam iron for clothes.', price: 60, collected: 0, suggestedAmounts: [10, 20, 40, 60], icon: Zap }
];

export default function Registry() {
  const { t } = useLanguage();
  
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
    amount: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [referenceCode, setReferenceCode] = useState('');

  // Fetch current totals from Google Sheet
  useEffect(() => {
    const fetchTotals = async () => {
      try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbz06IfaoPFh1kpwyfANLVt4YUPDBa6jODhf9AEufCUcAVWL_WVJNCtbscP5eTuakLHo/exec');
        const data = await response.json();
        
        if (data && data.items) {
          setGifts(prevGifts => prevGifts.map(gift => {
             const collected = data.items[gift.title] || 0;
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
    setFormData({ name: '', email: '', amount: '', message: '' });
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
      await fetch('https://script.google.com/macros/s/AKfycbz06IfaoPFh1kpwyfANLVt4YUPDBa6jODhf9AEufCUcAVWL_WVJNCtbscP5eTuakLHo/exec', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'registry',
          name: formData.name,
          email: formData.email,
          item: selectedGift.title,
          amount: formData.amount,
          message: `Ref Code: ${code} | User Message: ${formData.message}`
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
        <div className="grid grid-cols-2 gap-4 md:gap-16 w-full max-w-6xl">
          
          {/* OPTION 1: BROWSE GIFTS */}
          <Dialog open={isBrowseOpen} onOpenChange={setIsBrowseOpen}>
            <DialogTrigger asChild>
              <div className="group bg-white/70 backdrop-blur-xl border border-white/50 p-4 md:p-12 rounded-2xl md:rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer flex flex-col items-center justify-center text-center items-center h-[200px] md:h-[450px] transform hover:-translate-y-2 w-full">
                <div className="w-12 h-12 md:w-32 md:h-32 bg-rose-100/50 rounded-full flex items-center justify-center mb-3 md:mb-8 group-hover:scale-110 transition-transform duration-500 group-hover:bg-rose-100">
                  <ShoppingBag className="w-6 h-6 md:w-16 md:h-16 text-rose-500" />
                </div>
                <h3 className="text-sm md:text-3xl font-light mb-2 text-neutral-900 leading-tight">{t('registry.browseBtn')}</h3>
                <p className="text-neutral-600 text-[10px] md:text-lg max-w-xs">{t('registry.browseBtn') === 'Browse Gift Wishlist' ? 'Explore our curated list of items for our new home.' : 'Découvrez notre liste de cadeaux pour notre future maison.'}</p>
              </div>
            </DialogTrigger>
            
            <DialogContent className="max-w-[95vw] md:max-w-[90vw] w-full max-h-[85vh] flex flex-col p-4 md:p-6 bg-neutral-50/95 backdrop-blur-3xl border-neutral-200">
              <DialogHeader className="pb-4 border-b border-neutral-200/50 mb-4">
                <DialogTitle className="text-3xl font-light text-center">{t('registry.browseBtn')}</DialogTitle>
              </DialogHeader>
              <div className="overflow-y-auto px-2 py-2 flex-1 scrollbar-hide">
                 <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
                   {gifts.map((gift) => {
                     const isFullyFunded = gift.collected >= gift.price;
                     const percent = Math.min((gift.collected / gift.price) * 100, 100);
                     const Icon = gift.icon;

                     return (
                       <div key={gift.id} className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-6 flex flex-col border border-neutral-100 hover:border-neutral-300 hover:shadow-lg transition-all duration-300 relative overflow-hidden group">
                          {isFullyFunded && (
                            <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-green-100 text-green-700 text-[10px] sm:text-xs font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full flex items-center gap-1 shadow-sm z-10">
                              <Check className="w-2 h-2 sm:w-3 sm:h-3" /> {t('registry.fullyFunded')}
                            </div>
                          )}
                          
                          <div className="w-10 h-10 sm:w-16 sm:h-16 bg-neutral-50 rounded-xl flex items-center justify-center mb-2 sm:mb-4 group-hover:scale-105 transition-transform duration-300">
                             <Icon className={`w-5 h-5 sm:w-8 sm:h-8 ${isFullyFunded ? 'text-green-500' : 'text-neutral-600'}`} />
                          </div>
                          
                          <div className="flex-1">
                            <h4 className="font-medium text-xs sm:text-lg mb-1 leading-tight">{gift.title}</h4>
                            <p className="text-[10px] sm:text-sm text-neutral-500 mb-2 sm:mb-4 line-clamp-2">{gift.description}</p>
                          </div>

                          <div className="mt-2 sm:mt-4 space-y-1 sm:space-y-2">
                             <div className="flex justify-between text-[10px] sm:text-xs font-medium text-neutral-900 flex-col sm:flex-row gap-0.5">
                                <span>{isFullyFunded ? t('registry.fullyFunded') : `${t('registry.raised')} CHF ${gift.collected}`}</span>
                                <span>{t('registry.goal')} CHF {gift.price}</span>
                             </div>
                             <Progress value={percent} className={`h-1.5 sm:h-2 ${isFullyFunded ? 'bg-green-100' : 'bg-neutral-100'}`} indicatorClassName={isFullyFunded ? 'bg-green-500' : 'bg-neutral-900'} />
                          </div>

                          <Button
                            size="sm"
                            disabled={isFullyFunded}
                            className={`mt-2 sm:mt-4 w-full h-8 text-xs sm:h-9 sm:text-sm ${isFullyFunded ? 'bg-green-50 text-green-700 hover:bg-green-100 opacity-100' : 'bg-neutral-900 hover:bg-neutral-800'}`}
                            onClick={() => !isFullyFunded && handleOpenPledge(gift)}
                          >
                            {isFullyFunded ? t('registry.fullyFunded') : t('registry.pledgeBtn')}
                          </Button>
                       </div>
                     );
                   })}
                 </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* OPTION 2: CASH FUND */}
          <div 
             onClick={() => handleOpenPledge({ title: 'Cash Fund', description: t('registry.cashDesc'), suggestedAmounts: [20, 50, 100] })}
             className="group bg-white/70 backdrop-blur-xl border border-white/50 p-4 md:p-12 rounded-2xl md:rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer flex flex-col items-center justify-center text-center items-center h-[200px] md:h-[450px] transform hover:-translate-y-2"
          >
            <div className="w-12 h-12 md:w-32 md:h-32 bg-emerald-100/50 rounded-full flex items-center justify-center mb-3 md:mb-8 group-hover:scale-110 transition-transform duration-500 group-hover:bg-emerald-100">
               <DollarSign className="w-6 h-6 md:w-16 md:h-16 text-emerald-600" />
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
                   {t('registry.pledgeSubtitle')} <span className="font-medium text-neutral-900">{selectedGift.title}</span>
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                  {/* Amount Selection */}
                  <div className="space-y-3">
                    <Label>{t('registry.amountLabel')}</Label>
                    <div className="flex flex-wrap gap-2">
                      {selectedGift.suggestedAmounts ? selectedGift.suggestedAmounts.map((amt: number) => (
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
                      )) : null}
                      <Button
                        type="button"
                        variant={amountType === 'custom' ? 'default' : 'outline'}
                        onClick={() => {
                          setFormData({ ...formData, amount: '' });
                          setAmountType('custom');
                        }}
                      >
                       {t('registry.customAmount')}
                      </Button>
                    </div>
                    {amountType === 'custom' && (
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
                    <Label htmlFor="message">{t('registry.messageLabel')}</Label>
                    <Textarea 
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                       placeholder="Best wishes..."
                    />
                  </div>

                  <Button type="submit" className="w-full bg-neutral-900 hover:bg-neutral-800" disabled={isSubmitting}>
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
