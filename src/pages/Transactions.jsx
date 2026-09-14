import React from "react";
import Layout from "../Layout";
import ScrollAnimate from "../components/layouts/ScrollAnimate";
import TransactionsAll from "../components/common/TransactionsAll";

const Transactions = () => {
  return (
    <Layout pageTitle="BigTR Coin - Transactions">
      <ScrollAnimate>
        <TransactionsAll />
      </ScrollAnimate>
    </Layout>
  );
};

export default Transactions;
