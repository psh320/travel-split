import { AppHeader } from "../components/ui/AppHeader";

const PrivacyPage = () => {
  return (
    <>
      <AppHeader
        backTo="/"
        title="Privacy Policy"
        subtitle="How we protect your information"
      />

      <div className="content">
        <div className="card">
          <h3>Privacy Policy for Split Expense</h3>
          <p
            style={{
              fontSize: "0.875rem",
              color: "var(--ease-color-text-muted)",
              marginBottom: "1rem",
            }}
          >
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <div
            style={{
              fontSize: "0.875rem",
              lineHeight: "1.6",
              color: "var(--ease-color-text)",
            }}
          >
            <h4
              style={{
                marginTop: "1.5rem",
                marginBottom: "0.5rem",
                color: "var(--ease-color-text)",
              }}
            >
              Information We Collect
            </h4>
            <p>
              Split Expense collects minimal information to provide our expense
              splitting service:
            </p>
            <ul style={{ marginLeft: "1rem", marginBottom: "1rem" }}>
              <li>Group names and descriptions you create</li>
              <li>User names you enter (no email or personal info required)</li>
              <li>Expense data you add to groups</li>
              <li>Usage data through Google Analytics and AdSense</li>
            </ul>

            <h4
              style={{
                marginTop: "1.5rem",
                marginBottom: "0.5rem",
                color: "var(--ease-color-text)",
              }}
            >
              How We Use Information
            </h4>
            <p>We use the information to:</p>
            <ul style={{ marginLeft: "1rem", marginBottom: "1rem" }}>
              <li>Provide the expense splitting service</li>
              <li>Store your group data securely in Firebase</li>
              <li>Display relevant advertisements through Google AdSense</li>
              <li>Improve our service through analytics</li>
            </ul>

            <h4
              style={{
                marginTop: "1.5rem",
                marginBottom: "0.5rem",
                color: "var(--ease-color-text)",
              }}
            >
              Data Storage
            </h4>
            <p>Your data is stored securely using:</p>
            <ul style={{ marginLeft: "1rem", marginBottom: "1rem" }}>
              <li>Google Firebase Firestore with security rules</li>
              <li>Browser local storage for session management</li>
              <li>No personal information is permanently stored</li>
            </ul>

            <h4
              style={{
                marginTop: "1.5rem",
                marginBottom: "0.5rem",
                color: "var(--ease-color-text)",
              }}
            >
              Third-Party Services
            </h4>
            <p>We use these third-party services:</p>
            <ul style={{ marginLeft: "1rem", marginBottom: "1rem" }}>
              <li>
                <strong>Google Firebase:</strong> Data storage and hosting
              </li>
              <li>
                <strong>Google AdSense:</strong> Advertisement display
              </li>
              <li>
                <strong>Google Analytics:</strong> Usage analytics (if
                implemented)
              </li>
            </ul>

            <h4
              style={{
                marginTop: "1.5rem",
                marginBottom: "0.5rem",
                color: "var(--ease-color-text)",
              }}
            >
              Cookies and Tracking
            </h4>
            <p>We may use cookies for:</p>
            <ul style={{ marginLeft: "1rem", marginBottom: "1rem" }}>
              <li>Session management and user experience</li>
              <li>Google AdSense advertisement personalization</li>
              <li>Analytics to improve our service</li>
            </ul>

            <h4
              style={{
                marginTop: "1.5rem",
                marginBottom: "0.5rem",
                color: "var(--ease-color-text)",
              }}
            >
              Data Deletion
            </h4>
            <p>You can delete your data by:</p>
            <ul style={{ marginLeft: "1rem", marginBottom: "1rem" }}>
              <li>Deleting individual expenses from groups</li>
              <li>Clearing your browser's local storage</li>
              <li>Contacting us to remove group data</li>
            </ul>

            <h4
              style={{
                marginTop: "1.5rem",
                marginBottom: "0.5rem",
                color: "var(--ease-color-text)",
              }}
            >
              Contact Us
            </h4>
            <p>
              If you have questions about this Privacy Policy, please create an
              issue on our{" "}
              <a
                href="https://github.com/psh320/travel-split"
                style={{ color: "var(--ease-color-brand)" }}
              >
                GitHub repository
              </a>
              .
            </p>

            <h4
              style={{
                marginTop: "1.5rem",
                marginBottom: "0.5rem",
                color: "var(--ease-color-text)",
              }}
            >
              Changes to Privacy Policy
            </h4>
            <p>
              We may update this privacy policy from time to time. We will
              notify users of any changes by updating the "Last updated" date.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPage;
