import { t } from "../../i18n";
import { AvatarCustomizer } from "../AvatarCustomizer";
import { CloseIcon, IconButton } from "../ui/IconButton";
import type { AvatarDialogState } from "./dashboardDialogTypes";

export const AvatarEditorDialog = ({
  avatar,
}: {
  avatar: AvatarDialogState;
}) => (
  <section
    className="avatar-editor-shell"
    role="dialog"
    aria-modal="true"
    aria-labelledby="avatar-editor-title"
  >
    <header className="avatar-editor-header">
      <IconButton
        onClick={avatar.onClose}
        label={t("close")}
        disabled={avatar.saving}
      >
        <CloseIcon />
      </IconButton>
      <h2 id="avatar-editor-title">{t("changeAvatar")}</h2>
      <button
        type="button"
        className="avatar-editor-save"
        onClick={avatar.onSave}
        disabled={avatar.saving}
      >
        {avatar.saving ? <div className="spinner spinner-small" /> : t("done")}
      </button>
    </header>
    <AvatarCustomizer
      value={avatar.draft}
      onChange={avatar.onChange}
      label={t("changeAvatar")}
      editor
    />
  </section>
);
