import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

type Language = "en" | "fr";

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

const translations: Record<string, Record<Language, string>> = {
  // Navigation
  "nav.home": { en: "Home", fr: "Accueil" },
  "nav.details": { en: "Details", fr: "Infos Pratiques" },
  "nav.rsvp": { en: "RSVP", fr: "RSVP" },
  "nav.registry": { en: "Gifts", fr: "Cadeaux" },
  "nav.venue": { en: "Venue", fr: "Lieux" },
  "nav.gallery": { en: "Gallery", fr: "Galerie" },
  "nav.contribute": { en: "Contribute", fr: "Contribuer" },

  // Home
  "welcome.title": { en: "Welcome", fr: "Bienvenue" },
  "home.welcome": {
    en: "Welcome to our wedding website! We're so excited to celebrate our special day with you. Feel free to explore the site for all the details. We can't wait to see you in Fribourg!",
    fr: "Bienvenue sur notre site de mariage ! Nous sommes ravis de pouvoir célébrer ce grand jour avec vous. Parcourez le site pour toutes les informations. Nous avons hâte de vous voir à Fribourg !",
  },
  "home.welcome_mobile": {
    en: "Welcome to our wedding website! We can't wait to see you in Fribourg!",
    fr: "Bienvenue sur notre site de mariage ! Nous avons hâte de vous voir à Fribourg !",
  },
  "home.saveDate": { en: "Save the Date!", fr: "Réservez la date !" },
  "home.days": { en: "Days", fr: "Jours" },
  "home.hours": { en: "Hours", fr: "Heures" },
  "home.minutes": { en: "Minutes", fr: "Minutes" },
  "home.seconds": { en: "Seconds", fr: "Secondes" },
  "home.quote": {
    en: "To love is to give everything and to give oneself.",
    fr: "Aimer, c'est tout donner et se donner soi-même.",
  },
  "home.quote_mobile": {
    en: "To love is to give everything\nand to give oneself.",
    fr: "Aimer, c'est tout donner et\nse donner soi-même.",
  },
  "home.quoteAuthor": {
    en: "St Thérèse of Lisieux",
    fr: "Ste Thérèse de Lisieux",
  },

  // Details Section
  "details.title": { en: "Wedding Details", fr: "Détails du Mariage" },
  "details.subtitle": {
    en: "Useful information for our guests",
    fr: "Informations utiles pour nos invités",
  },
  "details.accommodation.title": { en: "Where to Stay", fr: "Où dormir" },
  "details.accommodation.description": {
    en: "We recommend staying in Fribourg (15 min drive). Here are a few suggestions:",
    fr: "Nous recommandons de séjourner à Fribourg (15 min de route). Voici quelques suggestions :",
  },
  "details.book": { en: "Book Now", fr: "Réserver" },
  "details.qa.title": { en: "Common Questions", fr: "Questions Fréquentes" },

  // Q&A Specifics
  "details.qa.dressCode.question": {
    en: "What is the dress code?",
    fr: "Quel est le dress code ?",
  },
  "details.qa.dressCode.answer": {
    en: "To honor the sacred nature of the Basilica, we kindly suggest attire that covers the shoulders and knees.",
    fr: "Par respect pour le caractère sacré de la Basilique, nous suggérons une tenue couvrant les épaules et les genoux.",
  },
  "details.qa.transport.question": {
    en: "Parking & Transport",
    fr: "Parking et Transport",
  },
  "details.qa.transport.answer": {
    en: "Free parking available at the reception venue (Guglerahof). For the ceremony (Basilica), please use the nearby public parking (paid).",
    fr: "Parking gratuit disponible sur le lieu de réception (Ferme Guglerahof). Pour la cérémonie (Basilique), veuillez utiliser les parkings publics à proximité (payants).",
  },
  "details.qa.children.question": {
    en: "Are children invited?",
    fr: "Les enfants sont-ils invités ?",
  },
  "details.qa.children.answer": {
    en: "Yes! Children are invited. We look forward to celebrating with your whole family.",
    fr: "Oui ! Les enfants sont les bienvenus. Nous avons hâte de célébrer avec toute la famille.",
  },
  "details.qa.rsvp.question": {
    en: "When should I RSVP?",
    fr: "Quand répondre ?",
  },
  "details.qa.rsvp.answer": {
    en: "Replying as early as possible helps our organization; otherwise, by April 19th.",
    fr: "Le plus tôt possible facilite l'organisation et dans tous les cas, le 19 avril.",
  },
  "details.qa.apero.question": {
    en: "Where can I specify what I would like to bring for the Apero?",
    fr: "Où indiquer ce que je voudrais apporter pour l'Apéro ?",
  },
  "details.qa.apero.answer": {
    en: "You can specify this in the RSVP section. Please plan for a quantity of around 50 bites.",
    fr: "Vous pouvez l'indiquer dans la section RSVP. Merci de prévoir une quantité pour environ 50 bouchées.",
  },
  "details.qa.contactQuestions.question": {
    en: "Who should I contact if I have questions?",
    fr: "A qui m'adresser en cas de questions ?",
  },
  "details.qa.contactQuestions.answer": {
    en: "Chris Benjamin 078 949 51 91 cbchrisbenjamin@gmail.com",
    fr: "Chris Benjamin 078 949 51 91 cbchrisbenjamin@gmail.com",
  },
  "details.qa.contactHelp.question": {
    en: "Who should I contact to offer help?",
    fr: "Qui contacter pour proposer mon aide ?",
  },
  "details.qa.contactHelp.answer": {
    en: "Chris Benjamin 078 949 51 91 cbchrisbenjamin@gmail.com",
    fr: "Chris Benjamin 078 949 51 91 cbchrisbenjamin@gmail.com",
  },

  // RSVP Page
  "rsvp.title": { en: "RSVP", fr: "RSVP" },
  "rsvp.intro": {
    en: "Please RSVP by filling out the form below. Please respond as soon as possible so we can plan accordingly. Merci!",
    fr: "Merci de confirmer votre présence ci-dessous. Une réponse rapide nous aiderait grandement pour l'organisation. Merci !",
  },
  "rsvp.attending": {
    en: "Will you be attending?",
    fr: "Serez-vous présent(e) ?",
  },
  "rsvp.attending.yes": { en: "Joyfully Accept", fr: "Avec plaisir" },
  "rsvp.attending.no": {
    en: "Regretfully Decline",
    fr: "Je ne pourrai pas venir",
  },
  "rsvp.firstName": { en: "First Name", fr: "Prénom" },
  "rsvp.lastName": { en: "Last Name", fr: "Nom" },
  "rsvp.email": { en: "Email Address", fr: "Adresse e-mail" },
  "rsvp.updateInfo": {
    en: "Did you make a mistake? No worries! Simply submit the form again with the same email address to update your response.",
    fr: "Vous avez fait une erreur ? Pas de souci ! Soumettez simplement le formulaire à nouveau avec la même adresse email pour mettre à jour votre réponse.",
  },
  "rsvp.guests": { en: "Number of Guests", fr: "Nombre d'invités" },
  "rsvp.includingYou": { en: "(Including you)", fr: "(Vous inclus)" },
  "rsvp.children": {
    en: "Number of Children",
    fr: "Nombre d'enfants",
  },
  "rsvp.dietary": {
    en: "Dietary Restrictions",
    fr: "Restrictions alimentaires",
  },
  "rsvp.dietaryType": {
    en: "Dietary Requirements",
    fr: "Préférences alimentaires",
  },
  "rsvp.dietaryType.none": { en: "None", fr: "Aucune" },
  "rsvp.dietaryType.vegetarian": { en: "Vegetarian", fr: "Végé (lacto-ovo)" },
  "rsvp.dietaryType.vegan": { en: "Vegan", fr: "Végétalien" },
  "rsvp.dietaryType.glutenFree": { en: "Gluten-Free", fr: "Sans gluten" },
  "rsvp.dietaryType.nutAllergy": { en: "Nut Allergy", fr: "Allergie aux noix" },
  "rsvp.dietaryType.other": {
    en: "Other (specify below)",
    fr: "Autre (préciser ci-dessous)",
  },
  "rsvp.submit": { en: "Submit RSVP", fr: "Envoyer" },
  "rsvp.success": {
    en: "Thank you for your RSVP! We've received your response.",
    fr: "Merci pour votre réponse ! Nous avons bien reçu votre confirmation.",
  },
  "rsvp.successCheckDashboard": {
    en: "If you want to check your details, you can view the dashboard on the right side of the screen.",
    fr: "Si vous souhaitez vérifier vos informations, le tableau de bord est disponible sur la droite de l'écran.",
  },
  "rsvp.emailConfirmation": {
    en: "You will receive an email confirmation shortly.",
    fr: "Vous recevrez bientôt un email de confirmation.",
  },
  "rsvp.goToGifts": { en: "Go to Gifts", fr: "Aller aux Cadeaux" },
  "rsvp.aperoQuestion": {
    en: "I would like to bring something for the Apero (Quantity: 50 bites)",
    fr: "Je souhaite apporter quelque chose pour l’apéritif (environ 50 bouchées).",
  },
  "rsvp.aperoYes": {
    en: "Yes, I will bring something",
    fr: "Oui, je participe",
  },
  "rsvp.aperoNo": {
    en: "No, I will just enjoy",
    fr: "Non, je viendrai juste profiter",
  },
  "rsvp.aperoWarningTitle": {
    en: "Important Timing Info",
    fr: "Information Importante",
  },
  "rsvp.aperoWarning.intro": {
    en: "Since you are bringing food, please arrive ",
    fr: "Comme vous apportez de la nourriture, merci d'arriver ",
  },
  "rsvp.aperoWarning.bold": {
    en: "between 12:30 and 13:30 at Guglerahof Farm Guglera 6, 1735 Giffers to drop it off",
    fr: "entre 12h30 et 13h30 à la Ferme Guglerahof Guglera 6, 1735 Giffers pour le dépôt",
  },
  "rsvp.aperoWarning.outro": {
    en: " (Ceremony starts at 14:00 at Basilique Notre-Dame de Fribourg). Please label your plate.",
    fr: " (La cérémonie commence à 14h00 à Basilique Notre-Dame de Fribourg). Merci d'étiqueter votre plat.",
  },
  "rsvp.aperoTypeLabel": {
    en: "What type of food?",
    fr: "Quel type de nourriture ?",
  },
  "rsvp.typeSavory": { en: "Savory (Salty)", fr: "Salé" },
  "rsvp.typeSweet": { en: "Sweet", fr: "Sucré" },
  "rsvp.aperoItemLabel": { en: "What specifically?", fr: "Quoi exactement ?" },
  "rsvp.aperoCustomLabel": {
    en: "Please specify what you are bringing:",
    fr: "Veuillez préciser ce que vous apportez :",
  },
  "rsvp.aperoChoiceCustom": {
    en: "Something else (My own choice)",
    fr: "Autre chose (Mon propre choix)",
  },
  "rsvp.foodNote.intro": {
    en: "Please use this form to RSVP for the wedding. ",
    fr: "Utilisez ce formulaire pour répondre à l'invitation. ",
  },
  "rsvp.foodNote.bold": {
    en: "If you'd like, you can also sign up to bring something for the Apero.",
    fr: "Vous pouvez aussi, si vous le souhaitez, vous inscrire pour apporter quelque chose à l'Apéro.",
  },
  "rsvp.taken": { en: "(Already Taken)", fr: "(Déjà pris)" },
  "rsvp.addSavory": { en: "Add Savory Item", fr: "Ajouter Salé" },
  "rsvp.addSweet": { en: "Add Sweet Item", fr: "Ajouter Sucré" },
  "rsvp.yourSelection": { en: "Your Selection", fr: "Votre Choix" },
  "rsvp.quantity": { en: "Quantity", fr: "Quantité" },
  "rsvp.bites": { en: "bites", fr: "bouchées" },
  "rsvp.remove": { en: "Remove", fr: "Retirer" },
  "rsvp.noItems": {
    en: "No items selected yet",
    fr: "Aucun article sélectionné",
  },
  "rsvp.customItemPlaceholder": { en: "Item Name", fr: "Nom de l'article" },
  "rsvp.maxReached": { en: "Max limit reached", fr: "Limite atteinte" },
  "rsvp.dinnerQuestion": {
    en: "We'd love for you to join us for the Evening Dinner! Will you be staying for the evening?",
    fr: "Nous serions ravis que vous vous joigniez à nous pour le souper ! Restez-vous pour la soirée ?",
  },
  "rsvp.dinnerYes": {
    en: "Yes, I/We will stay for dinner",
    fr: "Oui, je/nous reste/restons pour le souper",
  },
  "rsvp.dinnerNo": {
    en: "No, unfortunately I/We can't stay",
    fr: "Non, malheureusement je/nous ne peux/pouvons pas rester",
  },

  // User Summary Panel
  "dashboard.button": { en: "Dashboard", fr: "Tableau de bord" },
  "summary.title": {
    en: "Your Wedding Dashboard",
    fr: "Votre Tableau de Bord",
  },
  "summary.subtitle": {
    en: "Here is a summary of your contributions and RSVP status.",
    fr: "Voici un résumé de vos contributions et statut RSVP.",
  },
  "summary.rsvp.title": { en: "Your RSVP", fr: "Votre RSVP" },
  "summary.rsvp.notFound": {
    en: "No RSVP found on this device.",
    fr: "Aucun RSVP trouvé sur cet appareil.",
  },
  "summary.rsvp.attending": { en: "Attending", fr: "Présent" },
  "summary.rsvp.notAttending": { en: "Not Attending", fr: "Absent" },
  "summary.rsvp.guestCount": { en: "Guests", fr: "Invités" },
  "summary.rsvp.adults": { en: "Adults", fr: "Adultes" },
  "summary.rsvp.children": { en: "Children", fr: "Enfants" },
  "summary.rsvp.dinner": { en: "Dinner", fr: "Souper" },
  "summary.rsvp.dietary": { en: "Dietary Notes", fr: "Notes Alimentaires" },
  "summary.rsvp.apero": {
    en: "Apero Contributions",
    fr: "Contributions Apéro",
  },
  "summary.rsvp.aperoWarning": {
    en: "Please drop off at Guglerahof Farm (12:30-13:30) before the ceremony.",
    fr: "Merci de déposer à la Ferme Guglerahof (12h30-13h30) avant la cérémonie.",
  },
  "summary.gifts.title": { en: "Your Gifts", fr: "Vos Cadeaux" },
  "summary.gifts.none": { en: "No gifts pledged yet.", fr: "Aucun cadeau." },
  "summary.gifts.refCode": { en: "Ref Code", fr: "Code Ref" },
  "summary.gifts.amount": { en: "Amount", fr: "Montant" },
  "summary.rsvp.updateHint": {
    en: "Mistake? Refill RSVP using the same email to update.",
    fr: "Une erreur ? Remplissez à nouveau le RSVP avec le même email pour mettre à jour.",
  },
  "summary.autoUpdate": {
    en: "Dashboard auto-updates when you submit new forms.",
    fr: "Le tableau de bord se met à jour automatiquement après chaque soumission.",
  },

  // Savory Options
  "food.savory.croissants": { en: "Ham Croissants", fr: "Croissants jambon" },
  "food.savory.sandwich": {
    en: "Mini Ham & Cheese Sandwiches",
    fr: "Mini sandwichs jambon fromage",
  },
  "food.savory.wraps": {
    en: "Salmon / Philadelphia Wraps",
    fr: "Wraps roulés saumon / Philadelphia",
  },
  "food.savory.dips": {
    en: "Vegetable Dips + Sauces",
    fr: "Dips légumes + sauces",
  },
  "food.savory.fauxgras": {
    en: "Mini Faux Gras Sandwiches",
    fr: "Mini sandwichs faux gras",
  },
  "food.savory.blinis_sub": {
    en: "Salmon Substitute Blinis",
    fr: "Blinis substitut saumon",
  },
  "food.savory.cakes_veg": {
    en: "Small Vegetable Cakes",
    fr: "Petits cakes légumes",
  },
  "food.savory.spinach": {
    en: "Mini Spinach Turnovers",
    fr: "Mini chaussons épinards",
  },
  "food.savory.blinis_faux": {
    en: "Faux-Salmon Blinis",
    fr: "Blinis faux-saumon",
  },
  "food.savory.cakes_bacon": {
    en: "Bacon & Cheese Cakes",
    fr: "Petits cakes lardons fromage",
  },
  "food.savory.blinis_salm": { en: "Salmon Blinis", fr: "Blinis saumon" },
  "food.savory.skewers_tom": {
    en: "Tomato & Mozzarella Skewers",
    fr: "Brochettes Tomates + Mozarella",
  },
  "food.savory.skewers_mel": {
    en: "Melon & Prosciutto Skewers",
    fr: "Brochettes melon–jambon cru",
  },

  // Sweet Options
  "food.sweet.skewers": { en: "Fruit Skewers", fr: "Brochettes de fruits" },
  "food.sweet.brownies": { en: "Brownies", fr: "Brownies" },
  "food.sweet.muffins": { en: "Mini Muffins", fr: "Mini muffins" },
  "food.sweet.tart_lemon": { en: "Lemon Tarts", fr: "Tartelettes citron" },
  "food.sweet.watermelon": {
    en: "Watermelon Triangles",
    fr: "Grosse pastèque coupées triangle",
  },
  "food.sweet.choux": { en: "Cream Puffs", fr: "Choux garnis" },
  "food.sweet.biscuits": {
    en: "Homemade Biscuits",
    fr: "Biscuits fait maison",
  },
  "food.sweet.cookies": { en: "Mini Cookies", fr: "Mini cookies" },
  "food.sweet.sables": { en: "Shortbread", fr: "Sablés" },
  "food.sweet.cupcake": { en: "Mini Cupcake", fr: "Mini Cupcake" },
  "food.sweet.verrines": { en: "Fruit Verrines", fr: "Verrines fruits" },

  // Registry
  "registry.title": { en: "Gifts", fr: "Cadeaux" },
  "registry.intro": {
    en: "Your presence at our wedding is the greatest gift of all. However, if you wish to honor us with a present, we've put together a small wish list.",
    fr: "Votre présence à notre mariage est le plus beau des cadeaux. Si vous souhaitez nous offrir quelque chose, nous avons préparé une petite liste.",
  },
  "registry.contribute": { en: "Contribute", fr: "Contribuer" },
  "registry.howTo": { en: "How to contribute:", fr: "Comment contribuer :" },
  "registry.contributeTitle": { en: "Contributions", fr: "Contributions" },
  "registry.contributeIntro": {
    en: "If you prefer to support us with a monetary gift, we have set up the following options:",
    fr: "Si vous préférez nous soutenir avec un don, voici les options disponibles :",
  },

  // Venue
  "venue.title": { en: "Venue Information", fr: "Lieux" },
  "venue.ceremony": { en: "Ceremony", fr: "Cérémonie" },
  "venue.reception": { en: "Apéro", fr: "Apéro" },
  "venue.directions": { en: "Get Directions", fr: "Itinéraire" },
  "venue.ceremonyTime": {
    en: "June 27, 2026 at 14:00",
    fr: "27 juin 2026 à 14h00",
  },
  "venue.ceremonyNote": {
    en: "Ceremony will begin promptly at 14:00 (please arrive 10 minutes early).",
    fr: "La cérémonie débutera à 14h00 précises (merci d'arriver 10 minutes en avance).",
  },
  "venue.receptionTime": {
    en: "Apéro to follow at 16:00",
    fr: "Apéro à suivre à 16h00",
  },
  "venue.receptionNote.standard": {
    en: "You are all cordially invited to the Vin d'honneur and Apero following the ceremony.",
    fr: "Vous êtes tous cordialement conviés au vin d'honneur et à l'apéritif qui suivront la cérémonie."
  },
  "venue.receptionNote.dinner": {
    en: "You are all cordially invited to the Vin d'honneur, Apero, and Dinner following the ceremony.",
    fr: "Vous êtes tous cordialement conviés au vin d'honneur, à l'apéritif et au souper qui suivront la cérémonie."
  },
  "venue.commuteLabel": {
    en: "Journey from Ceremony to Apero",
    fr: "Trajet de la Cérémonie à l'Apéro",
  },
  "venue.routeFromCeremony": {
    en: "Route from Ceremony",
    fr: "Itinéraire depuis la cérémonie",
  },
  "venue.openInMaps": { en: "Open in Maps", fr: "Ouvrir dans Maps" },
  "venue.copyAddress": { en: "Copy Address", fr: "Copier l'adresse" },
  "venue.receptionLocation": { en: "Guglerahof Farm", fr: "Ferme Guglerahof" },
  "venue.ceremonyAddress": {
    en: "Rue de Morat 12, 1700 Fribourg, Switzerland",
    fr: "Rue de Morat 12, 1700 Fribourg, Suisse",
  },
  "venue.ceremonyCity": {
    en: "1700 Fribourg, Switzerland",
    fr: "1700 Fribourg, Suisse",
  },
  "venue.receptionAddress": {
    en: "Guglerahof, Guglera 6, 1735 Giffers, Switzerland",
    fr: "Guglerahof, Guglera 6, 1735 Giffers, Suisse",
  },
  "venue.receptionCity": {
    en: "1735 Giffers, Switzerland",
    fr: "1735 Giffers, Suisse",
  },

  // Ceremony Details
  "ceremony.title": { en: "The Traditional Latin Mass", fr: "La Messe Traditionnelle en Latin" },
  "ceremony.subtitle": { en: "An ancient rite of beauty and silence.", fr: "Un rite ancien de beauté et de silence." },
  "ceremony.atmosphere": {
    en: "A High Mass will be celebrated, featuring a full choir and traditional Gregorian chant. This ancient rite invites you into a space of deep prayer and timeless beauty.",
    fr: "Une messe chantée sera célébrée, accompagnée d'une chorale et de chants grégoriens. Ce rite ancien vous invite à un moment de prière profonde et de beauté intemporelle."
  },
  "ceremony.videoCaption": {
    en: "A beautiful overview of the ceremony.",
    fr: "Un bel aperçu de la cérémonie."
  },
  "ceremony.attireTitle": { en: "Attire", fr: "Tenue" },
  "ceremony.attire": {
    en: "To honor the sacred nature of the Basilica, we kindly suggest attire that covers the shoulders and knees. Your presence is our greatest gift.",
    fr: "Par respect pour le caractère sacré de la Basilique, nous suggérons une tenue couvrant les épaules et les genoux. Votre présence est notre plus beau cadeau."
  },
  "ceremony.missaletteTitle": { en: "Missalette", fr: "Livret de Messe" },
  "ceremony.missalette": {
    en: "A bilingual missalette (Latin-English / Latin-French) will be provided at the entrance to help you follow the prayers and chants.",
    fr: "Un livret de messe bilingue (Latin-Anglais / Latin-Français) vous sera remis à l'entrée pour vous permettre de suivre les prières et les chants."
  },
  "ceremony.learnMore": { en: "The Ceremony", fr: "La Cérémonie" },

  // Parking Modal
  "parking.modalTitle": { en: "Parking near Basilique Notre-Dame", fr: "Parkings près de la Basilique" },
  "parking.viewMap": { en: "View Map", fr: "Voir la carte" },
  "parking.closeMap": { en: "Close Map", fr: "Fermer la carte" },
  "parking.walkingDistance": { en: "Walking distance", fr: "Temps de marche" },
  "parking.openMap": { en: "Open in Maps", fr: "Ouvrir dans Maps" },
  "parking.noteLabel": { en: "Note", fr: "Remarque" },
  "parking.backToList": { en: "Back to List", fr: "Retour à la liste" },

  // Parking 1: Place Notre-Dame

  // Parking 1: Place Notre-Dame
  "parking.p1.title": { en: "Place Notre-Dame / Arcades", fr: "Place Notre-Dame / Arcades" },
  "parking.p1.type": { en: "Outdoor parking, directly on the square.", fr: "Parking extérieur, sur la place." },
  "parking.p1.typeLabel": { en: "Type", fr: "Type" },
  "parking.p1.dist": { en: "0 min (on site)", fr: "0 min (sur place)" },
  "parking.p1.ideal": { en: "Short visits, drop-off, attending mass.", fr: "Courtes visites, dépose-minute, messe." },
  "parking.p1.idealLabel": { en: "Best for", fr: "Idéal pour" },
  "parking.p1.note": { en: "Limited spaces, often busy.", fr: "Nombre de places limité, souvent complet." },
  "parking.p1.noteLabel": { en: "Note", fr: "Remarque" },
  "parking.p1.address": { en: "Place Notre-Dame, 1700 Fribourg", fr: "Place Notre-Dame, 1700 Fribourg" },

  // Parking 2: Parking des Alpes
  "parking.p2.title": { en: "Parking des Alpes", fr: "Parking des Alpes" },
  "parking.p2.type": { en: "Underground / covered car park.", fr: "Parking souterrain / couvert." },
  "parking.p2.dist": { en: "5–7 min walk", fr: "5–7 min à pied" },
  "parking.p2.ideal": { en: "Longer visits, central location.", fr: "Visites plus longues, centre-ville." },
  "parking.p2.note": { en: "Open 24/7, more spaces available.", fr: "Ouvert en continu, plus de places." },
  "parking.p2.noteLabel": { en: "Advantages", fr: "Avantages" },
  "parking.p2.address": { en: "Square des Places 7, 1700 Fribourg", fr: "Square des Places 7, 1700 Fribourg" },

  // Parking 3: Fribourg Centre
  "parking.p3.title": { en: "Parking Fribourg Centre", fr: "Parking Fribourg Centre" },
  "parking.p3.type": { en: "Shopping mall underground parking.", fr: "Parking souterrain du centre commercial." },
  "parking.p3.dist": { en: "8–10 min walk", fr: "8–10 min à pied" },
  "parking.p3.ideal": { en: "Shopping + Basilica, long stays.", fr: "Shopping + Basilique, longue durée." },
  "parking.p3.note": { en: "Large capacity, direct mall access.", fr: "Grand nombre de places, accès centre." },
  "parking.p3.address": { en: "Av. de la Gare 10, 1700 Fribourg", fr: "Av. de la Gare 10, 1700 Fribourg" },

  // Public Transport
  "parking.p4.title": { en: "Train Station & Bus", fr: "Gare & Bus" },
  "parking.p4.type": { en: "Public Transport from Fribourg Gare", fr: "Transports publics depuis la Gare" },
  "parking.p4.dist": { en: "~7 min (Bus 1, 2, or 6)", fr: "~7 min (Bus 1, 2 ou 6)" },
  "parking.p4.ideal": { en: "Arrival by train.", fr: "Arrivée en train." },
  "parking.p4.note": { en: "Bus stop 'Tilleul' or 'Pont-Murat'", fr: "Arrêt 'Tilleul' ou 'Pont-Murat'" },
  "parking.p4.address": { en: "Gare de Fribourg, 1700 Fribourg", fr: "Gare de Fribourg, 1700 Fribourg" },


  // Gallery
  "gallery.title": { en: "Photo Gallery", fr: "Galerie Photos" },
  "gallery.subtitle": {
    en: "A collection of our favorite moments",
    fr: "Une collection de nos moments préférés",
  },
  "gallery.officialPhotos": {
    en: "Official photos arriving after the wedding!",
    fr: "Les photos officielles arriveront après le mariage !",
  },
  "gallery.comingSoon": {
    en: "Photo Coming Soon",
    fr: "Photo à venir bientôt",
  },

  // Contribute
  "contribute.sectionTitle": {
    en: "Contribute Directly",
    fr: "Contribuer directement",
  },
  "contribute.sectionIntro": {
    en: "If you prefer to give a monetary contribution instead, we've made it easy for you.",
    fr: "Si vous préférez offrir une contribution financière, nous avons facilité les choses pour vous.",
  },
  "contribute.bank": { en: "Bank Transfer", fr: "Virement bancaire" },
  "contribute.thanks": {
    en: "Thank you for your generosity!",
    fr: "Merci pour votre générosité !",
  },
  "contribute.currency": { en: "CHF", fr: "CHF" },
  "contribute.paypalDesc": {
    en: "Fast and secure online transfer.",
    fr: "Transfert en ligne rapide et sécurisé.",
  },
  "contribute.twintDesc": {
    en: "Scan via the Twint app (Switzerland).",
    fr: "Scannez via l'application Twint (Suisse).",
  },
  "contribute.bankDesc": {
    en: "Traditional bank transfer details.",
    fr: "Coordonnées bancaires pour virement.",
  },
  "contribute.copy": { en: "Copy", fr: "Copier" },
  "contribute.copied": { en: "Copied!", fr: "Copié !" },

  // Registry Pledge Flow
  "registry.browseBtn": {
    en: "Browse Gift Wishlist",
    fr: "Parcourir la liste de mariage",
  },
  "registry.cashBtn": {
    en: "Contribute to our Honeymoon",
    fr: "Participer à notre voyage de noces",
  },
  "registry.cashDesc": {
    en: "Help us create unforgettable memories.",
    fr: "Aidez-nous à créer des souvenirs inoubliables.",
  },
  "registry.pledgeBtn": { en: "Contribute", fr: "Contribuer" },
  "registry.pledgeTitle": { en: "Make a Contribution", fr: "Faire un don" },
  "registry.pledgeSubtitle": {
    en: "Contributing towards: ",
    fr: "Participation pour : ",
  },
  "registry.nameLabel": { en: "Your Name", fr: "Nom Prénom" },
  "registry.emailLabel": { en: "Your Email", fr: "Votre Email" },
  "registry.addressLabel": { en: "Living Address", fr: "Adresse postale" },
  "registry.addressExplan": {
    en: "So we can thank you!",
    fr: "Pour vous remercier !",
  },
  "registry.addressPlaceholder": {
    en: "Street, City, Zip...",
    fr: "Rue, Ville, Code Postal...",
  },
  "registry.amountLabel": { en: "Amount (CHF)", fr: "Montant (CHF)" },
  "registry.customAmount": { en: "Custom Amount", fr: "Montant libre" },
  "registry.messageLabel": {
    en: "Short Message (Optional)",
    fr: "Petit message (Optionnel)",
  },
  "registry.confirmBtn": { en: "Confirm Contribution", fr: "Confirmer" },
  "registry.sending": { en: "Processing...", fr: "Traitement..." },
  "registry.thankYou": { en: "Thank You, {name}!", fr: "Merci, {name} !" },
  "registry.paymentInstructions": {
    en: "To finalize your gift, please send the amount via Twint or Bank Transfer using the reference code below.",
    fr: "Pour finaliser, merci d'envoyer le montant via Twint ou virement avec le code ci-dessous.",
  },
  "registry.sendTo": { en: "Send to Steve:", fr: "Envoyer à Steve :" },
  "registry.revolutInstruction": {
    en: "Scan QR or use link",
    fr: "Scannez le QR ou utilisez le lien",
  },
  "registry.zoomQr": {
    en: "(Click image to enlarge)",
    fr: "(Cliquez pour agrandir)",
  },
  "registry.zoomLabel": { en: "Zoom", fr: "Zoom" },
  "registry.scanQrTitle": { en: "Scan QR Code", fr: "Scanner le QR Code" },
  "registry.scanQrDialog": {
    en: "Scan with the Revolut app or your camera.",
    fr: "Scannez avec l'application Revolut ou votre caméra.",
  },
  "registry.refCode": {
    en: "Reference Code (Please add this to your payment message)",
    fr: "Code de référence (À mettre dans le message de paiement)",
  },
  "registry.copy": { en: "Copy", fr: "Copier" },
  "registry.copied": { en: "Copied!", fr: "Copié !" },
  "registry.fullyFunded": {
    en: "Fully Contributed",
    fr: "Entièrement financé",
  },
  "registry.goal": { en: "Goal", fr: "Objectif" },
  "registry.raised": { en: "Raised", fr: "Récolté" },
  "registry.error.missingAmount": {
    en: "Please select or enter an amount.",
    fr: "Veuillez sélectionner ou saisir un montant.",
  },
  "registry.error.missingName": {
    en: "Please enter your name.",
    fr: "Veuillez entrer votre nom.",
  },
  "registry.error.missingEmail": {
    en: "Please enter your email.",
    fr: "Veuillez entrer votre email.",
  },
  "registry.error.missingAddress": {
    en: "Please enter your address.",
    fr: "Veuillez entrer votre adresse.",
  },

  // Footer
  "footer.contact": { en: "Contact Us", fr: "Nous contacter" },
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("language");
    return saved === "en" || saved === "fr" ? saved : "fr";
  });

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "fr" : "en"));
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
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
