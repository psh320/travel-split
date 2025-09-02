// Google AdSense TypeScript Definitions

/**
 * Configuration object for AdSense ads
 */
export interface AdSenseAdConfig {
  // For display ads rendered from HTML elements
  element?: HTMLElement;

  // For programmatic ads
  adClient?: string;
  adSlot?: string;
  adFormat?: string;
  fullWidthResponsive?: boolean;

  // For auto ads configuration
  google_ad_client?: string;
  enable_page_level_ads?: boolean;

  // AdSense can accept various other configuration properties
  [key: string]: unknown;
}

/**
 * AdSense adsbygoogle array interface
 */
export interface AdsByGoogle {
  /**
   * Push an ad configuration to render ads
   * @param config - Ad configuration object or empty object to render existing ads
   * @returns Number of ads processed or void
   */
  push: (config: AdSenseAdConfig | Record<string, never>) => number | void;

  /** Whether AdSense script has finished loading */
  loaded?: boolean;

  /** Number of ad configurations in the array */
  length: number;

  /** Array index access for ad configurations */
  [index: number]: AdSenseAdConfig;
}

/**
 * Global window interface extension for AdSense
 */
declare global {
  interface Window {
    /** Google AdSense adsbygoogle array */
    adsbygoogle: AdsByGoogle;
  }
}

/**
 * AdSense display formats
 */
export type AdSenseFormat =
  | "auto"
  | "rectangle"
  | "vertical"
  | "horizontal"
  | "fluid"
  | "autorelaxed";

/**
 * Props for the GoogleAd React component
 */
export interface GoogleAdProps {
  /** AdSense client ID (publisher ID) */
  client: string;

  /** Ad unit slot ID */
  slot: string;

  /** Custom CSS styles for the ad container */
  style?: React.CSSProperties;

  /** Additional CSS classes */
  className?: string;

  /** Ad format type */
  format?: AdSenseFormat;

  /** Enable responsive design */
  responsive?: boolean;
}
