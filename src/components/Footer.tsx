import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

type NavigatorWithStandalone = Navigator & {
  standalone?: boolean;
};

const Footer = () => {
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if app is running in PWA standalone mode
    const checkStandalone = () => {
      const isStandaloneMode =
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as NavigatorWithStandalone).standalone === true;
      setIsStandalone(isStandaloneMode);
    };

    checkStandalone();

    // Listen for changes in display mode
    const mediaQuery = window.matchMedia("(display-mode: standalone)");
    mediaQuery.addEventListener("change", checkStandalone);

    return () => {
      mediaQuery.removeEventListener("change", checkStandalone);
    };
  }, []);

  // Don't render footer in PWA standalone mode
  if (isStandalone) {
    return null;
  }

  return (
    <footer
      style={{
        borderTop: "1px solid var(--ease-color-border)",
        padding: "1.5rem 1rem",
        marginTop: "2rem",
        backgroundColor: "var(--ease-color-surface-raised)",
        fontSize: "0.875rem",
        color: "var(--ease-color-text-muted)",
      }}
    >
      <div
        style={{
          maxWidth: "400px",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "1.5rem",
            marginBottom: "1rem",
          }}
        >
          <Link
            to="/privacy"
            style={{
              color: "var(--ease-color-text-muted)",
              textDecoration: "none",
            }}
          >
            Privacy Policy
          </Link>
          <Link
            to="/terms"
            style={{
              color: "var(--ease-color-text-muted)",
              textDecoration: "none",
            }}
          >
            Terms of Service
          </Link>
          <a
            href="https://github.com/psh320/travel-split"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "var(--ease-color-text-muted)",
              textDecoration: "none",
            }}
          >
            GitHub
          </a>
        </div>
        <p style={{ margin: 0, fontSize: "0.75rem" }}>
          © 2025 Split Expense. Made for groups who share costs.
        </p>
        <p style={{ margin: "0.5rem 0 0 0", fontSize: "0.75rem" }}>
          Free expense splitting for any shared activity.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
