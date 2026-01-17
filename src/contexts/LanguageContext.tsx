import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
  'nav.registry': { en: 'Gifts', fr: 'Cadeaux' },
  'nav.venue': { en: 'Venue', fr: 'Lieux' },
  'nav.gallery': { en: 'Gallery', fr: 'Galerie' },
  'nav.contribute': { en: 'Contribute', fr: 'Contribuer' },
  
  // Home
  'welcome.title': { en: 'Welcome', fr: 'Bienvenue' },
  'home.welcome': { 
    en: "Welcome to our wedding website! We're so excited to celebrate our special day with you. Feel free to explore the site for all the details. We can't wait to see you in Fribourg!",
    fr: "Bienvenue sur notre site de mariage ! Nous sommes ravis de pouvoir célébrer ce grand jour avec vous. Parcourez le site pour toutes les informations. Nous avons hâte de vous voir à Fribourg !"
  },
  'home.welcome_mobile': {
    en: "Welcome to our wedding website! We can't wait to see you in Fribourg!",
    fr: "Bienvenue sur notre site de mariage ! Nous avons hâte de vous voir à Fribourg !"
  },
  'home.saveDate': { en: 'Save the Date!', fr: 'Réservez la date !' },
  'home.days': { en: 'Days', fr: 'Jours' },
  'home.hours': { en: 'Hours', fr: 'Heures' },
  'home.minutes': { en: 'Minutes', fr: 'Minutes' },
  'home.seconds': { en: 'Seconds', fr: 'Secondes' },
  'home.quote': { 
    en: "To love is to give everything and to give oneself.", 
    fr: "Aimer, c'est tout donner et se donner soi-même." 
  },
  'home.quote_mobile': {
    en: "To love is to give everything and\nto give oneself.",
    fr: "Aimer, c'est tout donner et\nse donner soi-même."
  },
  'home.quoteAuthor': { en: 'St Thérèse of Lisieux', fr: 'Ste Thérèse de Lisieux' },
  
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
  'details.qa.rsvp.answer': { en: 'Please RSVP before March 29th, 2026.', fr: 'Merci de répondre avant le 29 mars 2026.' },
  'details.qa.apero.question': { en: 'Where can I specify what I would like to bring for the Apero?', fr: 'Où indiquer ce que je voudrais apporter pour l\'Apéro ?' },
  'details.qa.apero.answer': { 
    en: 'You can specify this in the RSVP section. Please plan for a quantity of around 10 people.', 
    fr: 'Vous pouvez l\'indiquer dans la section RSVP. Merci de prévoir une quantité pour environ 10 personnes.' 
  },

  // RSVP Page
  'rsvp.title': { en: 'RSVP', fr: 'RSVP' },
  'rsvp.intro': {
    en: "Please RSVP by filling out the form below. Please respond as soon as possible so we can plan accordingly. Merci!",
    fr: "Merci de confirmer votre présence ci-dessous. Une réponse rapide nous aiderait grandement pour l'organisation. Merci !"
  },
  'rsvp.attending': { en: 'Will you be attending?', fr: 'Serez-vous présent(e) ?' },
  'rsvp.attending.yes': { en: 'Joyfully Accept', fr: 'Avec plaisir' },
  'rsvp.attending.no': { en: 'Regretfully Decline', fr: 'Je ne pourrai pas venir' },
  'rsvp.firstName': { en: 'First Name', fr: 'Prénom' },
  'rsvp.lastName': { en: 'Last Name', fr: 'Nom' },
  'rsvp.email': { en: 'Email Address', fr: 'Adresse e-mail' },
  'rsvp.updateInfo': { 
    en: 'Did you make a mistake? No worries! Simply submit the form again with the same email address to update your response.', 
    fr: 'Vous avez fait une erreur ? Pas de souci ! Soumettez simplement le formulaire à nouveau avec la même adresse email pour mettre à jour votre réponse.' 
  },
  'rsvp.guests': { en: 'Number of Guests', fr: "Nombre d'invités" },
  'rsvp.includingYou': { en: '(Including you)', fr: '(Vous inclus)' },
  'rsvp.children': { 
    en: 'Number of Children', 
    fr: "Nombre d'enfants" 
  },
  'rsvp.dietary': { en: 'Dietary Restrictions', fr: 'Restrictions alimentaires' },
  'rsvp.dietaryType': { en: 'Dietary Requirements', fr: 'Préférences alimentaires' },
  'rsvp.dietaryType.none': { en: 'None', fr: 'Aucune' },
  'rsvp.dietaryType.vegetarian': { en: 'Vegetarian', fr: 'Végé (lacto-ovo)' },
  'rsvp.dietaryType.vegan': { en: 'Vegan', fr: 'Végétalien' },
  'rsvp.dietaryType.glutenFree': { en: 'Gluten-Free', fr: 'Sans gluten' },
  'rsvp.dietaryType.nutAllergy': { en: 'Nut Allergy', fr: 'Allergie aux noix' },
  'rsvp.dietaryType.other': { en: 'Other (specify below)', fr: 'Autre (préciser ci-dessous)' },
  'rsvp.submit': { en: 'Submit RSVP', fr: 'Envoyer' },
  'rsvp.success': { 
    en: "Thank you for your RSVP! We've received your response.",
    fr: "Merci pour votre réponse ! Nous avons bien reçu votre confirmation."
  },
  'rsvp.goToGifts': { en: 'Go to Gifts', fr: 'Aller aux Cadeaux' },
  'rsvp.aperoQuestion': { 
    en: "I would like to bring something for the Apero (Quantity: 50 bites)", 
    fr: "Je souhaite apporter quelque chose pour l’apéritif (environ 50 bouchées)." 
  },
  'rsvp.aperoYes': { en: 'Yes, I will bring something', fr: 'Oui, je participe' },
  'rsvp.aperoNo': { en: 'No, I will just enjoy', fr: 'Non, je viendrai juste profiter' },
  'rsvp.aperoWarningTitle': { en: 'Important Timing Info', fr: 'Information Importante' },
  'rsvp.aperoWarning.intro': { 
    en: 'Since you are bringing food, please arrive ', 
    fr: 'Comme vous apportez de la nourriture, merci d\'arriver ' 
  },
  'rsvp.aperoWarning.bold': { 
    en: 'between 12:30 and 13:30 at Guglerahof Farm Guglera 6, 1735 Giffers to drop it off', 
    fr: 'entre 12h30 et 13h30 à la Ferme Guglerahof Guglera 6, 1735 Giffers pour le dépôt' 
  },
  'rsvp.aperoWarning.outro': { 
    en: ' (Ceremony starts at 14:00 at Basilique Notre-Dame de Fribourg). Please label your plate.', 
    fr: ' (La cérémonie commence à 14h00 à Basilique Notre-Dame de Fribourg). Merci d\'étiqueter votre plat.' 
  },
  'rsvp.aperoTypeLabel': { en: 'What type of food?', fr: 'Quel type de nourriture ?' },
  'rsvp.typeSavory': { en: 'Savory (Salty)', fr: 'Salé' },
  'rsvp.typeSweet': { en: 'Sweet', fr: 'Sucré' },
  'rsvp.aperoItemLabel': { en: 'What specifically?', fr: 'Quoi exactement ?' },
  'rsvp.aperoCustomLabel': { en: 'Please specify what you are bringing:', fr: 'Veuillez préciser ce que vous apportez :' },
  'rsvp.aperoChoiceCustom': { en: 'Something else (My own choice)', fr: 'Autre chose (Mon propre choix)' },
  'rsvp.foodNote.intro': { en: 'Please use this form to RSVP for the wedding. ', fr: 'Utilisez ce formulaire pour répondre à l\'invitation. ' },
  'rsvp.foodNote.bold': { en: "If you'd like, you can also sign up to bring something for the Apero.", fr: 'Vous pouvez aussi, si vous le souhaitez, vous inscrire pour apporter quelque chose à l\'Apéro.' },
  'rsvp.taken': { en: '(Already Taken)', fr: '(Déjà pris)' },
  'rsvp.addSavory': { en: 'Add Savory Item', fr: 'Ajouter Salé' },
  'rsvp.addSweet': { en: 'Add Sweet Item', fr: 'Ajouter Sucré' },
  'rsvp.yourSelection': { en: 'Your Selection', fr: 'Votre Choix' },
  'rsvp.quantity': { en: 'Quantity', fr: 'Quantité' },
  'rsvp.bites': { en: 'bites', fr: 'bouchées' },
  'rsvp.remove': { en: 'Remove', fr: 'Retirer' },
  'rsvp.noItems': { en: 'No items selected yet', fr: 'Aucun article sélectionné' },
  'rsvp.customItemPlaceholder': { en: 'Item Name', fr: 'Nom de l\'article' },
  'rsvp.maxReached': { en: 'Max limit reached', fr: 'Limite atteinte' },
  'rsvp.dinnerQuestion': { 
    en: "We'd love for you to join us for the Evening Dinner! Will you be staying for the evening?", 
    fr: "Nous serions ravis que vous vous joigniez à nous pour le souper ! Restez-vous pour la soirée ?" 
  },
  'rsvp.dinnerYes': { en: "Yes, I/We will stay for dinner", fr: "Oui, je/nous restons pour le souper" },
  'rsvp.dinnerNo': { en: "No, unfortunately I/We can't stay", fr: "Non, malheureusement je/nous ne pouvons pas rester" },

  // User Summary Panel
  'dashboard.button': { en: 'Dashboard', fr: 'Tableau de bord' },
  'summary.title': { en: 'Your Wedding Dashboard', fr: 'Votre Tableau de Bord' },
  'summary.subtitle': { en: 'Here is a summary of your contributions and RSVP status.', fr: 'Voici un résumé de vos contributions et statut RSVP.' },
  'summary.rsvp.title': { en: 'Your RSVP', fr: 'Votre RSVP' },
  'summary.rsvp.notFound': { en: 'No RSVP found on this device.', fr: 'Aucun RSVP trouvé sur cet appareil.' },
  'summary.rsvp.attending': { en: 'Attending', fr: 'Présent' },
  'summary.rsvp.notAttending': { en: 'Not Attending', fr: 'Absent' },
  'summary.rsvp.guestCount': { en: 'Guests', fr: 'Invités' },
  'summary.rsvp.dinner': { en: 'Dinner', fr: 'Souper' },
  'summary.rsvp.dietary': { en: 'Dietary Notes', fr: 'Notes Alimentaires' },
  'summary.rsvp.apero': { en: 'Apero Contributions', fr: 'Contributions Apéro' },
  'summary.rsvp.aperoWarning': { en: 'Please drop off at Guglerahof Farm (12:30-13:30) before the ceremony.', fr: 'Merci de déposer à la Ferme Guglerahof (12h30-13h30) avant la cérémonie.' },
  'summary.gifts.title': { en: 'Your Gifts', fr: 'Vos Cadeaux' },
  'summary.gifts.none': { en: 'No gifts pledged yet.', fr: 'Aucun cadeau.' },
  'summary.gifts.refCode': { en: 'Ref Code', fr: 'Code Ref' },
  'summary.gifts.amount': { en: 'Amount', fr: 'Montant' },
  'summary.rsvp.updateHint': { en: 'Mistake? Refill RSVP using the same email to update.', fr: 'Une erreur ? Remplissez à nouveau le RSVP avec le même email pour mettre à jour.' },
  
  // Savory Options
  'food.savory.croissants': { en: 'Ham Croissants', fr: 'Croissants jambon' },
  'food.savory.sandwich': { en: 'Mini Ham & Cheese Sandwiches', fr: 'Mini sandwichs jambon fromage' },
  'food.savory.wraps': { en: 'Salmon / Philadelphia Wraps', fr: 'Wraps roulés saumon / Philadelphia' },
  'food.savory.dips': { en: 'Vegetable Dips + Sauces', fr: 'Dips légumes + sauces' },
  'food.savory.fauxgras': { en: 'Mini Faux Gras Sandwiches', fr: 'Mini sandwichs faux gras' },
  'food.savory.blinis_sub': { en: 'Salmon Substitute Blinis', fr: 'Blinis substitut saumon' },
  'food.savory.cakes_veg': { en: 'Small Vegetable Cakes', fr: 'Petits cakes légumes' },
  'food.savory.spinach': { en: 'Mini Spinach Turnovers', fr: 'Mini chaussons épinards' },
  'food.savory.blinis_faux': { en: 'Faux-Salmon Blinis', fr: 'Blinis faux-saumon' },
  'food.savory.cakes_bacon': { en: 'Bacon & Cheese Cakes', fr: 'Petits cakes lardons fromage' },
  'food.savory.blinis_salm': { en: 'Salmon Blinis', fr: 'Blinis saumon' },
  'food.savory.skewers_tom': { en: 'Tomato & Mozzarella Skewers', fr: 'Brochettes Tomates + Mozarella' },
  'food.savory.skewers_mel': { en: 'Melon & Prosciutto Skewers', fr: 'Brochettes melon–jambon cru' },

  // Sweet Options
  'food.sweet.skewers': { en: 'Fruit Skewers', fr: 'Brochettes de fruits' },
  'food.sweet.brownies': { en: 'Brownies', fr: 'Brownies' },
  'food.sweet.muffins': { en: 'Mini Muffins', fr: 'Mini muffins' },
  'food.sweet.tart_lemon': { en: 'Lemon Tarts', fr: 'Tartelettes citron' },
  'food.sweet.watermelon': { en: 'Watermelon Triangles', fr: 'Grosse pastèque coupées triangle' },
  'food.sweet.choux': { en: 'Cream Puffs', fr: 'Choux garnis' },
  'food.sweet.biscuits': { en: 'Homemade Biscuits', fr: 'Biscuits fait maison' },
  'food.sweet.cookies': { en: 'Mini Cookies', fr: 'Mini cookies' },
  'food.sweet.sables': { en: 'Shortbread', fr: 'Sablés' },
  'food.sweet.cupcake': { en: 'Mini Cupcake', fr: 'Mini Cupcake' },
  'food.sweet.verrines': { en: 'Fruit Verrines', fr: 'Verrines fruits' },


  
  // Registry
  'registry.title': { en: 'Gifts', fr: 'Cadeaux' },
  'registry.intro': {
    en: "Your presence at our wedding is the greatest gift of all. However, if you wish to honor us with a present, we've put together a small wish list.",
    fr: "Votre présence à notre mariage est le plus beau des cadeaux. Si vous souhaitez nous offrir quelque chose, nous avons préparé une petite liste."
  },
  'registry.contribute': { en: 'Contribute', fr: 'Contribuer' },
  'registry.howTo': { en: 'How to contribute:', fr: 'Comment contribuer :' },
  'registry.contributeTitle': { en: 'Contributions', fr: 'Contributions' },
  'registry.contributeIntro': {
    en: 'If you prefer to support us with a monetary gift, we have set up the following options:',
    fr: 'Si vous préférez nous soutenir avec un don, voici les options disponibles :'
  },
  
  // Venue
  'venue.title': { en: 'Venue Information', fr: 'Lieux' },
  'venue.ceremony': { en: 'Ceremony', fr: 'Cérémonie' },
  'venue.reception': { en: 'Apéro', fr: 'Apéro' },
  'venue.directions': { en: 'Get Directions', fr: 'Itinéraire' },
  'venue.ceremonyTime': { en: 'June 27, 2026 at 14:00', fr: '27 juin 2026 à 14h00' },
  'venue.ceremonyNote': {
    en: 'Ceremony will begin promptly at 14:00 (please arrive 10 minutes early).',
    fr: 'La cérémonie débutera à 14h00 précises (merci d\'arriver 10 minutes en avance).'
  },
  'venue.receptionTime': {
    en: 'Apéro to follow at 16:00',
    fr: 'Apéro à suivre à 16h00'
  },
  'venue.receptionNote.standard': {
    en: 'Drinks and apero will be at this location.',
    fr: 'Les boissons et l\'apéro auront lieu à cette adresse.'
  },
  'venue.receptionNote.dinner': {
    en: 'Drinks, apero, dinner, and dancing will be at this location.',
    fr: 'L\'apéro, le dîner et la soirée dansante auront lieu à cette adresse.'
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
  'contribute.sectionTitle': { en: 'Contribute Directly', fr: 'Contribuer directement' },
  'contribute.sectionIntro': {
    en: "If you prefer to give a monetary contribution instead, we've made it easy for you.",
    fr: "Si vous préférez offrir une contribution financière, nous avons facilité les choses pour vous."
  },
  'contribute.bank': { en: 'Bank Transfer', fr: 'Virement bancaire' },
  'contribute.thanks': { 
    en: 'Thank you for your generosity!', 
    fr: 'Merci pour votre générosité !' 
  },
  'contribute.currency': { en: 'CHF', fr: 'CHF' },
  'contribute.paypalDesc': { 
    en: 'Fast and secure online transfer.', 
    fr: 'Transfert en ligne rapide et sécurisé.' 
  },
  'contribute.twintDesc': { 
    en: 'Scan via the Twint app (Switzerland).', 
    fr: 'Scannez via l\'application Twint (Suisse).' 
  },
  'contribute.bankDesc': { 
    en: 'Traditional bank transfer details.', 
    fr: 'Coordonnées bancaires pour virement.' 
  },
  'contribute.copy': { en: 'Copy', fr: 'Copier' },
  'contribute.copied': { en: 'Copied!', fr: 'Copié !' },

  // Registry Pledge Flow
  'registry.browseBtn': { en: 'Browse Gift Wishlist', fr: 'Parcourir la liste de mariage' },
  'registry.cashBtn': { en: 'Contribute to our Honeymoon', fr: 'Participer à notre voyage de noces' },
  'registry.cashDesc': { 
    en: 'Help us create unforgettable memories.',
    fr: 'Aidez-nous à créer des souvenirs inoubliables.'
  },
  'registry.pledgeBtn': { en: 'Contribute', fr: 'Contribuer' },
  'registry.pledgeTitle': { en: 'Make a Contribution', fr: 'Faire un don' },
  'registry.pledgeSubtitle': { en: 'Contributing towards: ', fr: 'Participation pour : ' },
  'registry.nameLabel': { en: 'Your Name', fr: 'Votre Nom' },
  'registry.emailLabel': { en: 'Your Email', fr: 'Votre Email' },
  'registry.addressLabel': { en: 'Living Address', fr: 'Adresse postale' },
  'registry.addressExplan': { en: 'So we can thank you!', fr: 'Pour vous remercier !' },
  'registry.addressPlaceholder': { en: 'Street, City, Zip...', fr: 'Rue, Ville, Code Postal...' },
  'registry.amountLabel': { en: 'Amount (CHF)', fr: 'Montant (CHF)' },
  'registry.customAmount': { en: 'Custom Amount', fr: 'Montant libre' },
  'registry.messageLabel': { en: 'Short Message (Optional)', fr: 'Petit message (Optionnel)' },
  'registry.confirmBtn': { en: 'Confirm Contribution', fr: 'Confirmer' },
  'registry.sending': { en: 'Processing...', fr: 'Traitement...' },
  'registry.thankYou': { en: 'Thank You, {name}!', fr: 'Merci, {name} !' },
  'registry.paymentInstructions': { 
    en: 'To finalize your gift, please send the amount via Twint or Bank Transfer using the reference code below.', 
    fr: "Pour finaliser, merci d'envoyer le montant via Twint ou virement avec le code ci-dessous." 
  },
  'registry.sendTo': { en: 'Send to Steve:', fr: 'Envoyer à Steve :' },
  'registry.revolutInstruction': { en: 'Scan QR or use link', fr: 'Scannez le QR ou utilisez le lien' },
  'registry.zoomQr': { en: '(Click image to enlarge)', fr: '(Cliquez pour agrandir)' },
  'registry.zoomLabel': { en: 'Zoom', fr: 'Zoom' },
  'registry.scanQrTitle': { en: 'Scan QR Code', fr: 'Scanner le QR Code' },
  'registry.scanQrDialog': { 
    en: 'Scan with the Revolut app or your camera.', 
    fr: 'Scannez avec l\'application Revolut ou votre caméra.' 
  },
  'registry.refCode': { 
    en: 'Reference Code (Please add this to your payment message)', 
    fr: 'Code de référence (À mettre dans le message de paiement)' 
  },
  'registry.copy': { en: 'Copy', fr: 'Copier' },
  'registry.copied': { en: 'Copied!', fr: 'Copié !' },
  'registry.fullyFunded': { en: 'Fully Contributed', fr: 'Entièrement financé' },
  'registry.goal': { en: 'Goal', fr: 'Objectif' },
  'registry.raised': { en: 'Raised', fr: 'Récolté' },
  
  // Footer
  'footer.contact': { en: 'Contact Us', fr: 'Nous contacter' },
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved === 'en' || saved === 'fr') ? saved : 'fr';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

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
