import React from "react";
import { t, type CopyKey } from "../i18n";

const faqItems: Array<[CopyKey, CopyKey]> = [
  ["faqQuestion1", "faqAnswer1"],
  ["faqQuestion2", "faqAnswer2"],
  ["faqQuestion3", "faqAnswer3"],
  ["faqQuestion4", "faqAnswer4"],
  ["faqQuestion5", "faqAnswer5"],
];

const SEOContent: React.FC = () => {
  return (
    <div className="card">
      <h3>{t("faqTitle")}</h3>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
          marginTop: "1rem",
        }}
      >
        {faqItems.map(([question, answer]) => (
          <div key={question}>
            <h4
              style={{
                fontSize: "1rem",
                fontWeight: "600",
                marginBottom: "0.5rem",
                color: "var(--ease-color-text)",
              }}
            >
              {t(question)}
            </h4>
            <p
              style={{
                fontSize: "0.875rem",
                color: "var(--ease-color-text-muted)",
                margin: 0,
                lineHeight: "1.5",
              }}
            >
              {t(answer)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SEOContent;
