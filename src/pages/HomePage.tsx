import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <>
      <div className="header">
        <h1>Travel Split</h1>
        <p>Split expenses easily with friends</p>
      </div>

      <div className="content">
        <div className="card">
          <h3>Welcome to Travel Split</h3>
          <p style={{ marginBottom: "1.5rem", color: "#6b7280" }}>
            Keep track of shared expenses during your travels and see who owes
            whom. No registration required - just create a room and share the
            code with your friends!
          </p>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <Link to="/create-trip" className="btn btn-primary btn-full">
              Create New Trip
            </Link>

            <Link to="/join-trip" className="btn btn-secondary btn-full">
              Join Existing Trip
            </Link>
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
                  Create a new trip or join an existing one with a room code
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
      </div>
    </>
  );
};

export default HomePage;
