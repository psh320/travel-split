import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import SEOContent from "../components/SEOContent";
// import GoogleAd from "../components/GoogleAd";
// import { ADSENSE_CONFIG } from "../config/adsense";
import { GroupHistoryService } from "../services/groupHistory";
import type { GroupHistoryItem } from "../services/groupHistory";
import { timeAgo } from "../utils";

const HomePage = () => {
  const [groupHistory, setGroupHistory] = useState<GroupHistoryItem[]>([]);
  const [isNewUser, setIsNewUser] = useState(true);
  const [storageWarning, setStorageWarning] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const history = GroupHistoryService.getGroupHistory();
    setGroupHistory(history);
    setIsNewUser(!GroupHistoryService.hasGroupHistory());

    // Check storage status and show warning if needed
    const storageInfo = GroupHistoryService.getStorageInfo();
    setStorageWarning(storageInfo.warning);
  }, []);

  const handleGroupClick = (group: GroupHistoryItem) => {
    // Update last accessed time
    GroupHistoryService.updateLastAccessed(group.id);

    // Set current user context in localStorage
    localStorage.setItem("currentTripId", group.id);
    localStorage.setItem("currentUserId", group.userIdInGroup);
    localStorage.setItem("currentUserName", group.userNameInGroup);
    localStorage.setItem("roomCode", group.roomCode);

    // Navigate to group dashboard
    navigate(`/group/${group.id}`);
  };

  const handleRemoveGroup = (groupId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Remove this group from your history?")) {
      GroupHistoryService.removeGroupFromHistory(groupId);
      const updatedHistory = GroupHistoryService.getGroupHistory();
      setGroupHistory(updatedHistory);

      // If no groups left, show intro page
      if (updatedHistory.length === 0) {
        setIsNewUser(true);
      }
    }
  };

  const IntroContent = () => (
    <>
      <div className="header">
        <h1>Split Expenses Online Free</h1>
        <p>
          Split expenses online with friends - The easiest bill splitting
          calculator
        </p>
      </div>

      <div className="content">
        <div className="card">
          <h3>Free Online Expense Splitter</h3>
          <p style={{ marginBottom: "1.5rem", color: "#6b7280" }}>
            Split expenses online free with your group and see who owes whom.
            Our bill splitting calculator makes it easy to divide shared costs
            for travel, dining, and group activities. No registration required -
            just create a room and share the code with your friends!
          </p>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <Link to="/create-group" className="btn btn-primary btn-full">
              Create New Group
            </Link>

            <Link to="/join-group" className="btn btn-secondary btn-full">
              Join Existing Group
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

        <div className="card">
          <h3>Why Choose Our Bill Splitting Calculator?</h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1.5rem",
              marginTop: "1rem",
            }}
          >
            <div>
              <h4
                style={{
                  fontSize: "1rem",
                  fontWeight: "600",
                  marginBottom: "0.5rem",
                  color: "#374151",
                }}
              >
                💰 Split Expenses Online Free
              </h4>
              <p style={{ fontSize: "0.875rem", color: "#6b7280", margin: 0 }}>
                Completely free expense splitting tool. No hidden fees, no
                premium plans - just split costs online instantly.
              </p>
            </div>
            <div>
              <h4
                style={{
                  fontSize: "1rem",
                  fontWeight: "600",
                  marginBottom: "0.5rem",
                  color: "#374151",
                }}
              >
                📱 Works on Any Device
              </h4>
              <p style={{ fontSize: "0.875rem", color: "#6b7280", margin: 0 }}>
                Access your expense splitter from phone, tablet, or computer. No
                app download needed.
              </p>
            </div>
            <div>
              <h4
                style={{
                  fontSize: "1rem",
                  fontWeight: "600",
                  marginBottom: "0.5rem",
                  color: "#374151",
                }}
              >
                🚀 No Registration Required
              </h4>
              <p style={{ fontSize: "0.875rem", color: "#6b7280", margin: 0 }}>
                Start splitting expenses immediately. No sign-ups, no personal
                information needed.
              </p>
            </div>
            <div>
              <h4
                style={{
                  fontSize: "1rem",
                  fontWeight: "600",
                  marginBottom: "0.5rem",
                  color: "#374151",
                }}
              >
                🧮 Smart Calculations
              </h4>
              <p style={{ fontSize: "0.875rem", color: "#6b7280", margin: 0 }}>
                Our bill splitting calculator optimizes payments to minimize
                transactions between group members.
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <h3>Perfect for Every Occasion</h3>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
              marginTop: "1rem",
            }}
          >
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
            >
              <span style={{ fontSize: "1.25rem" }}>✈️</span>
              <span style={{ fontSize: "0.9rem" }}>
                <strong>Travel Expenses:</strong> Split hotel, flights, and
                activities with travel companions
              </span>
            </div>
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
            >
              <span style={{ fontSize: "1.25rem" }}>🍕</span>
              <span style={{ fontSize: "0.9rem" }}>
                <strong>Group Dining:</strong> Easily divide restaurant bills
                and food delivery costs
              </span>
            </div>
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
            >
              <span style={{ fontSize: "1.25rem" }}>🏠</span>
              <span style={{ fontSize: "0.9rem" }}>
                <strong>Roommate Expenses:</strong> Track shared household costs
                and utilities
              </span>
            </div>
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
            >
              <span style={{ fontSize: "1.25rem" }}>🎉</span>
              <span style={{ fontSize: "0.9rem" }}>
                <strong>Events & Parties:</strong> Split costs for celebrations,
                gifts, and entertainment
              </span>
            </div>
          </div>
        </div>

        <SEOContent />

        {/* Strategic Ad Placement - Disabled for now */}
        {/* <div style={{ marginTop: "2rem", marginBottom: "1rem" }}>
          <GoogleAd
            client={ADSENSE_CONFIG.publisherId}
            slot={ADSENSE_CONFIG.adSlots.banner}
            style={{
              display: "block",
              textAlign: "center",
              minHeight: "100px",
              backgroundColor: "#f9fafb",
              border: "1px solid #e5e7eb",
              borderRadius: "0.5rem",
              padding: "1rem",
            }}
            format="auto"
            responsive={true}
          />
        </div> */}
      </div>
    </>
  );

  const GroupListContent = () => (
    <>
      <div className="header">
        <h1>Welcome Back!</h1>
        <p>
          Your expense groups - Click on any group to continue where you left
          off
        </p>
      </div>

      <div className="content">
        {/* Storage Warning */}
        {storageWarning && (
          <div
            className="card"
            style={{
              backgroundColor: "#fef3c7",
              border: "1px solid #f59e0b",
              marginBottom: "1rem",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "0.75rem",
              }}
            >
              <span style={{ fontSize: "1.25rem", marginTop: "0.125rem" }}>
                ⚠️
              </span>
              <div>
                <h4
                  style={{
                    margin: 0,
                    marginBottom: "0.5rem",
                    color: "#92400e",
                    fontSize: "0.9rem",
                    fontWeight: "600",
                  }}
                >
                  Storage Notice
                </h4>
                <p
                  style={{
                    margin: 0,
                    fontSize: "0.875rem",
                    color: "#92400e",
                    lineHeight: "1.4",
                  }}
                >
                  {storageWarning}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="card">
          <h3>Quick Actions</h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <Link to="/create-group" className="btn btn-primary btn-full">
              Create New Group
            </Link>

            <Link to="/join-group" className="btn btn-secondary btn-full">
              Join Existing Group
            </Link>
          </div>
        </div>

        {/* Recent Groups */}
        <div className="card">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <h3 style={{ margin: 0 }}>Your Groups</h3>
            <span style={{ fontSize: "0.875rem", color: "#6b7280" }}>
              {groupHistory.length} group{groupHistory.length !== 1 ? "s" : ""}
            </span>
          </div>

          {groupHistory.length === 0 ? (
            <div
              style={{ textAlign: "center", padding: "2rem", color: "#6b7280" }}
            >
              <p>No groups found in your history.</p>
              <button
                onClick={() => setIsNewUser(true)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#667eea",
                  textDecoration: "underline",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                }}
              >
                Show introduction page
              </button>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              {groupHistory.map((group) => (
                <div
                  key={group.id}
                  onClick={() => handleGroupClick(group)}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "1rem",
                    border: "1px solid #e5e7eb",
                    borderRadius: "0.5rem",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    backgroundColor: "#fff",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#f9fafb";
                    e.currentTarget.style.borderColor = "#d1d5db";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#fff";
                    e.currentTarget.style.borderColor = "#e5e7eb";
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontWeight: "600",
                        marginBottom: "0.25rem",
                        fontSize: "1rem",
                      }}
                    >
                      {group.name}
                    </div>
                    <div
                      style={{
                        fontSize: "0.875rem",
                        color: "#6b7280",
                        marginBottom: "0.25rem",
                      }}
                    >
                      Room: {group.roomCode} • You joined as{" "}
                      {group.userNameInGroup}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#9ca3af" }}>
                      {group.role === "creator" ? "👑 Creator" : "👤 Member"} •
                      Last used {timeAgo(group.lastAccessed)}
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleRemoveGroup(group.id, e)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#dc2626",
                      cursor: "pointer",
                      padding: "0.5rem",
                      borderRadius: "0.25rem",
                      fontSize: "1.25rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "2rem",
                      height: "2rem",
                    }}
                    title="Remove from history"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#fee2e2";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Strategic Ad Placement - Disabled for now */}
        {/* <div style={{ marginTop: "2rem", marginBottom: "1rem" }}>
          <GoogleAd
            client={ADSENSE_CONFIG.publisherId}
            slot={ADSENSE_CONFIG.adSlots.banner}
            style={{
              display: "block",
              textAlign: "center",
              minHeight: "100px",
              backgroundColor: "#f9fafb",
              border: "1px solid #e5e7eb",
              borderRadius: "0.5rem",
              padding: "1rem",
            }}
            format="auto"
            responsive={true}
          />
        </div> */}
      </div>
    </>
  );

  return isNewUser ? <IntroContent /> : <GroupListContent />;
};

export default HomePage;
