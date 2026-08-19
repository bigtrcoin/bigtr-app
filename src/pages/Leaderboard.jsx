import React from "react";
import Layout from "../Layout";
import ScrollAnimate from "../components/layouts/ScrollAnimate";
import LeaderboardAll from "./../components/common/LeaderboardAll";

const Leaderboard = () => {
  return (
    <Layout pageTitle="BigTrCoin - Leaderboard">
      <ScrollAnimate>
        <LeaderboardAll />
      </ScrollAnimate>
    </Layout>
  );
};

export default Leaderboard;
