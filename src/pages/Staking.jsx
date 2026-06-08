import React from "react";
import Layout from "../Layout";
import ScrollAnimate from "../components/layouts/ScrollAnimate";
import StakingSection from "./../components/sections/StakingSection";

const Staking = () => {
  return (
    <Layout pageTitle="Aizon - Staking">
      <ScrollAnimate>
        <StakingSection />
      </ScrollAnimate>
    </Layout>
  );
};

export default Staking;
