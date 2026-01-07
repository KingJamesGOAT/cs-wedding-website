import { useLanguage } from '../../contexts/LanguageContext';
import { Button } from '../ui/button';
import { CreditCard, Smartphone, Building2, Copy } from 'lucide-react';
import { toast } from 'sonner';

export default function Contribute() {
  const { language, t } = useLanguage();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success(t('contribute.copied'));
  };

  return (
    <section id="contribute" className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl mb-4">{t('registry.contributeTitle')}</h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">{t('registry.contributeIntro')}</p>
          <p className="text-sm text-neutral-500 mt-2">{t('contribute.currency')}</p>
        </div>

        <div className="space-y-6">
          {/* PayPal */}
          <div className="bg-white rounded-lg border border-neutral-200 p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 p-3 bg-blue-50 rounded-lg">
                <CreditCard className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl mb-2">PayPal</h3>
                <p className="text-sm text-neutral-600 mb-4">
                  {t('contribute.paypalDesc')}
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700" 
                    onClick={() => window.open('https://paypal.me/stevecynthia', '_blank')}
                  >
                    {t('registry.contribute')}
                  </Button>
                  <div className="flex items-center gap-2 text-sm text-neutral-600 bg-neutral-50 px-3 py-2 rounded-md">
                    <span className="truncate max-w-[200px] sm:max-w-none">steve.cynthia@example.com</span>
                    <button
                      onClick={() => copyToClipboard('steve.cynthia@example.com')}
                      className="p-1 hover:bg-neutral-200 rounded transition-colors"
                      title={t('contribute.copy')}
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Twint */}
          <div className="bg-white rounded-lg border border-neutral-200 p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 p-3 bg-green-50 rounded-lg">
                <Smartphone className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl mb-2">Twint</h3>
                <p className="text-sm text-neutral-600 mb-4">
                  {t('contribute.twintDesc')}
                </p>
                <div className="flex flex-col sm:flex-row items-start gap-6">
                  <div className="w-32 h-32 bg-white border-2 border-neutral-300 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Smartphone className="w-8 h-8 mx-auto mb-1 text-neutral-400" />
                      <p className="text-xs text-neutral-500">QR Code</p>
                    </div>
                  </div>
                  <div className="flex-1 space-y-2">
                    <p className="text-sm font-medium">{t('registry.sendTo')}</p>
                    <div className="flex items-center gap-2 text-sm text-neutral-600 bg-neutral-50 px-3 py-2 rounded-md w-fit">
                      <span>+41 78 635 03 07</span>
                      <button
                        onClick={() => copyToClipboard('+41786350307')}
                        className="p-1 hover:bg-neutral-200 rounded transition-colors"
                        title={t('contribute.copy')}
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bank Transfer */}
          <div className="bg-white rounded-lg border border-neutral-200 p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 p-3 bg-neutral-100 rounded-lg">
                <Building2 className="w-6 h-6 text-neutral-700" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl mb-2">{t('contribute.bank')}</h3>
                <p className="text-sm text-neutral-600 mb-4">
                  {t('contribute.bankDesc')}
                </p>
                <div className="space-y-3 bg-neutral-50 rounded-lg p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="text-xs uppercase tracking-wider text-neutral-500">IBAN</span>
                    <div className="flex items-center gap-2">
                      <code className="text-sm font-mono">CH00 1234 5678 9012 3456 7</code>
                      <button
                        onClick={() => copyToClipboard('CH0012345678901234567')}
                        className="p-1 hover:bg-neutral-200 rounded transition-colors"
                        title={t('contribute.copy')}
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="text-xs uppercase tracking-wider text-neutral-500">
                      {language === 'en' ? 'Account Name' : 'Nom du compte'}
                    </span>
                    <span className="text-sm">Cynthia Lastname & Steve Lastname</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="text-xs uppercase tracking-wider text-neutral-500">
                      {language === 'en' ? 'Bank' : 'Banque'}
                    </span>
                    <span className="text-sm">Credit Suisse, Geneva</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Thank You Message */}
        <div className="mt-8 text-center p-6">
          <p className="text-neutral-700 font-medium italic">"{t('contribute.thanks')}"</p>
        </div>
      </div>
    </section>
  );
}
