import { Link } from "react-router-dom";
import GoogleAd from "../components/GoogleAd";
import { ADSENSE_CONFIG } from "../config/adsense";

const HomePage = () => {
  return (
    <>
      <div className="header">
        <h1>Split Expense</h1>
        <p>Split any shared costs easily with friends</p>
      </div>

      <div className="content">
        {/* Desktop Hero Section */}
        <div className="hero-section" style={{ display: "block" }}>
          <div className="card card-featured">
            <h3
              style={{
                color: "white",
                fontSize: "1.5rem",
                marginBottom: "1rem",
              }}
            >
              Welcome to Split Expense
            </h3>
            <p
              style={{
                marginBottom: "2rem",
                color: "rgba(255,255,255,0.9)",
                fontSize: "1.1rem",
                lineHeight: "1.6",
              }}
            >
              Keep track of any shared expenses with your group and see who owes
              whom. No registration required - just create a room and share the
              code with your friends!
            </p>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <Link
                to="/create-trip"
                className="btn"
                style={{
                  background: "rgba(255,255,255,0.2)",
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.3)",
                  padding: "1rem 2rem",
                  borderRadius: "0.75rem",
                  textDecoration: "none",
                  textAlign: "center",
                  fontWeight: "600",
                  fontSize: "1.1rem",
                  transition: "all 0.3s ease",
                  backdropFilter: "blur(10px)",
                }}
              >
                🚀 Create New Group
              </Link>

              <Link
                to="/join-trip"
                className="btn"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.2)",
                  padding: "1rem 2rem",
                  borderRadius: "0.75rem",
                  textDecoration: "none",
                  textAlign: "center",
                  fontWeight: "600",
                  fontSize: "1.1rem",
                  transition: "all 0.3s ease",
                  backdropFilter: "blur(10px)",
                }}
              >
                👥 Join Existing Group
              </Link>
            </div>
          </div>
        </div>

        {/* Desktop Grid Layout for How it Works */}
        <div className="content-grid" style={{ display: "block" }}>
          <div className="card">
            <div style={{ display: "flex", alignItems: "start", gap: "1rem" }}>
              <div
                style={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  borderRadius: "50%",
                  width: "2.5rem",
                  height: "2.5rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1rem",
                  fontWeight: "600",
                  flexShrink: 0,
                }}
              >
                1
              </div>
              <div>
                <div
                  style={{
                    fontWeight: "600",
                    marginBottom: "0.5rem",
                    fontSize: "1.2rem",
                  }}
                >
                  Create or Join
                </div>
                <div
                  style={{
                    fontSize: "1rem",
                    color: "#6b7280",
                    lineHeight: "1.6",
                  }}
                >
                  Create a new expense group or join an existing one with a room
                  code. Share instantly with friends!
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div style={{ display: "flex", alignItems: "start", gap: "1rem" }}>
              <div
                style={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  borderRadius: "50%",
                  width: "2.5rem",
                  height: "2.5rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1rem",
                  fontWeight: "600",
                  flexShrink: 0,
                }}
              >
                2
              </div>
              <div>
                <div
                  style={{
                    fontWeight: "600",
                    marginBottom: "0.5rem",
                    fontSize: "1.2rem",
                  }}
                >
                  Record Expenses
                </div>
                <div
                  style={{
                    fontSize: "1rem",
                    color: "#6b7280",
                    lineHeight: "1.6",
                  }}
                >
                  Add expenses and select who paid and who should split the
                  cost. Perfect for any group activity!
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3>How it works</h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <div style={{ display: "flex", alignItems: "start", gap: "1rem" }}>
              <div
                style={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  borderRadius: "50%",
                  width: "2rem",
                  height: "2rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  flexShrink: 0,
                }}
              >
                1
              </div>
              <div>
                <div style={{ fontWeight: "600", marginBottom: "0.25rem" }}>
                  Create or Join
                </div>
                <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                  Create a new expense group or join an existing one with a room
                  code
                </div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "start", gap: "1rem" }}>
              <div
                style={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  borderRadius: "50%",
                  width: "2rem",
                  height: "2rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  flexShrink: 0,
                }}
              >
                2
              </div>
              <div>
                <div style={{ fontWeight: "600", marginBottom: "0.25rem" }}>
                  Record Expenses
                </div>
                <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                  Add expenses and select who paid and who should split the cost
                </div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "start", gap: "1rem" }}>
              <div
                style={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  borderRadius: "50%",
                  width: "2rem",
                  height: "2rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  flexShrink: 0,
                }}
              >
                3
              </div>
              <div>
                <div style={{ fontWeight: "600", marginBottom: "0.25rem" }}>
                  Settle Up
                </div>
                <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                  See who owes whom and settle debts with minimal transactions
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Strategic Ad Placement - Optimized for Desktop & Mobile */}
        <div
          className="card card-glass"
          style={{
            marginTop: "2rem",
            marginBottom: "1rem",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "0.875rem",
              color: "#6b7280",
              marginBottom: "1rem",
              fontWeight: "500",
            }}
          >
            💰 Support Split Expense
          </div>
          <GoogleAd
            client={ADSENSE_CONFIG.publisherId}
            slot={ADSENSE_CONFIG.adSlots.banner}
            style={{
              display: "block",
              minHeight: "120px",
              borderRadius: "0.75rem",
              overflow: "hidden",
            }}
            format="auto"
            responsive={true}
          />
        </div>
      </div>
    </>
  );
};

export default HomePage;
