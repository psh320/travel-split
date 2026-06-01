import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppHeader } from "../components/ui/AppHeader";
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
      <AppHeader
        title="Split Expenses"
        subtitle="Create a room. Add costs. Settle up."
      />

      <div className="content">
        <div className="card">
          <h3>Start a split</h3>
          <p className="muted" style={{ marginBottom: "1.5rem" }}>
            No account. Just a room code.
          </p>

          <div className="button-stack">
            <Link to="/create-group" className="btn btn-primary btn-full">
              Create Group
            </Link>

            <Link to="/join-group" className="btn btn-secondary btn-full">
              Join Group
            </Link>
          </div>
        </div>

        <div className="card">
          <h3>Flow</h3>
          <div className="number-list">
            <div className="number-list-item">
              <div className="number-badge">1</div>
              <div>
                <div className="feature-title">Create or join</div>
                <div className="feature-copy">Use a room code.</div>
              </div>
            </div>

            <div className="number-list-item">
              <div className="number-badge">2</div>
              <div>
                <div className="feature-title">Add expenses</div>
                <div className="feature-copy">Pick payer and split.</div>
              </div>
            </div>

            <div className="number-list-item">
              <div className="number-badge">3</div>
              <div>
                <div className="feature-title">Settle up</div>
                <div className="feature-copy">See who owes whom.</div>
              </div>
            </div>
          </div>
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
              backgroundColor: "var(--ease-color-surface-raised)",
              border: "1px solid var(--ease-color-border)",
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
      <AppHeader
        title="Welcome Back"
        subtitle="Pick a group."
      />

      <div className="content">
        {/* Storage Warning */}
        {storageWarning && (
          <div
            className="callout callout-warning"
            style={{ marginBottom: "1rem" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "0.75rem",
              }}
            >
              <div>
                <h4
                  style={{
                    margin: 0,
                    marginBottom: "0.5rem",
                    color: "var(--ease-color-warning)",
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
                    color: "var(--ease-color-warning)",
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
          <h3>Actions</h3>
          <div className="button-stack">
            <Link to="/create-group" className="btn btn-primary btn-full">
              Create Group
            </Link>

            <Link to="/join-group" className="btn btn-secondary btn-full">
              Join Group
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
            <span style={{ fontSize: "0.875rem", color: "var(--ease-color-text-muted)" }}>
              {groupHistory.length} group{groupHistory.length !== 1 ? "s" : ""}
            </span>
          </div>

          {groupHistory.length === 0 ? (
            <div
              className="muted"
              style={{ textAlign: "center", padding: "2rem" }}
            >
              <p>No groups found in your history.</p>
              <button
                onClick={() => setIsNewUser(true)}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--ease-color-brand)",
                  textDecoration: "underline",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                }}
              >
                Show introduction page
              </button>
            </div>
          ) : (
            <div className="list">
              {groupHistory.map((group) => (
                <div
                  key={group.id}
                  className="list-item"
                  onClick={() => handleGroupClick(group)}
                  style={{
                    cursor: "pointer",
                    transition: "background 0.2s, border-color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      "var(--ease-color-brand-soft)";
                    e.currentTarget.style.borderColor =
                      "var(--ease-color-border-strong)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor =
                      "var(--ease-color-surface-raised)";
                    e.currentTarget.style.borderColor =
                      "var(--ease-color-border)";
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
                        color: "var(--ease-color-text-muted)",
                        marginBottom: "0.25rem",
                      }}
                    >
                      Room: {group.roomCode} • You joined as{" "}
                      {group.userNameInGroup}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--ease-color-text-soft)" }}>
                      {group.role === "creator" ? "Creator" : "Member"} • Last
                      used {timeAgo(group.lastAccessed)}
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleRemoveGroup(group.id, e)}
                    className="list-item-action"
                    style={{
                      color: "var(--ease-color-danger)",
                      fontSize: "1.25rem",
                      width: "2rem",
                      height: "2rem",
                    }}
                    title="Remove from history"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "var(--ease-color-danger-soft)";
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
              backgroundColor: "var(--ease-color-surface-raised)",
              border: "1px solid var(--ease-color-border)",
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
