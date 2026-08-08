import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import { t } from "../../i18n";
import { BackIcon } from "./IconButton";

type AppHeaderProps = {
  title: string;
  subtitle?: string;
  backTo?: string;
  onBack?: () => void;
  actions?: ReactNode;
  titleAccessory?: ReactNode;
  className?: string;
};

export function AppHeader({
  actions,
  backTo,
  className = "",
  onBack,
  subtitle,
  title,
  titleAccessory,
}: AppHeaderProps) {
  const isDetailHeader = Boolean(backTo || onBack);
  const backControl = backTo ? (
    <Link
      to={backTo}
      className="back-button"
      aria-label={t("back")}
      data-google-vignette="false"
    >
      <BackIcon />
    </Link>
  ) : onBack ? (
    <button onClick={onBack} className="back-button" aria-label={t("back")}>
      <BackIcon />
    </button>
  ) : null;

  return (
    <header
      className={`header${isDetailHeader ? " detail-header" : ""} ${className}`.trim()}
    >
      <div className="header-title-row">
        {backControl}
        <div className="header-copy">
          <div className="header-title-group">
            <h1>{title}</h1>
            {titleAccessory}
          </div>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
        {actions ? <div className="header-actions">{actions}</div> : null}
      </div>
    </header>
  );
}
