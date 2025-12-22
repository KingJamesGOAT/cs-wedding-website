import { useLanguage } from '../../contexts/LanguageContext';
import { Button } from '../ui/button';
import { Gift } from 'lucide-react';
import Contribute from './Contribute';

const registryItems = [
  {
    name: 'Kitchen Aid Stand Mixer',
    nameFr: 'Batteur sur socle Kitchen Aid',
    description: 'A top-quality mixer for our future kitchen.',
    descriptionFr: 'Un batteur de qualité pour notre future cuisine.',
    amount: 50,
  },
  {
    name: 'Luxury Bed Linens (King)',
    nameFr: 'Draps de lit luxueux (King)',
    description: 'Soft, high-thread-count sheets for our bedroom.',
    descriptionFr: 'Des draps doux et de haute qualité pour notre chambre.',
    amount: 30,
  },
  {
    name: 'Professional Cookware Set',
    nameFr: 'Ensemble de casseroles professionnelles',
    description: 'Professional cookware set for our home.',
    descriptionFr: 'Ustensiles de cuisine professionnels pour notre maison.',
    amount: 20,
  },
  {
    name: 'Honeymoon Fund – Beach Dinner',
    nameFr: 'Voyage de noces – Dîner sur la plage',
    description: 'Contribute to a special dinner on our honeymoon.',
    descriptionFr: 'Contribuez à un dîner spécial pendant notre lune de miel.',
    amount: null,
  },
];

export default function RegistryWithContribution() {
  const { language, t } = useLanguage();

  return (
    <section id="registry" className="pt-20 pb-0 px-4 sm:px-6 lg:px-8 bg-neutral-50">
      <div className="max-w-6xl mx-auto">
        {/* Registry Section */}
        <div className="mb-0">
          <div className="text-center mb-12">
            <h2 className="text-4xl mb-4">{t('registry.title')}</h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">{t('registry.intro')}</p>
          </div>

          {/* Registry Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {registryItems.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-lg border border-neutral-200 p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 bg-neutral-100 rounded flex items-center justify-center">
                      <Gift className="w-10 h-10 text-neutral-400" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-1">{language === 'en' ? item.name : item.nameFr}</h3>
                    <p className="text-sm text-neutral-600 mb-3">
                      {language === 'en' ? item.description : item.descriptionFr}
                    </p>
                    <Button className="bg-neutral-900 hover:bg-neutral-800">
                      {t('registry.contribute')} {item.amount ? `CHF ${item.amount}` : ''}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Consolidated Contribution Section */}
      <div className="bg-white border-t border-neutral-100">
        <Contribute />
      </div>
    </section>
  );
}
