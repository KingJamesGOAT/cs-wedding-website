import { motion } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';
import { Button } from '../ui/button';
import { ExternalLink, Car, Baby, Clock, Shirt } from 'lucide-react';

import FloralTitle from '../ui/FloralTitle';
import flower3 from '../../assets/flowers/3.svg';
import flower4 from '../../assets/flowers/4.svg';

export default function Details() {
  const { t, language } = useLanguage();

  const hotels = [
    {
      name: "Hotel de la Rose",
      description: "Historic, central",
      url: "https://www.hoteldelarose.ch"
    },
    {
      name: "Hotel Hine Adon",
      description: "Modern apartments",
      url: "https://hineadon.com/"
    },
    {
      name: "Hotel Alpha",
      description: "Budget friendly",
      url: "https://www.online-reservations.com/?hotelid=241215&gacc=gmcc&gad_source=1&gad_campaignid=20880334758&gbraid=0AAAAACsYb7nOh7harOChs_aHdaNAcFDDK&gclid=CjwKCAiAjojLBhAlEiwAcjhrDuOZPlG2G68C7NIIC8zElH7FKmt1BCc9JhxfHjbVb2AVoiYiElSYbRoCBVIQAvD_BwE"
    }
  ];

  return (
    <section id="details" className="py-20 px-4 sm:px-6 lg:px-8 bg-neutral-50">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="mb-4">
             <FloralTitle 
              leftIcon={flower3} 
              rightIcon={flower4}
              textClassName={language === 'fr' ? 'text-2xl sm:text-5xl' : undefined}
             >
                {t('details.title')}
             </FloralTitle>
          </div>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            {t('details.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          {/* Accommodation Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-serif mb-6 flex items-center gap-2">
              {t('details.accommodation.title')}
            </h3>
            <p className="text-neutral-600 mb-8 leading-relaxed">
              {t('details.accommodation.description')}
            </p>

            <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6">
              {hotels.map((hotel, index) => (
                <div 
                  key={index}
                  className="bg-white p-2 sm:p-4 md:p-6 rounded-lg sm:rounded-xl border border-neutral-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between h-full"
                >
                  <div className="mb-2 sm:mb-0">
                    <h4 className="text-xs sm:text-lg font-bold sm:font-medium leading-tight mb-1">{hotel.name}</h4>
                    <p className="text-[10px] sm:text-sm text-neutral-500 leading-tight">{hotel.description}</p>
                  </div>
                  <Button asChild variant="outline" size="sm" className="w-full mt-2 h-7 text-[10px] px-0 sm:h-9 sm:text-sm sm:px-3">
                    <a href={hotel.url} target="_blank" rel="noopener noreferrer">
                      {t('details.book')} 
                      <ExternalLink className="w-3 h-3 ml-1 sm:ml-2 hidden sm:inline" />
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Q&A Column */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-serif mb-6">
              {t('details.qa.title')}
            </h3>
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="dress-code">
                <AccordionTrigger>
                  <span className="flex items-center gap-3">
                    <Shirt className="w-5 h-5 text-neutral-500" />
                    {t('details.qa.dressCode.question')}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-neutral-600 leading-relaxed">
                  {t('details.qa.dressCode.answer')}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="transport">
                <AccordionTrigger>
                  <span className="flex items-center gap-3">
                    <Car className="w-5 h-5 text-neutral-500" />
                    {t('details.qa.transport.question')}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-neutral-600 leading-relaxed">
                  {t('details.qa.transport.answer')}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="children">
                <AccordionTrigger>
                  <span className="flex items-center gap-3">
                    <Baby className="w-5 h-5 text-neutral-500" />
                    {t('details.qa.children.question')}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-neutral-600 leading-relaxed">
                  {t('details.qa.children.answer')}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="rsvp">
                <AccordionTrigger>
                  <span className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-neutral-500" />
                    {t('details.qa.rsvp.question')}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-neutral-600 leading-relaxed">
                  {t('details.qa.rsvp.answer')}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
