import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./ScrollToTop";
import ProtectedRoute from "./ProtectedRoute";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Leaderboard from "./pages/Leaderboard";
import Tokenomics from "./pages/Tokenomics";
import MyWallet from "./pages/MyWallet";
import Transactions from "./pages/Transactions";
import Buy from "./pages/Buy";

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
        <Route path="/mywallet" element={<ProtectedRoute><MyWallet /></ProtectedRoute>} />
      </Routes>
    </HashRouter>
  );
};

export default App;