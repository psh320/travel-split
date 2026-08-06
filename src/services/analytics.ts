const measurementId =
  import.meta.env.VITE_GOOGLE_ANALYTICS_ID ??
  import.meta.env.VITE_FIREBASE_MEASUREMENT_ID;

type Gtag = (...args: unknown[]) => void;

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: Gtag;
  }
}

let initialized = false;

export const initializeAnalytics = () => {
  if (!import.meta.env.PROD || !measurementId || initialized) return;

  window.dataLayer = window.dataLayer ?? [];
  window.gtag =
    window.gtag ??
    function gtag(...args: unknown[]) {
      window.dataLayer.push(args);
    };

  window.gtag("js", new Date());
  window.gtag("config", measurementId, {
    send_page_view: false,
  });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(
    measurementId
  )}`;
  document.head.appendChild(script);

  initialized = true;
};

export const trackPageView = (pagePath: string, pageReferrer?: string) => {
  if (!import.meta.env.PROD || !measurementId) return;

  initializeAnalytics();
  window.gtag("event", "page_view", {
    page_location: `${window.location.origin}${pagePath}`,
    page_path: pagePath,
    ...(pageReferrer ? { page_referrer: pageReferrer } : {}),
    page_title: document.title,
  });
};
