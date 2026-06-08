import React from "react";
import Layout from "../Layout";
import Leaderboard from "../components/common/Leaderboard";
import Banner from "../components/sections/Banner";
import SaleProgress from "../components/common/SaleProgress";
import TransactionsLatest from "../components/common/TransactionsLatest";
import ScrollAnimate from "../components/layouts/ScrollAnimate";
import RioCalculate from "../components/common/RioCalculate";

const Home = () => {
  return (
    <Layout pageTitle="Aizon - Presale Overview">
      <ScrollAnimate>
        {/* banner */}
        <Banner />

        <div className="pb-7.5 grid grid-cols-1 lg:grid-cols-12 gap-7.5">
          {/* sale progress card */}
          <div className="lg:col-span-8 h-full">
            <SaleProgress />
          </div>
          {/* Rio calculate card */}
          <div className="lg:col-span-4 h-full">
            <RioCalculate />
          </div>
        </div>

        <div className="pb-6.25 grid grid-cols-1 lg:grid-cols-2 gap-7.5">
          {/* last transaction card */}
          <TransactionsLatest />
          {/* leaderboard card */}
          <Leaderboard />
        </div>
      </ScrollAnimate>
    </Layout>
  );
};

export default Home;
