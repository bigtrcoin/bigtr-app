import React from "react";
import Layout from "../Layout";
import ScrollAnimate from "../components/layouts/ScrollAnimate";
import StatusCard from "./../components/sections/StatusCard";
import WalletInfo from "./../components/common/WalletInfo";
import MyTransactions from "./../components/common/MyTransactions";
import SmartAccountRecovery from "./../components/common/SmartAccountRecovery";

const MyWallet = () => {
  return (
    <Layout pageTitle="BigTR Coin - My Wallet">
      <ScrollAnimate>
        <StatusCard />
        <SmartAccountRecovery />
        <div className="pb-7.5">
          <WalletInfo />
        </div>
        <MyTransactions />
      </ScrollAnimate>
    </Layout>
  );
};

export default MyWallet;