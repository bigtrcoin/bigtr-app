import React from "react";
import Layout from "../Layout";
import ScrollAnimate from "../components/layouts/ScrollAnimate";
import TokenomicsSection from "../components/sections/Tokenomics";

const Tokenomics = () => {
  return (
    <Layout pageTitle="Aizon - Tokenomics">
      <ScrollAnimate>
        <TokenomicsSection />
      </ScrollAnimate>
    </Layout>
  );
};

export default Tokenomics;
