import { useEffect } from "react";
import type { GoogleAdProps, AdsByGoogle } from "../types/adsense";

const GoogleAd: React.FC<GoogleAdProps> = ({
  client,
  slot,
  style = { display: "block" },
  className = "",
  format = "auto",
  responsive = true,
}) => {
  useEffect(() => {
    try {
      // Initialize adsbygoogle array if not exists
      if (typeof window !== "undefined") {
        if (!window.adsbygoogle) {
          window.adsbygoogle = [] as unknown as AdsByGoogle;
        }

        // Push empty config to trigger rendering of ads already in DOM
        window.adsbygoogle.push({});
      }
    } catch (error) {
      console.error("AdSense initialization error:", error);
    }
  }, []);

  return (
    <div className={`google-ad-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={style}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive.toString()}
      />
    </div>
  );
};

export default GoogleAd;
