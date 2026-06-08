import React from "react";
import Layout from "../Layout";
import ScrollAnimate from "../components/layouts/ScrollAnimate";
import StatusCard from "./../components/sections/StatusCard";
import WalletInfo from "./../components/common/WalletInfo";
import ReferralStatus from "./../components/common/ReferralStatus";
import MyTransactions from "./../components/common/MyTransactions";

const MyWallet = () => {
  return (
    <Layout pageTitle="Aizon - My Wallet">
      <ScrollAnimate>
        {/* status cards */}
        <StatusCard />
        <div className="pb-7.5 grid grid-cols-1 lg:grid-cols-2 gap-7.5">
          {/* wallet info card */}
          <WalletInfo />

          {/* referral status card */}
          <ReferralStatus />
        </div>
        {/* my transactions */}
        <MyTransactions />
      </ScrollAnimate>
    </Layout>
  );
};

export default MyWallet;
