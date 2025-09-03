import { useEffect, useRef, useState } from "react";
import type { GoogleAdProps, AdsByGoogle } from "../types/adsense";
import AdFallback from "./AdFallback";

const GoogleAd: React.FC<GoogleAdProps> = ({
  client,
  slot,
  style = { display: "block" },
  className = "",
  format = "auto",
  responsive = true,
}) => {
  const adRef = useRef<HTMLModElement>(null);
  const [adLoaded, setAdLoaded] = useState(false);
  const [adError, setAdError] = useState<string | null>(null);
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    const loadAd = () => {
      try {
        // Check if AdSense script is loaded
        if (typeof window === "undefined") return;

        // Initialize adsbygoogle array if not exists
        if (!window.adsbygoogle) {
          window.adsbygoogle = [] as unknown as AdsByGoogle;
        }

        // Wait a bit to ensure the ad element is in the DOM
        const timer = setTimeout(() => {
          try {
            if (adRef.current) {
              // Push configuration to render the ad
              (window.adsbygoogle as AdsByGoogle).push({});
              setAdLoaded(true);
              console.log("AdSense ad loaded for slot:", slot);

              // Check if ad actually rendered after a delay
              setTimeout(() => {
                if (adRef.current) {
                  const adHeight = adRef.current.offsetHeight;
                  if (adHeight === 0) {
                    console.warn("Ad may be blocked or no inventory available");
                    setShowFallback(true);
                  }
                }
              }, 2000);
            }
          } catch (error) {
            console.error("AdSense ad rendering error:", error);
            setAdError(
              error instanceof Error ? error.message : "Unknown ad error"
            );
          }
        }, 100);

        return () => clearTimeout(timer);
      } catch (error) {
        console.error("AdSense initialization error:", error);
        setAdError(
          error instanceof Error ? error.message : "Initialization error"
        );
      }
    };

    // Check if AdSense script is already loaded
    if (typeof window !== "undefined" && window.adsbygoogle) {
      loadAd();
    } else {
      // Wait for script to load
      const checkScript = setInterval(() => {
        if (window.adsbygoogle) {
          clearInterval(checkScript);
          loadAd();
        }
      }, 100);

      // Cleanup after 10 seconds if script doesn't load
      setTimeout(() => {
        clearInterval(checkScript);
        if (!adLoaded) {
          setAdError("AdSense script failed to load");
          setShowFallback(true);
        }
      }, 10000);
    }
  }, [slot, adLoaded]);

  // Show fallback if there's an error or ad is blocked
  if (showFallback) {
    return (
      <div className={`google-ad-container ${className}`}>
        <AdFallback
          message={adError || "Ad not available"}
          showSupportMessage={true}
          height={
            typeof style === "object" && style.minHeight
              ? (style.minHeight as string)
              : "100px"
          }
        />

        {/* Debug info - remove in production */}
        {process.env.NODE_ENV === "development" && (
          <div
            style={{
              fontSize: "0.75rem",
              color: "#666",
              marginTop: "0.5rem",
              padding: "0.5rem",
              backgroundColor: "#ffe4e1",
              borderRadius: "0.25rem",
            }}
          >
            <div>❌ Ad Failed to Load</div>
            <div>Error: {adError || "Unknown"}</div>
            <div>Client: {client}</div>
            <div>Slot: {slot}</div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`google-ad-container ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={style}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive.toString()}
      />

      {/* Debug info - remove in production */}
      {process.env.NODE_ENV === "development" && (
        <div
          style={{
            fontSize: "0.75rem",
            color: "#666",
            marginTop: "0.5rem",
            padding: "0.5rem",
            backgroundColor: "#f5f5f5",
            borderRadius: "0.25rem",
          }}
        >
          <div>Ad Client: {client}</div>
          <div>Ad Slot: {slot}</div>
          <div>
            Status:{" "}
            {adLoaded
              ? "✅ Loaded"
              : adError
              ? `❌ ${adError}`
              : "⏳ Loading..."}
          </div>
          <div>
            Script Available:{" "}
            {typeof window !== "undefined" && window.adsbygoogle ? "✅" : "❌"}
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleAd;
