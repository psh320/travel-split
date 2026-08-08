import { Link } from "react-router-dom";

export const PageLoading = () => (
  <div className="loading" role="status" aria-live="polite">
    <div className="spinner" />
  </div>
);

interface PageErrorStateProps {
  message: string;
  actionLabel: string;
  actionTo: string;
}

export const PageErrorState = ({
  message,
  actionLabel,
  actionTo,
}: PageErrorStateProps) => (
  <div className="content">
    <div className="card">
      <h3>{message}</h3>
      <Link to={actionTo} className="btn btn-primary">
        {actionLabel}
      </Link>
    </div>
  </div>
);
