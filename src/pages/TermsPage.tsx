import { Link } from "react-router-dom";

const TermsPage = () => {
  return (
    <>
      <div className="header">
        <Link to="/" className="back-button">
          ←
        </Link>
        <h1>Terms of Service</h1>
        <p>Terms and conditions</p>
      </div>

      <div className="content">
        <div className="card">
          <h3>Terms of Service for Split Expense</h3>
          <p
            style={{
              fontSize: "0.875rem",
              color: "#6b7280",
              marginBottom: "1rem",
            }}
          >
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <div
            style={{
              fontSize: "0.875rem",
              lineHeight: "1.6",
              color: "#374151",
            }}
          >
            <h4
              style={{
                marginTop: "1.5rem",
                marginBottom: "0.5rem",
                color: "#1f2937",
              }}
            >
              Acceptance of Terms
            </h4>
            <p>
              By accessing and using Split Expense, you accept and agree to be
              bound by the terms and provision of this agreement.
            </p>

            <h4
              style={{
                marginTop: "1.5rem",
                marginBottom: "0.5rem",
                color: "#1f2937",
              }}
            >
              Service Description
            </h4>
            <p>Split Expense is a free web application that helps users:</p>
            <ul style={{ marginLeft: "1rem", marginBottom: "1rem" }}>
              <li>Create expense splitting groups with unique room codes</li>
              <li>Track shared expenses for any group activity</li>
              <li>Calculate who owes whom and how much</li>
              <li>Settle debts with optimized payment suggestions</li>
            </ul>

            <h4
              style={{
                marginTop: "1.5rem",
                marginBottom: "0.5rem",
                color: "#1f2937",
              }}
            >
              User Responsibilities
            </h4>
            <p>Users agree to:</p>
            <ul style={{ marginLeft: "1rem", marginBottom: "1rem" }}>
              <li>Provide accurate expense information</li>
              <li>Use the service for legitimate expense splitting only</li>
              <li>Respect other users' privacy and data</li>
              <li>Not misuse or attempt to hack the service</li>
            </ul>

            <h4
              style={{
                marginTop: "1.5rem",
                marginBottom: "0.5rem",
                color: "#1f2937",
              }}
            >
              Data and Privacy
            </h4>
            <p>
              Please review our{" "}
              <Link to="/privacy" style={{ color: "#667eea" }}>
                Privacy Policy
              </Link>{" "}
              to understand how we collect, use, and protect your information.
            </p>

            <h4
              style={{
                marginTop: "1.5rem",
                marginBottom: "0.5rem",
                color: "#1f2937",
              }}
            >
              Limitation of Liability
            </h4>
            <p>
              Split Expense is provided "as is" without warranties. We are not
              liable for:
            </p>
            <ul style={{ marginLeft: "1rem", marginBottom: "1rem" }}>
              <li>Accuracy of expense calculations</li>
              <li>Data loss or service interruptions</li>
              <li>Disputes between users regarding expenses</li>
              <li>Financial decisions made based on our calculations</li>
            </ul>

            <h4
              style={{
                marginTop: "1.5rem",
                marginBottom: "0.5rem",
                color: "#1f2937",
              }}
            >
              Service Availability
            </h4>
            <p>While we strive for high availability:</p>
            <ul style={{ marginLeft: "1rem", marginBottom: "1rem" }}>
              <li>Service may be temporarily unavailable for maintenance</li>
              <li>We reserve the right to modify or discontinue features</li>
              <li>No guarantee of permanent data storage</li>
            </ul>

            <h4
              style={{
                marginTop: "1.5rem",
                marginBottom: "0.5rem",
                color: "#1f2937",
              }}
            >
              Advertising
            </h4>
            <p>Our service is supported by advertising:</p>
            <ul style={{ marginLeft: "1rem", marginBottom: "1rem" }}>
              <li>Google AdSense may display personalized ads</li>
              <li>Ads help us provide the service for free</li>
              <li>
                We do not control the content of third-party advertisements
              </li>
            </ul>

            <h4
              style={{
                marginTop: "1.5rem",
                marginBottom: "0.5rem",
                color: "#1f2937",
              }}
            >
              Termination
            </h4>
            <p>
              We may terminate or suspend access to our service immediately,
              without prior notice, for conduct that we believe violates these
              Terms of Service.
            </p>

            <h4
              style={{
                marginTop: "1.5rem",
                marginBottom: "0.5rem",
                color: "#1f2937",
              }}
            >
              Changes to Terms
            </h4>
            <p>
              We reserve the right to update these terms at any time. Changes
              will be effective immediately upon posting to this page.
            </p>

            <h4
              style={{
                marginTop: "1.5rem",
                marginBottom: "0.5rem",
                color: "#1f2937",
              }}
            >
              Contact Information
            </h4>
            <p>
              For questions about these Terms of Service, please create an issue
              on our{" "}
              <a
                href="https://github.com/psh320/travel-split"
                style={{ color: "#667eea" }}
              >
                GitHub repository
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default TermsPage;
