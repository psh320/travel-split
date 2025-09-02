import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CreateTripPage from "./pages/CreateTripPage";
import JoinTripPage from "./pages/JoinTripPage";
import AutoJoinPage from "./pages/AutoJoinPage";
import TripDashboard from "./pages/TripDashboard";
import AddExpensePage from "./pages/AddExpensePage";
import BalancePage from "./pages/BalancePage";
import "./App.css";

function App() {
  return (
    <div className="app">
      <div className="container">
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/create-trip" element={<CreateTripPage />} />
            <Route path="/join-trip" element={<JoinTripPage />} />
            <Route path="/join/:roomCode" element={<AutoJoinPage />} />
            <Route path="/trip/:tripId" element={<TripDashboard />} />
            <Route
              path="/trip/:tripId/add-expense"
              element={<AddExpensePage />}
            />
            <Route path="/trip/:tripId/balance" element={<BalancePage />} />
          </Routes>
        </Router>
      </div>
    </div>
  );
}

export default App;
