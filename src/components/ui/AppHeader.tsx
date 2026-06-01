import { Link } from "react-router-dom";
import { t } from "../../i18n";

type AppHeaderProps = {
  title: string;
  subtitle?: string;
  backTo?: string;
  onBack?: () => void;
};

export function AppHeader({ backTo, onBack, subtitle, title }: AppHeaderProps) {
  return (
    <div className="header">
      {backTo ? (
        <Link to={backTo} className="back-button" aria-label={t("back")}>
          ←
        </Link>
      ) : null}
      {onBack ? (
        <button onClick={onBack} className="back-button" aria-label={t("back")}>
          ←
        </button>
      ) : null}
      <h1>{title}</h1>
      {subtitle ? <p>{subtitle}</p> : null}
    </div>
  );
}
