// Google AdSense Configuration
// TODO: Replace with your actual AdSense details after approval

export const ADSENSE_CONFIG = {
  // Your AdSense Publisher ID (get this from AdSense dashboard)
  publisherId: "ca-pub-XXXXXXXXXXXXXXXXX", // Replace with YOUR actual ID

  // Ad Slot IDs for different ad units (create these in AdSense)
  adSlots: {
    banner: "1234567890", // Replace with actual ad slot ID from AdSense
    sidebar: "2345678901", // Create if needed
    inContent: "3456789012", // Create if needed
    mobile: "4567890123", // Create if needed
  },

  // Test mode - set to true during development
  testMode: import.meta.env.DEV || true, // Keep true until you get real AdSense approval
};

// Ad placement configuration
export const AD_PLACEMENTS = {
  homePage: {
    afterContent: true,
    beforeFooter: true,
  },
  tripDashboard: {
    afterExpenseList: true,
  },
  balancePage: {
    afterSummary: true,
  },
};
