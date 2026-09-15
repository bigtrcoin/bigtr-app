import React from "react";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import ScrollToTop from "./ScrollToTop";
import ProtectedRoute from "./ProtectedRoute";
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
        {/* Eski cuzdan kapisi kaldirildi: /login artik dogrudan satin alma paneline gider */}
        <Route path="/login" element={<Navigate to="/" replace />} />

        {/* Satin alma paneli ana sayfadir: sitedeki "Buy Now" buraya iner */}
        <Route path="/" element={<ProtectedRoute><Buy /></ProtectedRoute>} />
        <Route path="/buy" element={<Navigate to="/" replace />} />
        <Route path="/overview" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
        <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
        <Route path="/tokenomics" element={<ProtectedRoute><Tokenomics /></ProtectedRoute>} />
        <Route path="/mywallet" element={<ProtectedRoute><MyWallet /></ProtectedRoute>} />
      </Routes>
    </HashRouter>
  );
};

export default App;