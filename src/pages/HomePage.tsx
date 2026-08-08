import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppHeader } from "../components/ui/AppHeader";
import SEOContent from "../components/SEOContent";
import SiteFooter from "../components/SiteFooter";
import { countLabel, isKorean, t } from "../i18n";
import { GroupHistoryService } from "../services/groupHistory";
import type { GroupHistoryItem } from "../services/groupHistory";
import { timeAgo } from "../utils";
import { Avatar } from "../components/Avatar";
import { AVATARS } from "../utils/avatars";
import { useToast } from "../components/ui/useToast";
import { currentTripSession } from "../services/currentTripSession";

const showcaseUsers = AVATARS.map((avatar, index) => ({
  id: `showcase-${avatar.id}`,
  name: ["Momo", "Bori", "Duri", "Navi", "Toto"][index],
  avatarId: avatar.id,
}));

const HomePage = () => {
  const [groupHistory, setGroupHistory] = useState<GroupHistoryItem[]>([]);
  const [isNewUser, setIsNewUser] = useState(true);
  const [storageWarning, setStorageWarning] = useState<string | null>(null);
  const navigate = useNavigate();
  const { showToast } = useToast();

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

    currentTripSession.set({
      tripId: group.id,
      userId: group.userIdInGroup,
      userName: group.userNameInGroup,
      roomCode: group.roomCode,
    });

    // Navigate to group dashboard
    void navigate(`/group/${group.id}`);
  };

  const handleRemoveGroup = (groupId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(t("remove"))) {
      GroupHistoryService.removeGroupFromHistory(groupId);
      const updatedHistory = GroupHistoryService.getGroupHistory();
      setGroupHistory(updatedHistory);
      showToast(t("historyRemoved"), "success");

      // If no groups left, show intro page
      if (updatedHistory.length === 0) {
        setIsNewUser(true);
      }
    }
  };

  const HomeTopBar = () => (
    <div className="home-app-bar">
      <Link to="/" className="home-app-brand" data-google-vignette="false">
        {t("appName")}
      </Link>
      <nav className="home-nav" aria-label={isKorean ? "주요 메뉴" : "Main navigation"}>
        <Link to="/guides" data-google-vignette="false">
          {isKorean ? "가이드" : "Guides"}
        </Link>
        <Link to="/about" data-google-vignette="false">
          {isKorean ? "소개" : "About"}
        </Link>
      </nav>
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
        <div className="card home-intro-card">
          <div className="home-avatar-showcase" aria-hidden="true">
            {showcaseUsers.map((user, index) => (
              <Avatar
                key={user.id}
                user={user}
                size={index === 2 ? "xl" : "lg"}
                decorative
                eager
                presetArt
              />
            ))}
          </div>
          <span className="home-intro-eyebrow">{t("meetCrew")}</span>
          <h3>{t("startSplit")}</h3>
          <p className="home-intro-copy">{t("avatarIntro")}</p>
          <p className="muted home-intro-account">{t("noAccount")}</p>

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
        <SEOContent />
      </div>
      <SiteFooter />
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
                  className="list-item home-group-item"
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
                  <Avatar
                    user={{
                      id: group.userIdInGroup,
                      name: group.userNameInGroup,
                      avatarId: group.avatarId,
                      avatarConfig: group.avatarConfig,
                    }}
                    size="md"
                    decorative
                  />
                  <div className="home-group-copy">
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
        <SEOContent />
      </div>
      <SiteFooter />
    </>
  );

  return isNewUser ? <IntroContent /> : <GroupListContent />;
};

export default HomePage;
