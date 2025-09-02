import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer
      style={{
        borderTop: "1px solid #e5e7eb",
        padding: "1.5rem 1rem",
        marginTop: "2rem",
        backgroundColor: "#f9fafb",
        fontSize: "0.875rem",
        color: "#6b7280",
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
              color: "#6b7280",
              textDecoration: "none",
            }}
          >
            Privacy Policy
          </Link>
          <Link
            to="/terms"
            style={{
              color: "#6b7280",
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
              color: "#6b7280",
              textDecoration: "none",
            }}
          >
            GitHub
          </a>
        </div>
        <p style={{ margin: 0, fontSize: "0.75rem" }}>
          © 2024 Split Expense. Made with ❤️ for groups who share costs.
        </p>
        <p style={{ margin: "0.5rem 0 0 0", fontSize: "0.75rem" }}>
          Free expense splitting for any shared activity.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
