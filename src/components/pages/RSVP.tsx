import { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { CheckCircle2 } from 'lucide-react';

export default function RSVP() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    guests: '',
    children: '',
    dietary: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Combine first and last name for the backend to maintain compatibility
    const submissionData = {
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      email: formData.email,
      guests: formData.guests,
      children: formData.children,
      dietary: formData.dietary
    };
    
    try {
      await fetch('https://script.google.com/macros/s/AKfycbyzCPu0hy-pOEEgJSDIr4dEcLJDrVOVw2IBR9hrjYU/exec', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      // Since mode is no-cors, we get an opaque response.
      // We assume success if no error was thrown.
      setSubmitted(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({ firstName: '', lastName: '', email: '', guests: '', children: '', dietary: '' });
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

          <div className="space-y-2">
            <Label htmlFor="guests">{t('rsvp.guests')}</Label>
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
            <Label htmlFor="dietary">{t('rsvp.dietary')}</Label>
            <Textarea
              id="dietary"
              value={formData.dietary}
              onChange={(e) => setFormData({ ...formData, dietary: e.target.value })}
              className="w-full min-h-[100px]"
              placeholder="Vegetarian, vegan, allergies, etc."
              disabled={isSubmitting}
            />
          </div>

          <Button type="submit" className="w-full bg-neutral-900 hover:bg-neutral-800" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : t('rsvp.submit')}
          </Button>
        </form>
      </div>
    </section>
  );
}
