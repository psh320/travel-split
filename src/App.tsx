import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import { ToastProvider } from "./components/ui/Toast";
import RouteMeta from "./components/RouteMeta";
import GoogleAnalytics from "./components/GoogleAnalytics";
import { RouteLoadingSkeleton } from "./components/ui/PageState";
import { getLocale } from "./i18n";
import "./App.css";

const CreateTripPage = lazy(() => import("./pages/CreateTripPage"));
const JoinTripPage = lazy(() => import("./pages/JoinTripPage"));
const AutoJoinPage = lazy(() => import("./pages/AutoJoinPage"));
const TripDashboard = lazy(() => import("./pages/TripDashboard"));
const AddExpensePage = lazy(() => import("./pages/AddExpensePage"));
const AddMemberPage = lazy(() => import("./pages/AddMemberPage"));
const ExpensesPage = lazy(() => import("./pages/ExpensesPage"));
const BalancePage = lazy(() => import("./pages/BalancePage"));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage"));
const TermsPage = lazy(() => import("./pages/TermsPage"));
const GuidesPage = lazy(() => import("./pages/GuidesPage"));
const GuideArticlePage = lazy(() => import("./pages/GuideArticlePage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));

function App() {
  useEffect(() => {
    const locale = getLocale();
    document.documentElement.lang = locale;

    const manifestLink = document.querySelector<HTMLLinkElement>(
      'link[rel="manifest"]'
    );
    if (manifestLink && locale === "ko") {
      manifestLink.href = "/manifest.ko.json";
    }
  }, []);

  return (
    <ToastProvider>
      <div className="app">
        <div className="container">
          <Router>
            <RouteMeta />
            <GoogleAnalytics />
            <Suspense fallback={<RouteLoadingSkeleton />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/create-group" element={<CreateTripPage />} />
                <Route path="/join-group" element={<JoinTripPage />} />
                <Route path="/join/:roomCode" element={<AutoJoinPage />} />
                <Route path="/group/:groupId" element={<TripDashboard />} />
                <Route
                  path="/group/:groupId/add-member"
                  element={<AddMemberPage />}
                />
                <Route
                  path="/group/:groupId/add-expense"
                  element={<AddExpensePage />}
                />
                <Route
                  path="/group/:groupId/edit-expense/:expenseId"
                  element={<AddExpensePage />}
                />
                <Route
                  path="/group/:groupId/expenses"
                  element={<ExpensesPage />}
                />
                <Route
                  path="/group/:groupId/balance"
                  element={<BalancePage />}
                />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/guides" element={<GuidesPage />} />
                <Route path="/guides/:slug" element={<GuideArticlePage />} />
                <Route path="/about" element={<AboutPage />} />
              </Routes>
            </Suspense>
          </Router>
        </div>
      </div>
    </ToastProvider>
  );
}

export default App;
