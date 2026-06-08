import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./ScrollToTop";
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
        <Route path="/" element={<Home />} />
        <Route path="/buy" element={<Buy />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/tokenomics" element={<Tokenomics />} />
        <Route path="/staking" element={<Staking />} />
        <Route path="/mywallet" element={<MyWallet />} />
        <Route path="/sale-calendar" element={<SaleCalendar />} />
        <Route path="/referral" element={<Referral />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
