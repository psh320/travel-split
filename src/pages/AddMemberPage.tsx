import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppHeader } from "../components/ui/AppHeader";
import { AvatarCustomizer } from "../components/AvatarCustomizer";
import { useToast } from "../components/ui/useToast";
import { t } from "../i18n";
import { FirebaseService } from "../services/firebase";
import type { AvatarConfig, Trip } from "../types";
import { DEFAULT_AVATAR_CONFIG } from "../utils/avatars";

const AddMemberPage = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [trip, setTrip] = useState<Trip | null>(
    groupId ? FirebaseService.getCachedTripById(groupId) : null
  );
  const [loading, setLoading] = useState(!trip);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [avatarConfig, setAvatarConfig] = useState<AvatarConfig>({
    ...DEFAULT_AVATAR_CONFIG,
  });

  useEffect(() => {
    if (!groupId) {
      navigate("/");
      return;
    }

    let cancelled = false;
    const loadTrip = async () => {
      try {
        const tripData = await FirebaseService.getTripById(groupId, {
          force: Boolean(FirebaseService.getCachedTripById(groupId)),
        });
        if (cancelled) return;

        const currentUserId = localStorage.getItem("currentUserId");
        if (!tripData || tripData.createdBy !== currentUserId) {
          showToast(t("noMatches"), "error");
          navigate(`/group/${groupId}`, { replace: true });
          return;
        }

        setTrip(tripData);
      } catch (loadError) {
        console.error("Error loading trip for member creation:", loadError);
        showToast(t("noMatches"), "error");
        navigate(`/group/${groupId}`, { replace: true });
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void loadTrip();
    return () => {
      cancelled = true;
    };
  }, [groupId, navigate, showToast]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedName = name.trim();
    if (!trip || !trimmedName) {
      setError(t("memberName"));
      return;
    }

    const duplicate = trip.participants.some(
      (participant) => participant.name.toLowerCase() === trimmedName.toLowerCase()
    );
    if (duplicate) {
      setError(t("nameTaken"));
      return;
    }

    setSaving(true);
    setError("");
    try {
      await FirebaseService.addUserToTrip(trip.id, trimmedName, avatarConfig);
      showToast(t("memberAdded").replace("{name}", trimmedName), "success");
      navigate(`/group/${trip.id}`, { replace: true });
    } catch (saveError) {
      console.error("Error adding member:", saveError);
      setError(t("error"));
    } finally {
      setSaving(false);
    }
  };

  if (loading || !trip) {
    return (
      <div className="loading">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <>
      <AppHeader
        backTo={`/group/${trip.id}`}
        title={t("newMember")}
        className="add-member-header"
      />
      <main className="add-member-page">
        <form className="add-member-form" onSubmit={handleSubmit}>
          <div className="add-member-name-field">
            <label htmlFor="memberName">{t("memberName")}</label>
            <input
              id="memberName"
              type="text"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                if (error) setError("");
              }}
              placeholder={t("memberName")}
              autoComplete="off"
              autoFocus
              required
            />
            {error && <span role="alert">{error}</span>}
          </div>

          <AvatarCustomizer
            value={avatarConfig}
            onChange={setAvatarConfig}
            label={t("chooseAvatar")}
            editor
          />

          <div className="add-member-submit-bar">
            <button type="submit" className="btn btn-primary btn-full" disabled={saving}>
              {saving ? <div className="spinner spinner-small" /> : t("addUser")}
            </button>
          </div>
        </form>
      </main>
    </>
  );
};

export default AddMemberPage;
