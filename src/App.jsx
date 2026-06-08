import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./ScrollToTop";
import ProtectedRoute from "./ProtectedRoute";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Leaderboard from "./pages/Leaderboard";
import Tokenomics from "./pages/Tokenomics";
import Staking from "./pages/Staking";
import MyWallet from "./pages/MyWallet";
import Transactions from "./pages/Transactions";
import Buy from "./pages/Buy";
import SaleCalendar from "./pages/SaleCalendar";
import Referral from "./pages/Referral";

const App = () => {
  return (
    <HashRouter>
      <ScrollToTop />
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />

        {/* Protected */}
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/buy" element={<ProtectedRoute><Buy /></ProtectedRoute>} />
        <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
        <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
        <Route path="/tokenomics" element={<ProtectedRoute><Tokenomics /></ProtectedRoute>} />
        <Route path="/staking" element={<ProtectedRoute><Staking /></ProtectedRoute>} />
        <Route path="/mywallet" element={<ProtectedRoute><MyWallet /></ProtectedRoute>} />
        <Route path="/sale-calendar" element={<ProtectedRoute><SaleCalendar /></ProtectedRoute>} />
        <Route path="/referral" element={<ProtectedRoute><Referral /></ProtectedRoute>} />
      </Routes>
    </HashRouter>
  );
};

export default App;