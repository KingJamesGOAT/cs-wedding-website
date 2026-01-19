import emailjs from '@emailjs/browser';

// CONFIGURATION
const SERVICE_ID = 'service_8o2jqdr'; // Provided by user
const PUBLIC_KEY = 'HJF2n6CK_DGo8ImBf'; // Provided by user
const TEMPLATE_ID = 'template_hpuv9lp'; // Updated with user's ID

// Initialize EmailJS
export const initEmailService = () => {
  emailjs.init(PUBLIC_KEY);
};

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
    const templateParams = {
      type: 'registry',
      language: data.language,
      to_name: data.to_name,
      to_email: data.to_email,
      item_name: data.item_name,
      amount: data.amount,
      ref_code: data.ref_code,
      
      // Payment Info (Static or Dynamic based on language can be handled here or in template)
      // We will send pre-formatted HTML sections to the template for simplicity
      payment_info: data.language === 'fr' 
        ? `
          <strong>IBAN:</strong> CH12 3456 7890 1234 5678 9 <br>
          <strong>TWINT:</strong> 079 123 45 67 (Steve) <br>
          <strong>Ref Code:</strong> ${data.ref_code}
        `
        : `
          <strong>IBAN:</strong> CH12 3456 7890 1234 5678 9 <br>
          <strong>TWINT:</strong> 079 123 45 67 (Steve) <br>
          <strong>Ref Code:</strong> ${data.ref_code}
        `
    };

    return emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams as unknown as Dictionary);
  },

  /**
   * Sends the RSVP Confirmation Email
   */
  sendRSVPConfirmation: async (data: RSVPData) => {
    const templateParams = {
      type: 'rsvp',
      language: data.language,
      to_name: data.to_name,
      to_email: data.to_email,
      attending_status: data.attending_status,
      guests_count: data.guests_count,
      children_count: data.children_count,
      dinner_status: data.dinner_status,
      dietary_info: data.dietary_info,
      apero_summary: data.apero_summary
    };

    return emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams as unknown as Dictionary);
  }
};
