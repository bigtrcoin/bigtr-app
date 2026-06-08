import React from "react";
import BuyCard from "../common/BuyCard";
import TokenInfo from "../common/TokenInfo";
import HowToBuy from "../common/HowToBuy";
import StickyBox from "react-sticky-box";

const BuyNow = () => {
  return (
    <section className="pb-6.25">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7.5">
        {/* Buy now Card */}
        <div className="col-span-1 lg:col-span-8">
          <StickyBox offsetTop={20} offsetBottom={0}>
            <BuyCard />
          </StickyBox>
        </div>

        <div className="col-span-1 lg:col-span-4">
          <StickyBox offsetTop={20} offsetBottom={0}>
            <div className="grid gap-7.5">
              {/* token information */}
              <TokenInfo variant="buy" />

              {/* how to buy */}
              <HowToBuy />
            </div>
          </StickyBox>
        </div>
      </div>
    </section>
  );
};

export default BuyNow;
