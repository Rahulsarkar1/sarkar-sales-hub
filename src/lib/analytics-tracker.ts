import { supabase } from "@/integrations/supabase/client";

// Generate or retrieve anonymous visitor ID
function getVisitorId(): string {
  const key = "visitor_id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

// Generate session ID (changes per session)
function getSessionId(): string {
  const key = "session_id";
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(key, id);
  }
  return id;
}

// Detect device type from user agent
function getDeviceType(): string {
  const ua = navigator.userAgent;
  if (/tablet|ipad|playbook|silk/i.test(ua)) return "tablet";
  if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(ua)) return "mobile";
  return "desktop";
}

// Parse browser from user agent
function getBrowser(): string {
  const ua = navigator.userAgent;
  if (ua.includes("Firefox")) return "Firefox";
  if (ua.includes("SamsungBrowser")) return "Samsung Browser";
  if (ua.includes("Opera") || ua.includes("OPR")) return "Opera";
  if (ua.includes("Edge")) return "Edge";
  if (ua.includes("Chrome")) return "Chrome";
  if (ua.includes("Safari")) return "Safari";
  return "Other";
}

// Detect traffic source from referrer and UTM params
function getSource(): string {
  const referrer = document.referrer;
  const url = new URL(window.location.href);
  const utmSource = url.searchParams.get("utm_source");

  if (utmSource) {
    const source = utmSource.toLowerCase();
    if (source.includes("google")) return "organic";
    if (source.includes("facebook") || source.includes("instagram") || source.includes("twitter") || source.includes("linkedin")) return "social";
    return "referral";
  }

  if (!referrer) return "direct";

  try {
    const refUrl = new URL(referrer);
    const host = refUrl.hostname.toLowerCase();
    
    if (host.includes("google") || host.includes("bing") || host.includes("yahoo") || host.includes("duckduckgo")) {
      return "organic";
    }
    if (host.includes("facebook") || host.includes("instagram") || host.includes("twitter") || host.includes("linkedin") || host.includes("t.co")) {
      return "social";
    }
    if (host === window.location.hostname) {
      return "direct";
    }
    return "referral";
  } catch {
    return "direct";
  }
}

// Get UTM parameters
function getUtmParams(): { utm_source?: string; utm_medium?: string; utm_campaign?: string } {
  const url = new URL(window.location.href);
  return {
    utm_source: url.searchParams.get("utm_source") || undefined,
    utm_medium: url.searchParams.get("utm_medium") || undefined,
    utm_campaign: url.searchParams.get("utm_campaign") || undefined,
  };
}

// Location cache
let locationCache: { country?: string; city?: string } | null = null;

// Fetch user location (free IP API with fallback)
async function getLocation(): Promise<{ country?: string; city?: string }> {
  if (locationCache) return locationCache;
  
  try {
    const response = await fetch("https://ipapi.co/json/", { 
      signal: AbortSignal.timeout(3000)
    });
    if (response.ok) {
      const data = await response.json();
      locationCache = { country: data.country_name, city: data.city };
      return locationCache;
    }
  } catch {
    // Silently fail - location is optional
  }
  return {};
}

interface AnalyticsEvent {
  event_type: string;
  event_name?: string;
  page_path?: string;
  referrer?: string;
  source?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  product_id?: string;
  product_name?: string;
  segment_name?: string;
  user_agent?: string;
  device_type?: string;
  browser?: string;
  country?: string;
  city?: string;
  session_id?: string;
  visitor_id?: string;
}

// Core tracking function
async function trackEvent(event: AnalyticsEvent): Promise<void> {
  try {
    const location = await getLocation();
    const utmParams = getUtmParams();
    
    const payload = {
      ...event,
      page_path: event.page_path || window.location.pathname,
      referrer: document.referrer || undefined,
      source: event.source || getSource(),
      user_agent: navigator.userAgent,
      device_type: getDeviceType(),
      browser: getBrowser(),
      session_id: getSessionId(),
      visitor_id: getVisitorId(),
      country: location.country,
      city: location.city,
      ...utmParams,
    };

    await supabase.from("analytics_events").insert(payload);
  } catch (error) {
    console.error("Analytics tracking error:", error);
  }
}

// Track page views
export function trackPageView(pagePath?: string): void {
  trackEvent({
    event_type: "page_view",
    page_path: pagePath || window.location.pathname,
  });
}

// Track product view (when dialog opens)
export function trackProductView(productId: string, productName: string, segmentName?: string): void {
  trackEvent({
    event_type: "product_view",
    product_id: productId,
    product_name: productName,
    segment_name: segmentName,
  });
}

// Track product click (card click)
export function trackProductClick(productId: string, productName: string, segmentName?: string): void {
  trackEvent({
    event_type: "product_click",
    product_id: productId,
    product_name: productName,
    segment_name: segmentName,
  });
}

// Track call clicks
export function trackCallClick(source: string, productName?: string): void {
  trackEvent({
    event_type: "call_click",
    event_name: source,
    product_name: productName,
  });
}

// Track WhatsApp clicks
export function trackWhatsAppClick(source: string, productName?: string): void {
  trackEvent({
    event_type: "whatsapp_click",
    event_name: source,
    product_name: productName,
  });
}

// Track CTA clicks
export function trackCTAClick(ctaName: string, location: string): void {
  trackEvent({
    event_type: "cta_click",
    event_name: ctaName,
    page_path: location,
  });
}
