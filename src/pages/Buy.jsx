import React from "react";
import Layout from "../Layout";
import BuyNow from "../components/sections/BuyNow";
import ScrollAnimate from "../components/layouts/ScrollAnimate";

const Buy = () => {
  return (
    <Layout pageTitle="Aizon - Buy Now">
      <ScrollAnimate>
        <BuyNow />
      </ScrollAnimate>
    </Layout>
  );
};

export default Buy;
