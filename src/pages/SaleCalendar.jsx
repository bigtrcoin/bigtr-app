import React from "react";
import Layout from "../Layout";
import Phase from "../components/sections/Phase";
import ScrollAnimate from "../components/layouts/ScrollAnimate";

const SaleCalendar = () => {
  return (
    <Layout pageTitle="Aizon - Sale Calendar">
      <ScrollAnimate>
        <Phase />
      </ScrollAnimate>
    </Layout>
  );
};

export default SaleCalendar;
