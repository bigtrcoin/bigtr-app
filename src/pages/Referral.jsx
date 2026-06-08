import React from "react";
import Layout from "../Layout";
import ReferralSection from "../components/sections/ReferralSection";
import ScrollAnimate from "./../components/layouts/ScrollAnimate";

const Referral = () => {
  return (
    <Layout pageTitle="Aizon - Referral">
      {/* referral section  */}
      <ScrollAnimate>
        <ReferralSection />
      </ScrollAnimate>
    </Layout>
  );
};

export default Referral;
