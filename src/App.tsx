import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CreateTripPage from "./pages/CreateTripPage";
import JoinTripPage from "./pages/JoinTripPage";
import AutoJoinPage from "./pages/AutoJoinPage";
import TripDashboard from "./pages/TripDashboard";
import AddExpensePage from "./pages/AddExpensePage";
import BalancePage from "./pages/BalancePage";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import Footer from "./components/Footer";
import "./App.css";

function App() {
  return (
    <div className="app">
      <div className="container">
        <Router>
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
            <Route path="/group/:groupId/balance" element={<BalancePage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
          </Routes>
          <Footer />
        </Router>
      </div>
    </div>
  );
}

export default App;
