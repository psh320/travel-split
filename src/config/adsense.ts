// Google AdSense Configuration
export const ADSENSE_CONFIG = {
  publisherId: "ca-pub-7682850870038833",

  // Ad Slot IDs for different ad units (create these in AdSense)
  adSlots: {
    banner: "8421016429",
  },
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
