import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'fr';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<string, Record<Language, string>> = {
  // Navigation
  'nav.home': { en: 'Home', fr: 'Accueil' },
  'nav.details': { en: 'Details', fr: 'Infos Pratiques' },
  'nav.rsvp': { en: 'RSVP', fr: 'RSVP' },
  'nav.registry': { en: 'Registry', fr: 'Liste de mariage' },
  'nav.venue': { en: 'Venue', fr: 'Lieux' },
  'nav.gallery': { en: 'Gallery', fr: 'Galerie' },
  'nav.contribute': { en: 'Contribute', fr: 'Contribuer' },
  
  // Home
  'home.welcome': { 
    en: "Welcome to our wedding website! We're so excited to celebrate our special day with you. Feel free to explore the site for all the details – see you in Fribourg on our big day!",
    fr: "Bienvenue sur notre site de mariage ! Nous sommes ravis de pouvoir célébrer ce grand jour avec vous. Parcourez le site pour toutes les informations – à très bientôt à Fribourg !"
  },
  'home.saveDate': { en: 'Save the Date!', fr: 'Réservez la date !' },
  
  // Details Section
  'details.title': { en: 'Wedding Details', fr: 'Détails du Mariage' },
  'details.subtitle': { en: 'Useful information for our guests', fr: 'Informations utiles pour nos invités' },
  'details.accommodation.title': { en: 'Where to Stay', fr: 'Où dormir' },
  'details.accommodation.description': { 
    en: 'We recommend staying in Fribourg (15 min drive). Here are a few suggestions:', 
    fr: 'Nous recommandons de séjourner à Fribourg (15 min de route). Voici quelques suggestions :' 
  },
  'details.book': { en: 'Book Now', fr: 'Réserver' },
  'details.qa.title': { en: 'Common Questions', fr: 'Questions Fréquentes' },
  
  // Q&A Specifics
  'details.qa.dressCode.question': { en: 'What is the dress code?', fr: 'Quel est le dress code ?' },
  'details.qa.dressCode.answer': { 
    en: 'Cocktail Attire.', 
    fr: 'Tenue de cocktail.' 
  },
  'details.qa.transport.question': { en: 'Parking & Transport', fr: 'Parking et Transport' },
  'details.qa.transport.answer': { 
    en: 'Free parking at Guglerahof. Taxis available from Fribourg.', 
    fr: 'Parking gratuit au Guglerahof. Taxis disponibles depuis Fribourg.' 
  },
  'details.qa.children.question': { en: 'Are children invited?', fr: 'Les enfants sont-ils invités ?' },
  'details.qa.children.answer': { 
    en: 'Yes! Children are invited. We look forward to celebrating with your whole family.', 
    fr: 'Oui ! Les enfants sont les bienvenus. Nous avons hâte de célébrer avec toute la famille.' 
  },
  'details.qa.rsvp.question': { en: 'When should I RSVP?', fr: 'Quand répondre ?' },
  'details.qa.rsvp.answer': { en: 'Please RSVP by May 1st, 2026.', fr: 'Merci de répondre avant le 1er mai 2026.' },

  // RSVP Page
  'rsvp.title': { en: 'RSVP', fr: 'RSVP' },
  'rsvp.intro': {
    en: "Please RSVP by filling out the form below. We kindly request your response at your earliest convenience so we can plan accordingly. Merci!",
    fr: "Merci de remplir le formulaire ci-dessous pour confirmer votre présence. Nous vous remercions de votre réponse rapide afin que nous puissions nous organiser au mieux. Merci !"
  },
  'rsvp.name': { en: 'Full Name', fr: 'Nom complet' },
  'rsvp.email': { en: 'Email Address', fr: 'Adresse e-mail' },
  'rsvp.guests': { en: 'Number of Guests', fr: "Nombre d'invités" },
  'rsvp.dietary': { en: 'Dietary Restrictions', fr: 'Restrictions alimentaires' },
  'rsvp.submit': { en: 'Submit RSVP', fr: 'Envoyer' },
  'rsvp.success': { 
    en: "Thank you for your RSVP! We've received your response.",
    fr: "Merci pour votre réponse ! Nous avons bien reçu votre confirmation."
  },
  
  // Registry
  'registry.title': { en: 'Gift Registry', fr: 'Liste de mariage' },
  'registry.intro': {
    en: "Your presence at our wedding is the greatest gift of all. However, if you wish to honor us with a present, we've put together a small wish list.",
    fr: "Votre présence à notre mariage est le plus beau des cadeaux. Si vous souhaitez nous offrir quelque chose, nous avons préparé une petite liste."
  },
  'registry.contribute': { en: 'Contribute', fr: 'Contribuer' },
  'registry.howTo': { en: 'How to contribute:', fr: 'Comment contribuer :' },
  
  // Venue
  'venue.title': { en: 'Venue Information', fr: 'Lieux' },
  'venue.ceremony': { en: 'Ceremony', fr: 'Cérémonie' },
  'venue.reception': { en: 'Reception', fr: 'Réception' },
  'venue.directions': { en: 'Get Directions', fr: 'Itinéraire' },
  'venue.ceremonyTime': { en: 'June 27, 2026 at 14:00', fr: '27 juin 2026 à 14h00' },
  'venue.ceremonyNote': {
    en: 'Ceremony will begin promptly at 14:00 (please arrive 10 minutes early).',
    fr: 'La cérémonie débutera à 14h00 précises (merci d\'arriver 10 minutes en avance).'
  },
  'venue.receptionTime': {
    en: 'Reception to follow at 5:00 PM',
    fr: 'Réception à suivre vers 17h00'
  },
  'venue.receptionNote': {
    en: 'Dinner, drinks, and dancing will be at this location.',
    fr: 'Le dîner, les boissons et la soirée dansante auront lieu à cette adresse.'
  },
  
  // Gallery
  'gallery.title': { en: 'Photo Gallery', fr: 'Galerie Photos' },
  'gallery.subtitle': { en: 'A collection of our favorite moments', fr: 'Une collection de nos moments préférés' },
  'gallery.officialPhotos': { 
    en: 'Official photos arriving after the wedding!', 
    fr: 'Les photos officielles arriveront après le mariage !' 
  },
  'gallery.comingSoon': { en: 'Photo Coming Soon', fr: 'Photo à venir bientôt' },
  
  // Contribute
  'contribute.sectionTitle': { en: 'Or Contribute Directly', fr: 'Ou contribuer directement' },
  'contribute.sectionIntro': {
    en: "If you prefer to give a monetary contribution instead, we've made it easy for you.",
    fr: "Si vous préférez offrir une contribution financière, nous avons facilité les choses pour vous."
  },
  'contribute.bank': { en: 'Bank Transfer', fr: 'Virement bancaire' },
  'contribute.thanks': { 
    en: 'Thank you for your generosity!', 
    fr: 'Merci pour votre générosité !' 
  },
  
  // Footer
  'footer.contact': { en: 'Contact Us', fr: 'Nous contacter' },
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'fr' : 'en');
  };

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
