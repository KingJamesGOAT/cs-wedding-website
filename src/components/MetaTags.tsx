import { useEffect } from 'react';
import { getOGImageDataURL } from './OGImage';

export default function MetaTags() {
  useEffect(() => {
    // Set the page title
    document.title = 'Cynthia & Steve - Wedding Website';

    // Get or create meta tags
    const setMetaTag = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    const setMetaTagName = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Open Graph tags
    setMetaTag('og:title', 'Cynthia & Steve - Wedding Website');
    setMetaTag('og:description', 'Join us in celebrating our special day on June 27, 2026 in Fribourg, Switzerland');
    setMetaTag('og:type', 'website');
    setMetaTag('og:image', getOGImageDataURL());
    setMetaTag('og:image:width', '1200');
    setMetaTag('og:image:height', '630');
    setMetaTag('og:image:alt', 'Cynthia & Steve Wedding - SC Monogram');
    
    // Twitter Card tags
    setMetaTagName('twitter:card', 'summary_large_image');
    setMetaTagName('twitter:title', 'Cynthia & Steve - Wedding Website');
    setMetaTagName('twitter:description', 'Join us in celebrating our special day on June 27, 2026 in Fribourg, Switzerland');
    setMetaTagName('twitter:image', getOGImageDataURL());
    
    // Standard meta tags
    setMetaTagName('description', 'Join us in celebrating Cynthia & Steve\'s wedding on June 27, 2026 in Fribourg, Switzerland. RSVP, view venue details, and explore our gift registry.');
  }, []);

  return null; // This component doesn't render anything
}
