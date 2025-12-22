import { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { CheckCircle2 } from 'lucide-react';

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
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // If not attending, clear irrelevant fields
    const finalData = formData.attending === 'no' ? {
      ...formData,
      guests: '0',
      children: '0',
      dietaryType: '',
      dietary: ''
    } : formData;

    try {
      await fetch('https://script.google.com/macros/s/AKfycbz06IfaoPFh1kpwyfANLVt4YUPDBa6jODhf9AEufCUcAVWL_WVJNCtbscP5eTuakLHo/exec', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          attending: finalData.attending,
          firstName: finalData.firstName,
          lastName: finalData.lastName,
          email: finalData.email,
          guests: finalData.guests,
          children: finalData.children,
          dietaryType: finalData.dietaryType,
          dietary: finalData.dietary
        }),
      });

      // Since mode is no-cors, we get an opaque response.
      // We assume success if no error was thrown.
      setSubmitted(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({ 
          attending: 'yes',
          firstName: '', 
          lastName: '', 
          email: '', 
          guests: '0', 
          children: '0', 
          dietaryType: 'none', 
          dietary: '' 
        });
        setSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error('Error submitting form:', error);
      // Ideally show an error message to user, but for now we follow instructions
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
          <h2 className="text-4xl mb-4">{t('rsvp.title')}</h2>
          <p className="text-neutral-600 max-w-xl mx-auto">{t('rsvp.intro')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg border border-neutral-200 p-8 shadow-sm">
          
          {/* Attendance Radio Buttons */}
          <div className="space-y-3 mb-6">
            <Label className="text-lg font-medium">{t('rsvp.attending')}</Label>
            <RadioGroup 
              value={formData.attending} 
              onValueChange={(value) => setFormData({ ...formData, attending: value })}
              className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="r1" />
                <Label htmlFor="r1">{t('rsvp.attending.yes')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="r2" />
                <Label htmlFor="r2">{t('rsvp.attending.no')}</Label>
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
            <div className="space-y-6 pt-4 border-t border-neutral-100">
              <div className="space-y-2">
                <Label htmlFor="guests">{t('rsvp.guests')} (Excluding you)</Label>
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

          <Button type="submit" className="w-full bg-neutral-900 hover:bg-neutral-800" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : t('rsvp.submit')}
          </Button>
        </form>
      </div>
    </section>
  );
}
