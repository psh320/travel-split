import { useEffect } from "react";
import { ADSENSE_CONFIG } from "../config/adsense";

interface GoogleAdProps {
  client: string;
  slot: string;
  style?: React.CSSProperties;
  className?: string;
  format?: string;
  responsive?: boolean;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

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
      // Only load ads if not in test mode and adsbygoogle is available
      if (
        !ADSENSE_CONFIG.testMode &&
        typeof window !== "undefined" &&
        window.adsbygoogle
      ) {
        window.adsbygoogle.push({});
      }
    } catch (error) {
      console.error("AdSense error:", error);
    }
  }, []);

  // Show placeholder in test mode
  if (ADSENSE_CONFIG.testMode) {
    return (
      <div
        className={`google-ad-container ${className}`}
        style={{
          ...style,
          backgroundColor: "#f3f4f6",
          border: "2px dashed #d1d5db",
          borderRadius: "0.5rem",
          padding: "2rem",
          textAlign: "center",
          color: "#6b7280",
          fontSize: "0.875rem",
        }}
      >
        <div>📢 Ad Placeholder</div>
        <div style={{ fontSize: "0.75rem", marginTop: "0.5rem" }}>
          Slot ID: {slot}
        </div>
        <div style={{ fontSize: "0.75rem" }}>
          Real ads will appear after AdSense approval
        </div>
      </div>
    );
  }

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
