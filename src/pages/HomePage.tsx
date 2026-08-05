import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppHeader } from "../components/ui/AppHeader";
import { IconButton } from "../components/ui/IconButton";
import { countLabel, t } from "../i18n";
import { GroupHistoryService } from "../services/groupHistory";
import type { GroupHistoryItem } from "../services/groupHistory";
import { timeAgo } from "../utils";

const HomePage = () => {
  const [groupHistory, setGroupHistory] = useState<GroupHistoryItem[]>([]);
  const [isNewUser, setIsNewUser] = useState(true);
  const [storageWarning, setStorageWarning] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
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
    if (window.confirm(t("remove"))) {
      GroupHistoryService.removeGroupFromHistory(groupId);
      const updatedHistory = GroupHistoryService.getGroupHistory();
      setGroupHistory(updatedHistory);

      // If no groups left, show intro page
      if (updatedHistory.length === 0) {
        setIsNewUser(true);
      }
    }
  };

  const HomeTopBar = () => (
    <div className="home-app-bar">
      <Link
        to="/"
        className="home-app-brand"
        onClick={() => setSettingsOpen(false)}
        data-google-vignette="false"
      >
        {t("appName")}
      </Link>
      <div className="home-settings">
        <IconButton
          aria-expanded={settingsOpen}
          aria-haspopup="menu"
          label={t("settings")}
          onClick={() => setSettingsOpen((open) => !open)}
        >
          ⚙
        </IconButton>
        {settingsOpen && (
          <div className="settings-menu" role="menu">
            <Link
              to="/privacy"
              role="menuitem"
              onClick={() => setSettingsOpen(false)}
              data-google-vignette="false"
            >
              {t("privacy")}
            </Link>
            <Link
              to="/terms"
              role="menuitem"
              onClick={() => setSettingsOpen(false)}
              data-google-vignette="false"
            >
              {t("terms")}
            </Link>
          </div>
        )}
      </div>
    </div>
  );

  const IntroContent = () => (
    <>
      <HomeTopBar />
      <AppHeader
        title={t("splitExpenses")}
        subtitle={t("splitSubtitle")}
      />

      <div className="content">
        <div className="card">
          <h3>{t("startSplit")}</h3>
          <p className="muted" style={{ marginBottom: "1.5rem" }}>
            {t("noAccount")}
          </p>

          <div className="button-stack">
            <Link to="/create-group" className="btn btn-primary btn-full">
              {t("createGroup")}
            </Link>

            <Link to="/join-group" className="btn btn-secondary btn-full">
              {t("joinGroup")}
            </Link>
          </div>
        </div>

        <div className="card">
          <h3>{t("flow")}</h3>
          <div className="number-list">
            <div className="number-list-item">
              <div className="number-badge">1</div>
              <div>
                <div className="feature-title">{t("createJoin")}</div>
                <div className="feature-copy">{t("useRoomCode")}</div>
              </div>
            </div>

            <div className="number-list-item">
              <div className="number-badge">2</div>
              <div>
                <div className="feature-title">{t("addExpense")}</div>
                <div className="feature-copy">
                  {t("paidBy").replace(" *", "")} / {t("splitWith").replace(" *", "")}
                </div>
              </div>
            </div>

            <div className="number-list-item">
              <div className="number-badge">3</div>
              <div>
                <div className="feature-title">{t("settleUp")}</div>
                <div className="feature-copy">{t("balanceSubtitle")}</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  );

  const GroupListContent = () => (
    <>
      <HomeTopBar />
      <AppHeader
        title={t("welcomeBack")}
        subtitle={t("pickAGroup")}
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
                  {t("notes")}
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
          <h3>{t("actions")}</h3>
          <div className="button-stack">
            <Link to="/create-group" className="btn btn-primary btn-full">
              {t("createGroup")}
            </Link>

            <Link to="/join-group" className="btn btn-secondary btn-full">
              {t("joinGroup")}
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
            <h3 style={{ margin: 0 }}>{t("groups")}</h3>
            <span style={{ fontSize: "0.875rem", color: "var(--ease-color-text-muted)" }}>
              {countLabel("group", groupHistory.length)}
            </span>
          </div>

          {groupHistory.length === 0 ? (
            <div
              className="muted"
              style={{ textAlign: "center", padding: "2rem" }}
            >
              <p>{t("noGroups")}</p>
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
                {t("startSplit")}
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
                      {t("room")}: {group.roomCode} • {t("joinedAs")}{" "}
                      {group.userNameInGroup}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--ease-color-text-soft)" }}>
                      {group.role === "creator" ? t("creator") : t("member")} •{" "}
                      {timeAgo(group.lastAccessed)}
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleRemoveGroup(group.id, e)}
                    className="list-item-action icon-action"
                    style={{
                      color: "var(--ease-color-danger)",
                    }}
                    title={t("removeHistory")}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </>
  );

  return isNewUser ? <IntroContent /> : <GroupListContent />;
};

export default HomePage;
