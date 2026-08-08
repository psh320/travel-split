import { Link, useLocation } from "react-router-dom";
import { t } from "../../i18n";

export type PageSkeletonVariant =
  | "balance"
  | "dashboard"
  | "form"
  | "generic"
  | "list";

const SkeletonLine = ({ className = "" }: { className?: string }) => (
  <span className={`skeleton-shape skeleton-line ${className}`.trim()} />
);

const SkeletonRows = ({ count = 3 }: { count?: number }) => (
  <div className="skeleton-rows">
    {Array.from({ length: count }, (_, index) => (
      <div className="skeleton-row" key={index}>
        <span className="skeleton-shape skeleton-avatar" />
        <span className="skeleton-row-copy">
          <SkeletonLine className="is-medium" />
          <SkeletonLine className="is-short" />
        </span>
        <SkeletonLine className="is-amount" />
      </div>
    ))}
  </div>
);

const SkeletonContent = ({ variant }: { variant: PageSkeletonVariant }) => {
  if (variant === "form") {
    return (
      <div className="skeleton-section skeleton-form">
        {Array.from({ length: 4 }, (_, index) => (
          <div className="skeleton-field" key={index}>
            <SkeletonLine className="is-label" />
            <span className="skeleton-shape skeleton-input" />
          </div>
        ))}
        <span className="skeleton-shape skeleton-button" />
      </div>
    );
  }

  if (variant === "dashboard") {
    return (
      <>
        <div className="skeleton-actions">
          {Array.from({ length: 3 }, (_, index) => (
            <span className="skeleton-shape skeleton-action" key={index} />
          ))}
        </div>
        <div className="skeleton-section skeleton-summary">
          <span className="skeleton-shape skeleton-chart" />
          <div className="skeleton-summary-copy">
            <SkeletonLine className="is-short" />
            <SkeletonLine className="is-wide" />
            <SkeletonLine className="is-medium" />
          </div>
        </div>
        <div className="skeleton-section">
          <SkeletonLine className="is-section-title" />
          <SkeletonRows count={3} />
        </div>
      </>
    );
  }

  if (variant === "balance") {
    return (
      <>
        <div className="skeleton-section skeleton-balance-hero">
          <div className="skeleton-profile">
            <span className="skeleton-shape skeleton-avatar is-large" />
            <span className="skeleton-profile-copy">
              <SkeletonLine className="is-short" />
              <SkeletonLine className="is-medium" />
            </span>
          </div>
          <SkeletonLine className="is-balance" />
          <div className="skeleton-metrics">
            {Array.from({ length: 3 }, (_, index) => (
              <span key={index}>
                <SkeletonLine className="is-label" />
                <SkeletonLine className="is-medium" />
              </span>
            ))}
          </div>
        </div>
        <div className="skeleton-section">
          <SkeletonLine className="is-section-title" />
          <SkeletonRows count={2} />
        </div>
      </>
    );
  }

  return (
    <div className="skeleton-section">
      <SkeletonLine className="is-section-title" />
      {variant === "list" ? <SkeletonRows count={5} /> : <SkeletonRows count={3} />}
    </div>
  );
};

export const PageSkeleton = ({
  variant = "generic",
}: {
  variant?: PageSkeletonVariant;
}) => (
  <div
    className={`page-skeleton page-skeleton--${variant}`}
    role="status"
    aria-live="polite"
    aria-busy="true"
  >
    <span className="sr-only">{t("loading")}</span>
    <header className="skeleton-header" aria-hidden="true">
      <span className="skeleton-shape skeleton-back" />
      <span className="skeleton-header-copy">
        <SkeletonLine className="is-title" />
        <SkeletonLine className="is-subtitle" />
      </span>
    </header>
    <div className="content skeleton-content" aria-hidden="true">
      <SkeletonContent variant={variant} />
    </div>
  </div>
);

export const RouteLoadingSkeleton = () => {
  const { pathname } = useLocation();
  let variant: PageSkeletonVariant = "generic";

  if (/\/group\/[^/]+\/balance$/.test(pathname)) variant = "balance";
  else if (/\/group\/[^/]+\/expenses$/.test(pathname)) variant = "list";
  else if (/\/group\/[^/]+$/.test(pathname)) variant = "dashboard";
  else if (/\/join\/[^/]+$/.test(pathname)) variant = "list";
  else if (
    pathname === "/create-group" ||
    pathname === "/join-group" ||
    /\/group\/[^/]+\/(add-member|add-expense|edit-expense\/[^/]+)$/.test(pathname)
  ) {
    variant = "form";
  }

  return <PageSkeleton variant={variant} />;
};

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
