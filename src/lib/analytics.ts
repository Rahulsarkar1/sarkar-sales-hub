// Google Analytics event tracking utilities

declare global {
  interface Window {
    gtag?: (
      command: 'event',
      eventName: string,
      eventParams?: Record<string, any>
    ) => void;
  }
}

export const trackEvent = (eventName: string, eventParams?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, eventParams);
  }
};

// Product related events
export const trackProductView = (productName: string, category?: string) => {
  trackEvent('view_item', {
    item_name: productName,
    item_category: category,
  });
};

export const trackProductClick = (productName: string, category?: string) => {
  trackEvent('select_item', {
    item_name: productName,
    item_category: category,
  });
};

// Lead generation events
export const trackLeadEnquiry = (productName: string, method: 'whatsapp' | 'phone') => {
  trackEvent('generate_lead', {
    product_name: productName,
    contact_method: method,
  });
};

// CTA events
export const trackCTAClick = (ctaName: string, location?: string) => {
  trackEvent('cta_click', {
    cta_name: ctaName,
    location: location || 'unknown',
  });
};

// Contact events
export const trackContactAction = (method: 'whatsapp' | 'phone' | 'email', source: string) => {
  trackEvent('contact', {
    method,
    source,
  });
};

// Search events
export const trackSearch = (searchTerm: string) => {
  trackEvent('search', {
    search_term: searchTerm,
  });
};
