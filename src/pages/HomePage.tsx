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
import {
  ChevronRightIcon,
  IconButton,
  IconLink,
  InfoIcon,
  PlusIcon,
  TrashIcon,
  UsersIcon,
} from "../components/ui/IconButton";

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

  const handleRemoveGroup = (
    group: GroupHistoryItem,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();
    const confirmation = t("removeGroupHistoryConfirm").replace(
      "{name}",
      group.name
    );
    if (window.confirm(confirmation)) {
      GroupHistoryService.removeGroupFromHistory(group.id);
      const updatedHistory = GroupHistoryService.getGroupHistory();
      setGroupHistory(updatedHistory);
      showToast(t("historyRemoved"), "success");

      // If no groups left, show intro page
      if (updatedHistory.length === 0) {
        setIsNewUser(true);
      }
    }
  };

  const HomeTopBar = ({ appMode = false }: { appMode?: boolean }) => (
    <div className={`home-app-bar${appMode ? " is-app-mode" : ""}`}>
      <Link to="/" className="home-app-brand" data-google-vignette="false">
        {t("appName")}
      </Link>
      {appMode ? (
        <IconLink
          to="/guides"
          className="home-help-link"
          label={isKorean ? "정산 가이드" : "Open guides"}
          data-google-vignette="false"
        >
          <InfoIcon />
        </IconLink>
      ) : (
        <nav className="home-nav" aria-label={isKorean ? "주요 메뉴" : "Main navigation"}>
          <Link to="/guides" data-google-vignette="false">
            {isKorean ? "가이드" : "Guides"}
          </Link>
          <Link to="/about" data-google-vignette="false">
            {isKorean ? "소개" : "About"}
          </Link>
        </nav>
      )}
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
      <HomeTopBar appMode />
      <AppHeader
        className="home-dashboard-header"
        title={t("homeDashboardTitle")}
        subtitle={t("homeDashboardSubtitle")}
      />

      <main className="content home-dashboard-content">
        {storageWarning && (
          <div className="callout callout-warning home-storage-warning">
            <strong>{t("notes")}</strong>
            <p>{storageWarning}</p>
          </div>
        )}

        <section className="home-groups-section" aria-labelledby="home-groups-heading">
          <div className="home-section-heading">
            <h2 id="home-groups-heading">{t("groups")}</h2>
            <span>
              {countLabel("group", groupHistory.length)}
            </span>
          </div>

          {groupHistory.length === 0 ? (
            <div className="home-groups-empty">
              <p>{t("noGroups")}</p>
              <button type="button" onClick={() => setIsNewUser(true)}>
                {t("startSplit")}
              </button>
            </div>
          ) : (
            <div className="home-group-list">
              {groupHistory.map((group) => (
                <article
                  key={group.id}
                  className="home-group-card"
                >
                  <button
                    type="button"
                    className="home-group-main"
                    aria-label={t("openGroup").replace("{name}", group.name)}
                    onClick={() => handleGroupClick(group)}
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
                      <strong>{group.name}</strong>
                      <div className="home-group-meta">
                        <span>{group.userNameInGroup}</span>
                        <span aria-hidden="true">·</span>
                        <span>
                          {group.role === "creator" ? t("creator") : t("member")}
                        </span>
                        <span aria-hidden="true">·</span>
                        <time dateTime={group.lastAccessed.toISOString()}>
                          {timeAgo(group.lastAccessed)}
                        </time>
                      </div>
                      <span className="home-room-code">
                        {t("room")} {group.roomCode}
                      </span>
                    </div>
                    <span className="home-group-chevron">
                      <ChevronRightIcon />
                    </span>
                  </button>
                  <IconButton
                    className="home-group-remove"
                    label={`${group.name} · ${t("removeHistory")}`}
                    onClick={(event) => handleRemoveGroup(group, event)}
                  >
                    <TrashIcon />
                  </IconButton>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="home-quick-actions" aria-labelledby="quick-actions-heading">
          <div className="home-section-heading">
            <h2 id="quick-actions-heading">{t("quickActions")}</h2>
          </div>
          <div className="home-action-grid">
            <Link to="/create-group" className="home-action-card">
              <span className="home-action-icon">
                <PlusIcon />
              </span>
              <span className="home-action-copy">
                <strong>{t("createGroup")}</strong>
                <span>{t("createGroupHint")}</span>
              </span>
              <ChevronRightIcon />
            </Link>
            <Link to="/join-group" className="home-action-card">
              <span className="home-action-icon">
                <UsersIcon />
              </span>
              <span className="home-action-copy">
                <strong>{t("joinGroup")}</strong>
                <span>{t("joinGroupHint")}</span>
              </span>
              <ChevronRightIcon />
            </Link>
          </div>
        </section>
      </main>
    </>
  );

  return isNewUser ? <IntroContent /> : <GroupListContent />;
};

export default HomePage;
