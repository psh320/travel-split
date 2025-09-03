import React from "react";

interface AdFallbackProps {
  message?: string;
  showSupportMessage?: boolean;
  height?: string;
}

const AdFallback: React.FC<AdFallbackProps> = ({
  message = "Ads help keep this service free",
  showSupportMessage = true,
  height = "100px",
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: height,
        backgroundColor: "#f9fafb",
        border: "1px solid #e5e7eb",
        borderRadius: "0.5rem",
        padding: "1rem",
        color: "#6b7280",
        fontSize: "0.875rem",
        textAlign: "center",
      }}
    >
      <div style={{ marginBottom: "0.5rem" }}>
        <span role="img" aria-label="Information">
          ℹ️
        </span>
      </div>
      <div style={{ fontWeight: "500", marginBottom: "0.25rem" }}>
        {message}
      </div>
      {showSupportMessage && (
        <div style={{ fontSize: "0.75rem", opacity: 0.8 }}>
          Consider disabling your ad blocker to support this free service
        </div>
      )}
    </div>
  );
};

export default AdFallback;
