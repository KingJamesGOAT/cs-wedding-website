import emailjs from '@emailjs/browser';

// CONFIGURATION
const SERVICE_ID = 'service_0lqnb2j'; // Updated by user
const PUBLIC_KEY = 'HJF2n6CK_DGo8ImBf'; // Provided by user
const TEMPLATE_ID = 'template_wmz7wca'; // Updated by user

// INTERFACES
interface BaseEmailData {
  language: 'en' | 'fr';
  to_name: string;
  to_email: string;
}

interface Dictionary {
  [key: string]: unknown;
}

interface PledgeData extends BaseEmailData {
  item_name: string;
  amount: string;
  ref_code: string;
}

interface RSVPData extends BaseEmailData {
  attending_status: string; // "Joyfully Accept" or "Regretfully Decline" (Localized)
  guests_count: number;
  children_count: number;
  dinner_status: string;
  dietary_info: string;
  apero_summary: string; // Formatted string with item + details + warning
}

// SERVICE
export const EmailService = {
  /**
   * Sends the Registry Confirmation Email
   */
  sendRegistryConfirmation: async (data: PledgeData) => {
    const isFrench = data.language === 'fr';

    const title = isFrench ? 'Mariage de Cynthia & Steve' : "Cynthia & Steve's Wedding";
    const greeting = isFrench ? `Bonjour ${data.to_name},` : `Hi ${data.to_name},`;
    
    // Explicit confirmation message
    const message_body = isFrench 
      ? "Nous avons bien reçu votre souhait de contribuer à notre liste de mariage ! Merci infiniment." 
      : "We have received your pledge to contribute to our wedding registry. Thank you so much!";

    const details_section = `
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; border: 1px solid #eee;">
          <p><strong>${isFrench ? 'Article' : 'Item'}:</strong> ${data.item_name}</p>
          <p><strong>${isFrench ? 'Montant' : 'Amount'}:</strong> CHF ${data.amount}</p>
      </div>
    `;

    const instructions_title = isFrench ? 'Instructions de Paiement' : 'Payment Instructions';

    const payment_info = isFrench 
      ? `
          <strong>IBAN:</strong> CH54 0024 3243 5109 5140 Q (Monsieur Steve Benjamin)<br>
          <strong>BIC:</strong> UBSWCHZH80A <br>
          <strong>Twint:</strong> +41 78 635 03 07 <br>
          <strong>Revolut:</strong> <a href="https://revolut.me/steveben">revolut.me/steveben</a> <br>
          <strong>Ref Code:</strong> ${data.ref_code}
        `
      : `
          <strong>IBAN:</strong> CH54 0024 3243 5109 5140 Q (Monsieur Steve Benjamin)<br>
          <strong>BIC:</strong> UBSWCHZH80A <br>
          <strong>Twint:</strong> +41 78 635 03 07 <br>
          <strong>Revolut:</strong> <a href="https://revolut.me/steveben">revolut.me/steveben</a> <br>
          <strong>Ref Code:</strong> ${data.ref_code}
        `;

    const footer = "Cynthia & Steve <br> 27.06.2026";
    // Footer note removed for Registry email as requested

    // Send simple HTML blob to the template
    // Title color changed to #333 (Dark Grey/Black) from #d14444
    const main_content = `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; text-align: center;">${title}</h2>
          <p>${greeting}</p>
          <p>${message_body}</p>
          ${details_section}
          <h3>${instructions_title}</h3>
          <div style="background-color: #fff0f0; padding: 15px; border: 1px solid #ffdcdc; border-radius: 5px;">
              ${payment_info}
          </div>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="text-align: center; font-size: 0.9em; color: #888;">${footer}</p>
      </div>
    `;

    const templateParams = {
      to_email: data.to_email,
      to_name: data.to_name,
      subject: isFrench ? `Confirmation - ${title}` : `Confirmation - ${title}`,
      email_content: main_content 
    };

    console.log('[EmailService] Sending Registry Email:', templateParams);
    
    return emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams as unknown as Dictionary, PUBLIC_KEY)
      .then(response => {
         console.log('[EmailService] SUCCESS!', response.status, response.text);
         return response;
      })
      .catch(err => {
         console.error('[EmailService] FAILED...', err);
         throw err;
      });
  },

  /**
   * Sends the RSVP Confirmation Email
   */
  sendRSVPConfirmation: async (data: RSVPData) => {
    const isFrench = data.language === 'fr';

    const title = isFrench ? 'Mariage de Cynthia & Steve' : "Cynthia & Steve's Wedding";
    const greeting = isFrench ? `Bonjour ${data.to_name},` : `Hi ${data.to_name},`;
    
    // Explicit confirmation message
    const message_body = isFrench 
      ? "Nous avons bien reçu votre confirmation. Voici un récapitulatif :" 
      : "We have received your confirmation. Here is a summary:";

    // Conditional Fields Logic
    let dinnerLine = '';
    // Show if NOT N/A and NOT empty
    if (data.dinner_status && data.dinner_status !== 'N/A') {
       dinnerLine = `<p><strong>${isFrench ? 'Souper' : 'Dinner'}:</strong> ${data.dinner_status}</p>`;
    }

    let dietaryLine = '';
    // Check against localized "None" / "Aucune" or raw values
    const isNone = data.dietary_info.toLowerCase().includes('none') || data.dietary_info.toLowerCase().includes('aucune');
    if (!isNone && data.dietary_info.trim() !== '') {
       dietaryLine = `<p><strong>${isFrench ? 'Régime' : 'Dietary'}:</strong> ${data.dietary_info}</p>`;
    }

    const details_section = `
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; border: 1px solid #eee;">
          <p><strong>Status:</strong> ${data.attending_status}</p>
          <p><strong>${isFrench ? 'Invités' : 'Guests'}:</strong> ${data.guests_count} | <strong>${isFrench ? 'Enfants' : 'Children'}:</strong> ${data.children_count}</p>
          ${dinnerLine}
          ${dietaryLine}
      </div>
    `;

    // Apero summary is already pre-formatted HTML from the component
    
    const footer = "Cynthia & Steve <br> 27.06.2026";
    const footer_note = isFrench 
      ? "Vous avez fait une erreur ? Pas de souci ! Remplissez simplement le formulaire à nouveau sur le site avec la même adresse email."
      : "Did you make a mistake? No problem! Simply fill out the form on the website again with the same email.";

    // Send simple HTML blob to the template
    // Title color changed to #333 (Dark Grey/Black)
    const main_content = `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; text-align: center;">${title}</h2>
          <p>${greeting}</p>
          <p>${message_body}</p>
          ${details_section}
          ${data.apero_summary || ''}
          <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="text-align: center; font-size: 0.9em; color: #888;">
            ${footer_note}
            <br><br>
            ${footer}
          </p>
      </div>
    `;

    const templateParams = {
      to_email: data.to_email,
      to_name: data.to_name,
      subject: isFrench ? `Confirmation RSVP - ${title}` : `RSVP Confirmation - ${title}`,
      email_content: main_content
    };

    console.log('[EmailService] Sending RSVP Email:', templateParams);

    return emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams as unknown as Dictionary, PUBLIC_KEY)
      .then(response => {
         console.log('[EmailService] SUCCESS!', response.status, response.text);
         return response;
      })
      .catch(err => {
         console.error('[EmailService] FAILED...', err);
         throw err;
      });
  }
};
