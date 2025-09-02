import { useEffect } from "react";
import { ADSENSE_CONFIG } from "../config/adsense";

interface AdSenseScriptProps {
  publisherId: string;
}

const AdSenseScript: React.FC<AdSenseScriptProps> = ({ publisherId }) => {
  useEffect(() => {
    // Don't load AdSense script in test mode
    if (ADSENSE_CONFIG.testMode) {
      console.log("AdSense: Running in test mode, script not loaded");
      return;
    }

    // Only load script if not already loaded
    if (!document.querySelector(`script[src*="adsbygoogle.js"]`)) {
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`;
      script.crossOrigin = "anonymous";
      document.head.appendChild(script);

      // Initialize adsbygoogle array if not exists
      if (typeof window !== "undefined" && !window.adsbygoogle) {
        window.adsbygoogle = [];
      }
    }
  }, [publisherId]);

  return null; // This component doesn't render anything
};

export default AdSenseScript;
