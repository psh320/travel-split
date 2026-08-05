import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import { ToastProvider } from "./components/ui/Toast";
import "./App.css";

const CreateTripPage = lazy(() => import("./pages/CreateTripPage"));
const JoinTripPage = lazy(() => import("./pages/JoinTripPage"));
const AutoJoinPage = lazy(() => import("./pages/AutoJoinPage"));
const TripDashboard = lazy(() => import("./pages/TripDashboard"));
const AddExpensePage = lazy(() => import("./pages/AddExpensePage"));
const ExpensesPage = lazy(() => import("./pages/ExpensesPage"));
const BalancePage = lazy(() => import("./pages/BalancePage"));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage"));
const TermsPage = lazy(() => import("./pages/TermsPage"));

function App() {
  return (
    <ToastProvider>
      <div className="app">
        <div className="container">
          <Router>
          <Suspense
            fallback={
              <div className="loading">
                <div className="spinner" />
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/create-group" element={<CreateTripPage />} />
              <Route path="/join-group" element={<JoinTripPage />} />
              <Route path="/join/:roomCode" element={<AutoJoinPage />} />
              <Route path="/group/:groupId" element={<TripDashboard />} />
              <Route
                path="/group/:groupId/add-expense"
                element={<AddExpensePage />}
              />
              <Route
                path="/group/:groupId/edit-expense/:expenseId"
                element={<AddExpensePage />}
              />
              <Route path="/group/:groupId/expenses" element={<ExpensesPage />} />
              <Route path="/group/:groupId/balance" element={<BalancePage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
            </Routes>
          </Suspense>
          </Router>
        </div>
      </div>
    </ToastProvider>
  );
}

export default App;
