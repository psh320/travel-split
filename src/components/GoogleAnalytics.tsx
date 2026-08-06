import { useEffect, useRef } from "react";
import { matchPath, useLocation } from "react-router-dom";
import { trackPageView } from "../services/analytics";

const privateRoutePatterns = [
  "/join/:roomCode",
  "/group/:groupId/edit-expense/:expenseId",
  "/group/:groupId/add-expense",
  "/group/:groupId/expenses",
  "/group/:groupId/balance",
  "/group/:groupId",
];

const getAnalyticsPath = (pathname: string) =>
  privateRoutePatterns.find((pattern) => matchPath(pattern, pathname)) ??
  pathname;

const sanitizeReferrer = (referrer: string) => {
  if (!referrer) return undefined;

  try {
    const url = new URL(referrer);
    return `${url.origin}${url.pathname}`;
  } catch {
    return undefined;
  }
};

const GoogleAnalytics = () => {
  const { pathname } = useLocation();
  const previousPath = useRef<string | null>(null);

  useEffect(() => {
    const analyticsPath = getAnalyticsPath(pathname);
    const pageReferrer = previousPath.current
      ? `${window.location.origin}${previousPath.current}`
      : sanitizeReferrer(document.referrer);

    trackPageView(analyticsPath, pageReferrer);
    previousPath.current = analyticsPath;
  }, [pathname]);

  return null;
};

export default GoogleAnalytics;
